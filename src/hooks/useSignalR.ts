"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import { signalRClient, type ConnectionState, type SignalREvents, type ChatMessage, type MessageDeletedInfo } from "@/lib/signalr";
import type { Notification as ApiNotification } from "@/lib/types/api-types";
import { useNotificationStore } from "@/store/notification-store";

export function useSignalR() {
  const token = useAuthStore((state) => state.token);
  const [connectionState, setConnectionState] = useState<ConnectionState>(
    () => signalRClient.getConnectionState(),
  );
  const stateListenerRef = useRef<(() => void) | null>(null);
  const handlersRef = useRef<Partial<SignalREvents>>({});

  useEffect(() => {
    stateListenerRef.current = signalRClient.onStateChange(setConnectionState);

    return () => {
      stateListenerRef.current?.();
      stateListenerRef.current = null;
    };
  }, []);

  const connect = useCallback(async () => {
    if (!token) return;
    try {
      await signalRClient.connect();
    } catch (error) {
      console.error("SignalR connection failed:", error);
    }
  }, [token]);

  const disconnect = useCallback(async () => {
    await signalRClient.disconnect();
  }, []);

  const joinSpaceGroup = useCallback(async (spaceId: string) => {
    try {
      await signalRClient.joinSpace(spaceId);
    } catch (error) {
      console.error("Failed to join space:", error);
    }
  }, []);

  const leaveSpaceGroup = useCallback(async (spaceId: string) => {
    try {
      await signalRClient.leaveSpace(spaceId);
    } catch (error) {
      console.error("Failed to leave space:", error);
    }
  }, []);

  const on = useCallback(<K extends keyof SignalREvents>(event: K, handler: SignalREvents[K]) => {
    handlersRef.current[event] = handler;
    signalRClient.on(event, handler);
  }, []);

  const off = useCallback(<K extends keyof SignalREvents>(event: K) => {
    delete handlersRef.current[event];
    signalRClient.off(event);
  }, []);

  useEffect(() => {
    if (token && connectionState === "disconnected") {
      connect();
    } else if (!token && connectionState !== "disconnected") {
      disconnect();
    }
  }, [token, connectionState, connect, disconnect]);

  useEffect(() => {
    return () => {
      Object.keys(handlersRef.current).forEach((event) => {
        signalRClient.off(event as keyof SignalREvents);
      });
      handlersRef.current = {};
    };
  }, []);

  return {
    connectionState,
    connect,
    disconnect,
    joinSpace: joinSpaceGroup,
    leaveSpace: leaveSpaceGroup,
    joinSpaceGroup,
    leaveSpaceGroup,
    on,
    off,
    isConnected: connectionState === "connected",
  };
}

export function useChatMessages(spaceId: string, channelId: string | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const { on, off, joinSpaceGroup, leaveSpaceGroup } = useSignalR();

  useEffect(() => {
    if (!channelId) return;

    const handleReceiveMessage = (message: ChatMessage) => {
      if (message.channelId === channelId && !message.isDeleted) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === message.id)) return prev;
          return [...prev, message];
        });
      }
    };

    const handleMessageEdited = (message: ChatMessage) => {
      if (message.channelId === channelId) {
        setMessages((prev) =>
          prev.map((m) => (m.id === message.id ? message : m))
        );
      }
    };

    const handleMessageDeleted = (info: MessageDeletedInfo) => {
      if (info.channelId === channelId) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === info.messageId ? { ...m, isDeleted: true } : m
          )
        );
      }
    };

    on("ReceiveMessage", handleReceiveMessage);
    on("MessageEdited", handleMessageEdited);
    on("MessageDeleted", handleMessageDeleted);

    joinSpaceGroup(spaceId);

    return () => {
      off("ReceiveMessage");
      off("MessageEdited");
      off("MessageDeleted");
      leaveSpaceGroup(spaceId);
    };
  }, [spaceId, channelId, on, off, joinSpaceGroup, leaveSpaceGroup]);

  const addMessage = useCallback((message: ChatMessage) => {
    setMessages((prev) => {
      if (prev.some((m) => m.id === message.id)) return prev;
      return [...prev, message];
    });
  }, []);

  const updateMessage = useCallback((message: ChatMessage) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === message.id ? message : m))
    );
  }, []);

  const deleteMessage = useCallback((messageId: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, isDeleted: true } : m))
    );
  }, []);

  return {
    messages,
    addMessage,
    updateMessage,
    deleteMessage,
  };
}

export function useNotifications() {
  const notifications = useNotificationStore((state) => state.notifications);
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const addNotification = useNotificationStore((state) => state.addNotification);
  const markAsRead = useNotificationStore((state) => state.markAsRead);
  const markAllAsRead = useNotificationStore((state) => state.markAllAsRead);
  const { on, off } = useSignalR();

  useEffect(() => {
    const handleNotification = (notification: ApiNotification) => {
      addNotification(notification);
    };

    on("ReceiveNotification", handleNotification);

    return () => {
      off("ReceiveNotification");
    };
  }, [on, off, addNotification]);

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  };
}