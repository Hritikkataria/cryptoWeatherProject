import { store } from '@/features/store';
import { updatePrice } from '@/features/cryptoSlice';
import { addNotification } from '@/features/notificationsSlice';
import { RootState } from '@/types';
import { PRICE_ALERT_THRESHOLD } from '@/utils/constants';
import { formatPercentage } from '@/utils/formatters';

interface BinanceTradeEvent {
  e: string;        // Event type
  E: number;        // Event time
  s: string;        // Symbol
  p: string;        // Price
  q: string;        // Quantity
  T: number;        // Trade time
}

interface BinanceSubscribeMessage {
  method: string;
  params: string[];
  id: number;
}

class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout = 1000;
  private subscriptionId = 1;
  private isConnecting = false;
  private pendingSubscriptions: string[] = [];
  private connectionCheckInterval: NodeJS.Timeout | null = null;

  private symbolMap: Record<string, string> = {
    'btcusdt': 'bitcoin',
    'ethusdt': 'ethereum',
    'dogeusdt': 'dogecoin',
    'adausdt': 'cardano',
    'solusdt': 'solana'
  };

  connect() {
    if (this.isConnecting) {
      console.log('Connection attempt already in progress');
      return;
    }

    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log('WebSocket is already connected');
      return;
    }

    this.isConnecting = true;

    try {
      console.log('Initiating WebSocket connection...');
      this.ws = new WebSocket('wss://stream.binance.com:9443/ws');

      // Set a timeout for the connection attempt
      const connectionTimeout = setTimeout(() => {
        if (this.ws?.readyState !== WebSocket.OPEN) {
          console.error('WebSocket connection timeout');
          this.ws?.close();
          this.handleConnectionFailure();
        }
      }, 5000);

      this.ws.onopen = () => {
        console.log('WebSocket connected successfully');
        clearTimeout(connectionTimeout);
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.setupConnectionCheck();
        this.subscribeToStreams();
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (this.isValidTradeEvent(data)) {
            this.handleMessage(data);
          } else if (data.id && this.pendingSubscriptions.includes(data.id.toString())) {
            console.log('Subscription confirmed:', data);
            this.pendingSubscriptions = this.pendingSubscriptions.filter(id => id !== data.id.toString());
          }
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        this.cleanup();
        this.handleConnectionFailure();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.cleanup();
        this.handleConnectionFailure();
      };
    } catch (error) {
      console.error('WebSocket connection error:', error);
      this.cleanup();
      this.handleConnectionFailure();
    }
  }

  private setupConnectionCheck() {
    if (this.connectionCheckInterval) {
      clearInterval(this.connectionCheckInterval);
    }

    this.connectionCheckInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ method: 'ping' }));
      } else {
        this.handleConnectionFailure();
      }
    }, 30000); // Check connection every 30 seconds
  }

  private cleanup() {
    this.isConnecting = false;
    if (this.connectionCheckInterval) {
      clearInterval(this.connectionCheckInterval);
      this.connectionCheckInterval = null;
    }
    this.ws = null;
  }

  private handleConnectionFailure() {
    this.cleanup();
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      const delay = this.reconnectTimeout * Math.pow(2, this.reconnectAttempts);
      console.log(`Attempting to reconnect in ${delay}ms (${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.reconnectAttempts++;
        this.connect();
      }, delay);
    } else {
      console.error('Max reconnection attempts reached');
      store.dispatch(
        addNotification({
          id: `websocket-error-${Date.now()}`,
          type: 'system',
          message: 'Lost connection to price feed. Please refresh the page.',
          timestamp: Date.now(),
        })
      );
    }
  }

  private subscribeToStreams() {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.error('Cannot subscribe: WebSocket is not connected');
      return;
    }

    const streams = Object.keys(this.symbolMap).map(
      symbol => `${symbol}@trade`
    );

    const subscribeMessage: BinanceSubscribeMessage = {
      method: 'SUBSCRIBE',
      params: streams,
      id: this.subscriptionId
    };

    this.pendingSubscriptions.push(this.subscriptionId.toString());
    this.subscriptionId++;

    try {
      this.ws.send(JSON.stringify(subscribeMessage));
      console.log('Subscription request sent:', streams);
    } catch (error) {
      console.error('Failed to send subscription request:', error);
      this.handleConnectionFailure();
    }
  }

  private isValidTradeEvent(data: any): data is BinanceTradeEvent {
    return (
      data &&
      typeof data === 'object' &&
      'e' in data &&
      data.e === 'trade' &&
      's' in data &&
      'p' in data
    );
  }

  private handleMessage(data: BinanceTradeEvent) {
    const symbol = data.s.toLowerCase();
    const cryptoId = this.symbolMap[symbol];
    if (!cryptoId) return;

    const price = parseFloat(data.p);
    if (isNaN(price)) return;

    const state = store.getState() as RootState;
    const coin = state.crypto.coins.find((c) => c.id === cryptoId);

    if (coin) {
      const priceChange = ((price - coin.price) / coin.price) * 100;
      
      store.dispatch(updatePrice({ id: cryptoId, price }));

      if (Math.abs(priceChange) > PRICE_ALERT_THRESHOLD) {
        store.dispatch(
          addNotification({
            id: `${cryptoId}-${Date.now()}`,
            type: 'price_alert',
            message: `${coin.name} price ${priceChange > 0 ? 'increased' : 'decreased'} by ${formatPercentage(Math.abs(priceChange))}`,
            timestamp: Date.now(),
          })
        );
      }
    }
  }

  disconnect() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        const unsubscribeMessage: BinanceSubscribeMessage = {
          method: 'UNSUBSCRIBE',
          params: Object.keys(this.symbolMap).map(symbol => `${symbol}@trade`),
          id: this.subscriptionId++
        };
        this.ws.send(JSON.stringify(unsubscribeMessage));
        console.log('Unsubscribe request sent');
      } catch (error) {
        console.error('Failed to send unsubscribe request:', error);
      }
    }
    this.cleanup();
    if (this.ws) {
      this.ws.close();
    }
  }
}

export const websocketService = new WebSocketService();