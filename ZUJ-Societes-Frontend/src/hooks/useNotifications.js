import { useState, useEffect, useCallback } from 'react';
import AxiosClient from '../config/axios';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [eventSource, setEventSource] = useState(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const maxReconnectAttempts = 5;

  const fetchNotifications = useCallback(async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) return;

      const response = await AxiosClient.get('/notifications', {
        params: { token }
      });

      if (response.status === 200) {
        setNotifications(response.data.data);
        setUnreadCount(response.data.data.filter(n => !(n.Read || n.read)).length);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  }, []);

  const connectSSE = useCallback(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) return;

    if (eventSource) {
      eventSource.close();
      setEventSource(null);
    }

    const sse = new EventSource(`${process.env.REACT_APP_API_URL || 'http://localhost:4000'}/notifications/sse?token=${token}`);
    
    sse.onopen = () => {
      console.log('SSE connection opened');
      setIsConnected(true);
      setReconnectAttempts(0);
    };

    sse.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'connected') {
          console.log('Connected to notifications:', data.message);
        } else if (data.type === 'heartbeat') {
          console.log('SSE heartbeat received');
        } else {
          console.log('New notification received:', data);
          
          setNotifications(prev => {
            const exists = prev.some(n => n.id === data.id);
            if (exists) return prev;
            
            return [data, ...prev];
          });
          
          setUnreadCount(prev => prev + 1);
          
          if (Notification.permission === 'granted') {
            new Notification(data.title, {
              body: data.message,
              icon: '/favicon.ico'
            });
          }
        }
      } catch (error) {
        console.error('Error parsing SSE data:', error);
      }
    };

    sse.onerror = (error) => {
      console.error('SSE connection error:', error);
      setIsConnected(false);
      
      if (sse.readyState === EventSource.CLOSED && reconnectAttempts < maxReconnectAttempts) {
        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
        console.log(`Attempting to reconnect in ${delay}ms (attempt ${reconnectAttempts + 1}/${maxReconnectAttempts})`);
        
        setTimeout(() => {
          setReconnectAttempts(prev => prev + 1);
          connectSSE();
        }, delay);
      } else if (reconnectAttempts >= maxReconnectAttempts) {
        console.error('Max reconnection attempts reached. Please refresh the page.');
      }
    };

    setEventSource(sse);
  }, []);

  const disconnectSSE = useCallback(() => {
    if (eventSource) {
      eventSource.close();
      setEventSource(null);
      setIsConnected(false);
    }
  }, [eventSource]);

  const markAsRead = useCallback(async (notificationId) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      console.log('Frontend marking notification as read:', notificationId);
      
      await AxiosClient.post('/notifications/mark-read', {
        token,
        notificationId
      });

      setNotifications(prev => 
        prev.map(notif => 
          notif.ID === notificationId || notif.id === notificationId
            ? { ...notif, Read: true, read: true }
            : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      await AxiosClient.post('/notifications/mark-all-read', {
        token
      });

      setNotifications(prev => prev.map(notif => ({ ...notif, Read: true, read: true })));
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
      connectSSE();
    }, 1000);

    return () => {
      clearTimeout(timer);
      disconnectSSE();
    };
  }, []);

  const reconnect = useCallback(() => {
    setReconnectAttempts(0);
    connectSSE();
  }, [connectSSE]);

  return {
    notifications,
    unreadCount,
    isConnected,
    reconnectAttempts,
    maxReconnectAttempts,
    markAsRead,
    markAllAsRead,
    fetchNotifications,
    connectSSE,
    disconnectSSE,
    reconnect
  };
};
