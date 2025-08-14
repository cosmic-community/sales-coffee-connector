interface AuthAttempt {
  route: string
  method: string
  email: string
  timestamp?: string
}

export class AuthLogger {
  static logAuthAttempt(attempt: AuthAttempt) {
    if (process.env.LOG_AUTH === '1') {
      console.log('🔐 Auth Attempt:', {
        ...attempt,
        timestamp: attempt.timestamp || new Date().toISOString()
      })
    }
  }

  static logSignInSuccess(userId: string, email: string, route: string) {
    if (process.env.LOG_AUTH === '1') {
      console.log('✅ Sign In Success:', {
        userId,
        email,
        route,
        timestamp: new Date().toISOString()
      })
    }
  }

  static logSignInFailure(email: string, reason: string, route: string) {
    if (process.env.LOG_AUTH === '1') {
      console.log('❌ Sign In Failure:', {
        email,
        reason,
        route,
        timestamp: new Date().toISOString()
      })
    }
  }

  static logTokenVerification(success: boolean, userId?: string) {
    if (process.env.LOG_AUTH === '1') {
      console.log(success ? '✅ Token Valid:' : '❌ Token Invalid:', {
        success,
        userId,
        timestamp: new Date().toISOString()
      })
    }
  }

  static logMiddleware(path: string, method: string, authenticated: boolean, userId?: string) {
    if (process.env.LOG_AUTH === '1') {
      console.log('🔒 Middleware Check:', {
        path,
        method,
        authenticated,
        userId,
        timestamp: new Date().toISOString()
      })
    }
  }
}

export const authLogger = AuthLogger