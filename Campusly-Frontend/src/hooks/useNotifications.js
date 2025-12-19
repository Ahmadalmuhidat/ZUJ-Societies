import { useState, useEffect, useCallback } from 'react';
import AxiosClient from '../config/axios';
import { toast } from 'react-toastify';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [eventSource, setEventSource] = useState(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const maxReconnectAttempts = 5;

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await AxiosClient.get('/notifications');

      if (response.status === 200) {
        setNotifications(response.data.data);
        setUnreadCount(response.data.data.filter(notification => !(notification.Read)).length);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  }, []);

  const connectServerSentEventsClient = useCallback(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) return;

    if (eventSource) {
      eventSource.close();
      setEventSource(null);
    }

    const serverSentEventsClient = new EventSource(`${process.env.REACT_APP_API_URL}/notifications/sse?token=${token}`);

    serverSentEventsClient.onopen = () => {
      setIsConnected(true);
      setReconnectAttempts(0);
    };

    serverSentEventsClient.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'connected') {
          console.log('Connected to notifications:', data.message);
        } else if (data.type === 'heartbeat') {
          console.log('SSE heartbeat received');
        } else {
          const notificationData = {
            id: data.ID || data.id,
            type: data.Type || data.type,
            title: data.Title || data.title,
            message: data.Message || data.message,
            data: data.Data || data.data || {},
            time: data.CreatedAt || data.time || new Date().toISOString(),
            Read: false
          };

          setNotifications(prev => {
            const exists = prev.some(n => (n.ID || n.id) === notificationData.id);
            if (exists) return prev;
            return [notificationData, ...prev];
          });

          setUnreadCount(prev => prev + 1);

          if (Notification.permission === 'granted') {
            new Notification(notificationData.title, {
              body: notificationData.message,
              icon: '/favicon.ico'
            });
          }

          toast.info(`${notificationData.title}: ${notificationData.message}`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      } catch (error) {
        console.error('Error parsing SSE data:', error);
      }
    };

    serverSentEventsClient.onerror = (error) => {
      console.error('SSE connection error:', error);
      setIsConnected(false);

      if (serverSentEventsClient.readyState === EventSource.CLOSED && reconnectAttempts < maxReconnectAttempts) {
        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
        // console.log(`Attempting to reconnect in ${delay}ms (attempt ${reconnectAttempts + 1}/${maxReconnectAttempts})`);

        setTimeout(() => {
          setReconnectAttempts(prev => prev + 1);
          connectServerSentEventsClient();
        }, delay);
      } else if (reconnectAttempts >= maxReconnectAttempts) {
        console.error('Max reconnection attempts reached. Please refresh the page.');
      }
    };

    setEventSource(serverSentEventsClient);
  }, []);

  const disconnectServerSentEventsClient = useCallback(() => {
    if (eventSource) {
      eventSource.close();
      setEventSource(null);
      setIsConnected(false);
    }
  }, [eventSource]);

  const markAsRead = useCallback(async (notificationId) => {
    try {
      await AxiosClient.post('/notifications/mark-read', {
        notificationId
      });

      setNotifications(prev =>
        prev.map(notification =>
          notification.ID === notificationId || notification.id === notificationId
            ? {
              ...notification,
              Read: true
            }
            : notification
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await AxiosClient.post('/notifications/mark-all-read');

      setNotifications(prev => prev.map(notification => ({
        ...notification,
        Read: true
      })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  }, []);

  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return Notification.permission === 'granted';
  }, []);

  useEffect(() => {
    fetchNotifications();
    requestNotificationPermission();

    const timer = setTimeout(() => {
      connectServerSentEventsClient();
    }, 1000);

    return () => {
      clearTimeout(timer);
      disconnectServerSentEventsClient();
    };
  }, []);

  const reconnect = useCallback(() => {
    setReconnectAttempts(0);
    connectServerSentEventsClient();
  }, [connectServerSentEventsClient]);

  return {
    notifications,
    unreadCount,
    isConnected,
    reconnectAttempts,
    maxReconnectAttempts,
    markAsRead,
    markAllAsRead,
    fetchNotifications,
    connectServerSentEventsClient,
    disconnectServerSentEventsClient,
    reconnect
  };
};
