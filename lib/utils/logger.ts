type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: any;
  timestamp: string;
  context?: string;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isProduction = process.env.NODE_ENV === 'production';
  
  private formatMessage(level: LogLevel, message: string, data?: any): LogEntry {
    return {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
      context: typeof window !== 'undefined' ? 'client' : 'server'
    };
  }

  private log(entry: LogEntry): void {
    if (this.isDevelopment) {
      const { level, message, data } = entry;
      const emoji = {
        info: '💬',
        warn: '⚠️',
        error: '❌',
        debug: '🔍'
      }[level];
      
      const consoleMethod = level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log';
      
      if (data !== undefined) {
        console[consoleMethod](`${emoji} ${message}`, data);
      } else {
        console[consoleMethod](`${emoji} ${message}`);
      }
    }
    
    // In production, you would send to a logging service
    if (this.isProduction) {
      // TODO: Send to logging service like LogRocket, Sentry, etc.
      // Example: sendToLoggingService(entry);
    }
  }

  info(message: string, data?: any): void {
    this.log(this.formatMessage('info', message, data));
  }

  warn(message: string, data?: any): void {
    this.log(this.formatMessage('warn', message, data));
  }

  error(message: string, error?: any): void {
    const errorData = error instanceof Error ? {
      message: error.message,
      stack: error.stack,
      name: error.name
    } : error;
    
    this.log(this.formatMessage('error', message, errorData));
  }

  debug(message: string, data?: any): void {
    if (this.isDevelopment) {
      this.log(this.formatMessage('debug', message, data));
    }
  }

  // Special method for automation notifications
  automation(type: string, payload: any): void {
    const message = `Automation: ${type}`;
    this.info(message, payload);
  }

  // Special method for purchase notifications
  purchase(customerName: string, email: string, product: string, details?: any): void {
    const message = `Purchase completed: ${product}`;
    this.info(message, {
      customer: `${customerName} (${email})`,
      product,
      ...details
    });
  }
}

// Export singleton instance
export const logger = new Logger(); 