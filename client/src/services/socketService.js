import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect() {
    // Get the backend server URL from environment variables
    let serverUrl = import.meta.env.VITE_BACKEND_SERVER_PORT || 'http://localhost:8000';
    
    // Remove /api suffix if present (socket.io connects to base URL)
    serverUrl = serverUrl.replace('/api', '');
    
    console.log('🔌 Attempting to connect to socket server:', serverUrl);
    
    this.socket = io(serverUrl, {
      transports: ['polling'], // Start with polling only
      timeout: 10000,
      forceNew: false,
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 3,
      reconnectionDelay: 2000,
    });

    this.socket.on('connect', () => {
      this.isConnected = true;
      console.log('✅ Connected to server via Socket.io');
      console.log('🔗 Connection ID:', this.socket.id);
    });

    this.socket.on('disconnect', (reason) => {
      this.isConnected = false;
      console.log('❌ Disconnected from server. Reason:', reason);
    });

    this.socket.on('connect_error', (error) => {
      this.isConnected = false;
      console.error('❌ Connection error:', error.message);
      console.error('Full error:', error);
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('🔄 Reconnected after', attemptNumber, 'attempts');
    });

    this.socket.on('reconnect_error', (error) => {
      console.error('🔄 Reconnection failed:', error.message);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Listen for dashboard statistics updates
  onDashboardStatsUpdate(callback) {
    if (this.socket) {
      this.socket.on('dashboard_stats_updated', callback);
    }
  }

  // Listen for issue progress updates
  onIssueProgressUpdate(callback) {
    if (this.socket) {
      this.socket.on('issue_progress_updated', callback);
    }
  }

  // Listen for issue deletions
  onIssueDeleted(callback) {
    if (this.socket) {
      this.socket.on('issue_deleted', callback);
    }
  }

  // Remove event listeners
  off(eventName, callback) {
    if (this.socket) {
      this.socket.off(eventName, callback);
    }
  }

  // Emit events (if needed)
  emit(eventName, data) {
    if (this.socket && this.isConnected) {
      this.socket.emit(eventName, data);
    }
  }

  // Test socket connection
  testConnection() {
    if (this.socket && this.isConnected) {
      console.log('🧪 Testing socket connection...');
      this.socket.emit('test_connection', { message: 'Hello from client!', timestamp: new Date() });
      return true;
    } else {
      console.log('❌ Socket not connected for testing');
      return false;
    }
  }

  getSocket() {
    return this.socket;
  }

  isSocketConnected() {
    return this.isConnected;
  }
}

// Create a singleton instance
const socketService = new SocketService();

export default socketService;
