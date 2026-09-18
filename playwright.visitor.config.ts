import { defineConfig } from '@playwright/test'
export default defineConfig({
    testDir: './e2e-visitor',
    workers: 1,
    timeout: 120000,
    expect: { timeout: 15000 },
    use: {
        baseURL: process.env.VISITOR_URL || 'http://127.0.0.1:5218',
        channel: process.env.CI ? undefined : 'chrome',
        actionTimeout: 15000,
        screenshot: 'only-on-failure',
    },
})
