interface AuthLogData {
  route: string
  method: string
  status?: number
  userId?: string
  email?: string
  error?: string
  timestamp: string
  userAgent?: string
  ip?: string
}

class AuthLogger {
  private isEnabled: boolean

  constructor() {
    this.isEnabled = process.env.LOG_AUTH === '1'
  }

  private formatLog(data: AuthLogData): string {
    const { timestamp, route, method, status, userId, email, error } = data
    
    let logMessage = `[AUTH] ${timestamp} ${method} ${route}`
    
    if (status) logMessage += ` - ${status}`
    if (userId) logMessage += ` - User: ${userId}`
    if (email) logMessage += ` - Email: ${this.sanitizeEmail(email)}`
    if (error) logMessage += ` - Error: ${error}`
    
    return logMessage
  }

  private sanitizeEmail(email: string): string {
    // Show first 2 chars + domain for privacy
    const [local, domain] = email.split('@')
    if (!local || !domain) return '[invalid-email]'
    
    const sanitizedLocal = local.length > 2 
      ? `${local.substring(0, 2)}***`
      : '***'
    
    return `${sanitizedLocal}@${domain}`
  }

  logAuthAttempt(data: Omit<AuthLogData, 'timestamp'>) {
    if (!this.isEnabled) return
    
    const logData: AuthLogData = {
      ...data,
      timestamp: new Date().toISOString()
    }
    
    console.log(this.formatLog(logData))
  }

  logSignInSuccess(userId: string, email: string, route: string) {
    this.logAuthAttempt({
      route,
      method: 'POST',
      status: 200,
      userId,
      email
    })
  }

  logSignInFailure(email: string, error: string, route: string) {
    this.logAuthAttempt({
      route,
      method: 'POST',
      status: 401,
      email,
      error
    })
  }

  logTokenVerification(success: boolean, userId?: string, route?: string) {
    this.logAuthAttempt({
      route: route || '/api/auth/verify',
      method: 'GET',
      status: success ? 200 : 401,
      userId: success ? userId : undefined,
      error: success ? undefined : 'Token verification failed'
    })
  }

  logSessionCheck(hasSession: boolean, userId?: string) {
    this.logAuthAttempt({
      route: '/api/auth/me',
      method: 'GET',
      status: hasSession ? 200 : 401,
      userId: hasSession ? userId : undefined,
      error: hasSession ? undefined : 'No valid session'
    })
  }

  logMiddleware(route: string, method: string, hasAuth: boolean, userId?: string) {
    this.logAuthAttempt({
      route,
      method,
      status: hasAuth ? 200 : 401,
      userId: hasAuth ? userId : undefined,
      error: hasAuth ? undefined : 'Middleware auth check failed'
    })
  }
}

export const authLogger = new AuthLogger()