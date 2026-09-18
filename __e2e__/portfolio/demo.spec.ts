import { test, expect } from '@playwright/test'

test('search, genre filters, empty results and watchlist toggles', async ({
    page,
}) => {
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    await page.goto('/')
    await expect(
        page.getByRole('heading', { name: 'Make tonight a movie night.' })
    ).toBeVisible()
    await page.getByRole('textbox', { name: 'Search films' }).fill('orbit')
    await expect(page.getByRole('article')).toHaveCount(1)
    await page.getByRole('button', { name: 'Comedy', exact: true }).click()
    await expect(
        page.getByRole('heading', { name: 'No films here yet.' })
    ).toBeVisible()
    await page.getByRole('button', { name: 'Show all films' }).click()
    await expect(page.getByRole('article')).toHaveCount(6)
    await page
        .getByRole('button', { name: 'Save A Quiet Orbit to watchlist' })
        .click()
    await page.getByRole('button', { name: /My watchlist/ }).click()
    await expect(page.getByRole('article')).toHaveCount(3)
    await page
        .getByRole('button', { name: 'Remove A Quiet Orbit from watchlist' })
        .click()
    await expect(page.getByRole('article')).toHaveCount(2)
    expect(errors).toEqual([])
})
test('review, watched state, reload and reset', async ({ page }) => {
    await page.goto('/')
    await page
        .getByRole('button', { name: 'View A Quiet Orbit', exact: true })
        .click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await dialog.getByRole('button', { name: 'Mark as watched' }).click()
    await dialog
        .getByRole('combobox', { name: 'Your rating' })
        .selectOption('9')
    await dialog
        .getByRole('textbox', { name: 'Your review' })
        .fill('A thoughtful little story.')
    await dialog.getByRole('button', { name: 'Save review' }).click()
    await expect(dialog).not.toBeVisible()
    await expect(page.getByText('Your rating: 9/10')).toBeVisible()
    await page.reload()
    await expect(page.getByText('Your rating: 9/10')).toBeVisible()
    await page
        .getByRole('button', { name: 'View A Quiet Orbit', exact: true })
        .click()
    await expect(
        dialog.getByRole('textbox', { name: 'Your review' })
    ).toHaveValue('A thoughtful little story.')
    await expect(
        dialog.getByRole('button', { name: '✓ Watched' })
    ).toHaveAttribute('aria-pressed', 'true')
    await page.keyboard.press('Escape')
    await expect(dialog).not.toBeVisible()
    await page.getByRole('button', { name: 'Reset demo' }).click()
    await expect(page.getByText('Your rating: 9/10')).toHaveCount(0)
    await expect(
        page.getByRole('button', { name: /My watchlist/ })
    ).toContainText('2')
})
test('separate visitor contexts do not share changes', async ({
    page,
    browser,
}) => {
    await page.goto('/')
    await page
        .getByRole('button', { name: 'Save A Quiet Orbit to watchlist' })
        .click()
    const context = await browser.newContext()
    try {
        const other = await context.newPage()
        await other.goto(page.url())
        await expect(
            other.getByRole('button', { name: /My watchlist/ })
        ).toContainText('2')
    } finally {
        await context.close()
    }
})
test('mobile layout and no backend or third-party requests', async ({
    page,
}) => {
    const unexpected: string[] = []
    page.on('request', request => {
        const url = new URL(request.url())
        if (
            url.pathname.startsWith('/api/') ||
            (url.protocol.startsWith('http') &&
                url.origin !==
                    new URL(
                        process.env.PORTFOLIO_URL || 'http://127.0.0.1:5200'
                    ).origin)
        )
            unexpected.push(url.pathname)
    })
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await expect(page.getByRole('article')).toHaveCount(6)
    expect(
        await page.evaluate(
            () => document.documentElement.scrollWidth <= window.innerWidth
        )
    ).toBe(true)
    await page.screenshot({
        path: 'test-results/movies-mobile.png',
        fullPage: true,
    })
    await page
        .getByRole('button', { name: 'View Paper Planes', exact: true })
        .click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.getByRole('button', { name: 'Close film details' }).click()
    await page.setViewportSize({ width: 1440, height: 1000 })
    await page.screenshot({
        path: 'test-results/movies-desktop.png',
        fullPage: true,
    })
    expect(unexpected).toEqual([])
})
test('credentials, source files and API routes are not deployed', async ({
    request,
}) => {
    for (const path of [
        '/.env',
        '/.env.local',
        '/.git/config',
        '/api/auth/session',
        '/api/movieLists',
        '/prisma/schema.prisma',
    ]) {
        const response = await request.get(path)
        expect(response.status(), path).toBe(404)
    }
})
