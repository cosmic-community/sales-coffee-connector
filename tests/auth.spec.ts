import { test, expect } from '@playwright/test'

// Test user credentials
const TEST_USER = {
  email: 'test@example.com',
  password: 'TestPassword123!',
  firstName: 'Test',
  lastName: 'User'
}

test.describe('Authentication Flow', () => {
  
  test.beforeEach(async ({ page }) => {
    // Enable auth logging for tests
    await page.addInitScript(() => {
      localStorage.setItem('LOG_AUTH', '1')
    })
  })

  test('debug endpoint returns proper environment info', async ({ page }) => {
    // Enable LOG_AUTH for debug endpoint
    process.env.LOG_AUTH = '1'
    
    const response = await page.request.get('/api/auth/debug')
    expect(response.status()).toBe(200)
    
    const debugInfo = await response.json()
    
    // Check environment info structure
    expect(debugInfo).toHaveProperty('env')
    expect(debugInfo).toHaveProperty('cookiesSummary')
    expect(debugInfo).toHaveProperty('sessionStatus')
    expect(debugInfo).toHaveProperty('authConfigStatus')
    
    // Verify required environment variables are set
    expect(debugInfo.env.JWT_SECRET).toBe('[SET]')
    expect(debugInfo.env.COSMIC_BUCKET_SLUG).toBe('[SET]')
    expect(debugInfo.env.COSMIC_READ_KEY).toBe('[SET]')
    
    // Check auth config status
    expect(debugInfo.authConfigStatus.hasJwtSecret).toBe(true)
    expect(debugInfo.authConfigStatus.jwtSecretLength).toBeGreaterThan(32)
    expect(debugInfo.authConfigStatus.hasCosmicConfig).toBe(true)
  })

  test('user cannot access protected routes without authentication', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Should redirect to login
    await expect(page).toHaveURL(/\/login/)
    
    // Should have return URL parameter
    expect(page.url()).toContain('returnUrl=%2Fdashboard')
  })

  test('user can sign up with valid credentials', async ({ page }) => {
    await page.goto('/signup')
    
    // Fill signup form
    await page.fill('#firstName', TEST_USER.firstName)
    await page.fill('#lastName', TEST_USER.lastName)
    await page.fill('#email', TEST_USER.email)
    await page.fill('#password', TEST_USER.password)
    await page.fill('#confirmPassword', TEST_USER.password)
    
    // Submit form
    await page.click('button[type="submit"]')
    
    // Should redirect to onboarding or dashboard
    await expect(page).toHaveURL(/\/(dashboard|onboarding)/)
  })

  test('user can sign in with valid credentials', async ({ page }) => {
    await page.goto('/login')
    
    // Fill login form
    await page.fill('#email', TEST_USER.email)
    await page.fill('#password', TEST_USER.password)
    
    // Submit form
    await page.click('button[type="submit"]')
    
    // Wait for navigation
    await page.waitForNavigation()
    
    // Should be on dashboard
    await expect(page).toHaveURL(/\/dashboard/)
  })

  test('authentication session persists after page refresh', async ({ page }) => {
    // First sign in
    await page.goto('/login')
    await page.fill('#email', TEST_USER.email)
    await page.fill('#password', TEST_USER.password)
    await page.click('button[type="submit"]')
    await page.waitForNavigation()
    
    // Verify we're on dashboard
    await expect(page).toHaveURL(/\/dashboard/)
    
    // Refresh the page
    await page.reload()
    
    // Should still be on dashboard (not redirected to login)
    await expect(page).toHaveURL(/\/dashboard/)
  })

  test('session API returns valid user data', async ({ page }) => {
    // Sign in first
    await page.goto('/login')
    await page.fill('#email', TEST_USER.email)
    await page.fill('#password', TEST_USER.password)
    await page.click('button[type="submit"]')
    await page.waitForNavigation()
    
    // Check session endpoint
    const response = await page.request.get('/api/auth/me')
    expect(response.status()).toBe(200)
    
    const userData = await response.json()
    expect(userData).toHaveProperty('id')
    expect(userData).toHaveProperty('email')
    expect(userData.email).toBe(TEST_USER.email)
    expect(userData).toHaveProperty('firstName')
    expect(userData).toHaveProperty('lastName')
  })

  test('user can sign out successfully', async ({ page }) => {
    // Sign in first
    await page.goto('/login')
    await page.fill('#email', TEST_USER.email)
    await page.fill('#password', TEST_USER.password)
    await page.click('button[type="submit"]')
    await page.waitForNavigation()
    
    // Sign out
    await page.click('[data-testid="user-menu"]') // Assuming user menu exists
    await page.click('[data-testid="sign-out"]') // Assuming sign out button exists
    
    // Should redirect to home or login
    await expect(page).toHaveURL(/\/(login|$)/)
    
    // Trying to access dashboard should redirect to login
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/login/)
  })

  test('invalid credentials show appropriate error', async ({ page }) => {
    await page.goto('/login')
    
    // Fill with invalid credentials
    await page.fill('#email', 'invalid@example.com')
    await page.fill('#password', 'wrongpassword')
    
    // Submit form
    await page.click('button[type="submit"]')
    
    // Should show error message
    await expect(page.locator('[data-testid="error-message"], .text-red-700')).toContainText(/invalid/i)
    
    // Should still be on login page
    await expect(page).toHaveURL(/\/login/)
  })

  test('protected API routes require authentication', async ({ page }) => {
    // Try to access protected API route without auth
    const response = await page.request.get('/api/users/profile')
    expect(response.status()).toBe(401)
    
    const errorData = await response.json()
    expect(errorData).toHaveProperty('error')
  })

  test('cookies are set correctly after successful login', async ({ page }) => {
    await page.goto('/login')
    await page.fill('#email', TEST_USER.email)
    await page.fill('#password', TEST_USER.password)
    await page.click('button[type="submit"]')
    await page.waitForNavigation()
    
    // Check that auth cookie is set
    const cookies = await page.context().cookies()
    const authCookie = cookies.find(cookie => 
      cookie.name === 'auth-token' || cookie.name === '__Secure-auth-token'
    )
    
    expect(authCookie).toBeDefined()
    expect(authCookie?.httpOnly).toBe(true)
    
    if (process.env.NODE_ENV === 'production') {
      expect(authCookie?.secure).toBe(true)
      expect(authCookie?.name).toBe('__Secure-auth-token')
    }
  })
})

test.describe('Password Security', () => {
  
  test('password requirements are enforced', async ({ page }) => {
    await page.goto('/signup')
    
    // Test weak password
    await page.fill('#firstName', 'Test')
    await page.fill('#lastName', 'User')
    await page.fill('#email', 'test@example.com')
    await page.fill('#password', '123')
    await page.fill('#confirmPassword', '123')
    
    await page.click('button[type="submit"]')
    
    // Should show password validation error
    await expect(page.locator('.text-red-700, [data-testid="error-message"]')).toContainText(/password/i)
  })
  
  test('password confirmation must match', async ({ page }) => {
    await page.goto('/signup')
    
    await page.fill('#firstName', 'Test')
    await page.fill('#lastName', 'User')
    await page.fill('#email', 'test@example.com')
    await page.fill('#password', 'StrongPassword123!')
    await page.fill('#confirmPassword', 'DifferentPassword123!')
    
    await page.click('button[type="submit"]')
    
    // Should show password mismatch error
    await expect(page.locator('.text-red-700, [data-testid="error-message"]')).toContainText(/match/i)
  })
})

test.describe('Error Handling', () => {
  
  test('handles network errors gracefully', async ({ page }) => {
    // Intercept and fail the login request
    await page.route('/api/auth/login', route => route.abort())
    
    await page.goto('/login')
    await page.fill('#email', TEST_USER.email)
    await page.fill('#password', TEST_USER.password)
    await page.click('button[type="submit"]')
    
    // Should show network error message
    await expect(page.locator('.text-red-700, [data-testid="error-message"]')).toContainText(/network|connection/i)
  })
  
  test('shows specific error for suspended accounts', async ({ page }) => {
    // This would require a test user with suspended status
    // Implementation depends on your test data setup
    await page.goto('/login')
    // ... fill form with suspended user credentials
    // ... expect specific suspended account message
  })
})