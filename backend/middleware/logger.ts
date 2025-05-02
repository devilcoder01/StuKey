// Simple logger utility

enum LogLevel {
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR',
    DEBUG = 'DEBUG'
}

class Logger {
    private context: string;
    
    constructor(context: string) {
        this.context = context;
    }
    
    private log(level: LogLevel, message: string, data?: any): void {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            level,
            context: this.context,
            message,
            data
        };
        
        // In a production environment, you might want to use a proper logging library
        // like winston or pino, and possibly send logs to a service like CloudWatch or Datadog
        
        if (level === LogLevel.ERROR) {
            console.error(JSON.stringify(logEntry));
        } else if (level === LogLevel.WARN) {
            console.warn(JSON.stringify(logEntry));
        } else if (level === LogLevel.DEBUG && process.env.NODE_ENV === 'development') {
            console.debug(JSON.stringify(logEntry));
        } else if (level === LogLevel.INFO) {
            console.log(JSON.stringify(logEntry));
        }
    }
    
    info(message: string, data?: any): void {
        this.log(LogLevel.INFO, message, data);
    }
    
    warn(message: string, data?: any): void {
        this.log(LogLevel.WARN, message, data);
    }
    
    error(message: string, data?: any): void {
        this.log(LogLevel.ERROR, message, data);
    }
    
    debug(message: string, data?: any): void {
        this.log(LogLevel.DEBUG, message, data);
    }
}

export const createLogger = (context: string): Logger => {
    return new Logger(context);
};

export default createLogger;
