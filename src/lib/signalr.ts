import * as signalR from "@microsoft/signalr";
import { useAuthStore } from "@/store/auth-store";
import type { ChatMessage, Notification as ApiNotification } from "@/lib/types/api-types";

const BACKEND_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_BASE_URL ?? "http://collabspace-dev.runasp.net";
const HUB_URL = `${BACKEND_BASE_URL}/chathub`;

type ConnectionState = "disconnected" | "connecting" | "connected" | "reconnecting";

interface SignalREvents {
  ReceiveMessage: (message: ChatMessage) => void;
  MessageEdited: (message: ChatMessage) => void;
  MessageDeleted: (info: MessageDeletedInfo) => void;
  ReceiveNotification: (notification: ApiNotification) => void;
}

interface MessageDeletedInfo {
  channelId: string;
  messageId: string;
  deletedById: string;
  deletedAt: string;
}

class SignalRClient {
  private connection: signalR.HubConnection | null = null;
  private state: ConnectionState = "disconnected";
  private stateListeners: Set<(state: ConnectionState) => void> = new Set();
  private eventHandlers: Partial<SignalREvents> = {};
  private currentSpaceId: string | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  getConnectionState(): ConnectionState {
    return this.state;
  }

  onStateChange(listener: (state: ConnectionState) => void): () => void {
    this.stateListeners.add(listener);
    return () => this.stateListeners.delete(listener);
  }

  private setState(newState: ConnectionState) {
    this.state = newState;
    this.stateListeners.forEach((listener) => listener(newState));
  }

  on<K extends keyof SignalREvents>(event: K, handler: SignalREvents[K]) {
    this.eventHandlers[event] = handler;
    if (this.connection) {
      this.connection.on(event, handler as (...args: unknown[]) => void);
    }
  }

  off<K extends keyof SignalREvents>(event: K) {
    delete this.eventHandlers[event];
    if (this.connection) {
      this.connection.off(event);
    }
  }

  async connect(): Promise<void> {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      return;
    }

    const token = useAuthStore.getState().token;
    if (!token) {
      throw new Error("No authentication token available");
    }

    this.setState("connecting");

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${HUB_URL}?access_token=${encodeURIComponent(token)}`, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext) => {
          if (retryContext.previousRetryCount >= this.maxReconnectAttempts) {
            return null;
          }
          this.setState("reconnecting");
          return Math.min(1000 * 2 ** retryContext.previousRetryCount, 30000);
        },
      })
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.connection.onreconnecting(() => {
      this.setState("reconnecting");
    });

    this.connection.onreconnected(() => {
      this.setState("connected");
      this.reconnectAttempts = 0;
      if (this.currentSpaceId) {
        this.joinSpace(this.currentSpaceId).catch(console.error);
      }
      Object.entries(this.eventHandlers).forEach(([event, handler]) => {
        this.connection?.on(event, handler as (...args: unknown[]) => void);
      });
    });

    this.connection.onclose((error) => {
      if (error) {
        console.error("SignalR connection closed:", error);
      }
      this.setState("disconnected");
    });

    Object.entries(this.eventHandlers).forEach(([event, handler]) => {
      this.connection?.on(event, handler as (...args: unknown[]) => void);
    });

    try {
      await this.connection.start();
      this.setState("connected");
      this.reconnectAttempts = 0;
    } catch (error) {
      this.setState("disconnected");
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
      this.setState("disconnected");
      this.currentSpaceId = null;
    }
  }

  async joinSpace(spaceId: string): Promise<void> {
    if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
      throw new Error("Not connected to SignalR hub");
    }
    this.currentSpaceId = spaceId;
    await this.connection.invoke("JoinSpace", spaceId);
  }

  async leaveSpace(spaceId: string): Promise<void> {
    if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
      return;
    }
    if (this.currentSpaceId === spaceId) {
      this.currentSpaceId = null;
    }
    await this.connection.invoke("LeaveSpace", spaceId);
  }

  isConnected(): boolean {
    return this.connection?.state === signalR.HubConnectionState.Connected;
  }
}

export const signalRClient = new SignalRClient();

export type {
  ConnectionState,
  SignalREvents,
  ChatMessage,
  MessageDeletedInfo,
  ApiNotification as Notification,
};