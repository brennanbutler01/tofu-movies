import { test, expect } from '@playwright/test'
for (const mobile of [false, true])
    test(`persisted movie workflow ${mobile ? 'mobile' : 'desktop'}`, async ({
        page,
        context,
        baseURL,
    }) => {
        if (mobile) await page.setViewportSize({ width: 390, height: 844 })
        const errors: string[] = []
        page.on('pageerror', error => errors.push(error.message))
        try {
            await page.goto('/auth/signin')
            await page
                .getByRole('button', { name: 'Start demo', exact: true })
                .click()
            await expect(
                page.getByRole('button', { name: 'Reset demo', exact: true })
            ).toBeVisible()
            await page.goto('/movieLists')
            await page
                .getByRole('button', { name: /add new list/i })
                .first()
                .click()
            const dialog = page.getByRole('dialog')
            await dialog.getByLabel('List Title').fill('Weekend picks')
            await dialog
                .getByLabel('List Description')
                .fill('A fictional collection for a quiet weekend.')
            await page.route('**/api/movieLists', route =>
                route.request().method() === 'POST'
                    ? route.fulfill({
                          status: 503,
                          contentType: 'application/json',
                          body: '{"error":"Unavailable"}',
                      })
                    : route.continue()
            )
            await dialog
                .getByRole('button', { name: 'Create', exact: true })
                .click()
            await expect(dialog.getByRole('alert')).toContainText(
                'Could not save'
            )
            await expect(dialog.getByLabel('List Title')).toHaveValue(
                'Weekend picks'
            )
            await page.unroute('**/api/movieLists')
            await dialog
                .getByRole('button', { name: 'Create', exact: true })
                .click()
            await expect(dialog).toHaveCount(0)
            await page.reload()
            await expect(
                page
                    .getByRole('tabpanel', { name: 'Connected lists' })
                    .getByText('Weekend picks', { exact: true })
            ).toBeVisible()
            const listCard = page
                .getByRole('tabpanel', { name: 'Connected lists' })
                .locator('.mantine-Card-root')
                .filter({
                    has: page.getByText('Weekend picks', { exact: true }),
                })
            await listCard.getByRole('link', { name: /View/ }).click()
            await page
                .getByRole('button', { name: 'Edit list', exact: true })
                .click()
            await dialog
                .getByLabel('List Description')
                .fill('Updated weekend collection')
            await dialog
                .getByRole('button', { name: 'Save changes', exact: true })
                .click()
            await expect(dialog).toHaveCount(0)
            await page.reload()
            await expect(
                page.getByText('Updated weekend collection', { exact: true })
            ).toBeVisible()
            // An empty client cache must not trigger creation of a sample film.
            await page.route('**/api/movies', route =>
                route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: '[]',
                })
            )
            await page.goto('/movies/910001')
            await expect(
                page
                    .getByRole('heading', {
                        name: 'The Last Lighthouse',
                        exact: true,
                    })
                    .first()
            ).toBeVisible()
            await page
                .getByRole('button', { name: 'Watchlist?', exact: true })
                .click()
            await expect(
                page.getByRole('button', { name: 'Watchlisted', exact: true })
            ).toBeVisible()
            await page.unroute('**/api/movies')
            await page.reload()
            await page
                .getByRole('button', { name: 'Mark as watched', exact: true })
                .click()
            await expect(
                page.getByRole('button', {
                    name: 'Mark as watched',
                    exact: true,
                })
            ).toHaveAttribute('aria-pressed', 'true')
            await page
                .getByRole('button', { name: 'Write a review', exact: true })
                .click()
            await dialog
                .getByLabel('Review Title')
                .fill('A thoughtful coastal story')
            await dialog
                .getByLabel('Review text')
                .fill(
                    'This fictional film makes a useful sample for testing watchlists and longer reviews that should persist after a reload.'
                )
            await dialog
                .getByRole('button', { name: 'Write Review', exact: true })
                .click()
            await expect(dialog).toHaveCount(0)
            await page.reload()
            await expect(
                page.getByRole('button', { name: 'Watchlisted', exact: true })
            ).toBeVisible()
            await expect(
                page.getByRole('button', {
                    name: 'Mark as watched',
                    exact: true,
                })
            ).toHaveAttribute('aria-pressed', 'true')
            await page.goto('/reviews')
            await expect(
                page.getByText('A thoughtful coastal story', { exact: true })
            ).toBeVisible()
            await page
                .getByRole('button', { name: 'Like review', exact: true })
                .click()
            await expect(
                page.getByRole('button', { name: 'Like review', exact: true })
            ).toContainText('1')
            await page.reload()
            await expect(
                page.getByRole('button', { name: 'Like review', exact: true })
            ).toContainText('1')
            await page
                .getByRole('link', { name: 'View Review', exact: true })
                .first()
                .click()
            await page
                .getByRole('button', { name: 'Edit review', exact: true })
                .click()
            await dialog
                .getByLabel('Review Title')
                .fill('A revised coastal story')
            await dialog
                .getByRole('button', { name: 'Save changes', exact: true })
                .click()
            await expect(dialog).toHaveCount(0)
            await page.reload()
            await expect(
                page.getByRole('heading', {
                    name: 'A revised coastal story',
                    exact: true,
                })
            ).toBeVisible()
            expect(
                await page.evaluate(
                    () => document.documentElement.scrollWidth <= innerWidth
                )
            ).toBe(true)

            if (process.env.SCREENSHOT_DIR)
                await page.screenshot({
                    path:
                        process.env.SCREENSHOT_DIR +
                        `/tofu-movies-${mobile ? 'mobile' : 'desktop'}.png`,
                    fullPage: true,
                })
            await page
                .getByRole('button', { name: 'Reset demo', exact: true })
                .click()
            await expect(
                page.getByRole('button', { name: 'Start demo', exact: true })
            ).toBeVisible()
            await page
                .getByRole('button', { name: 'Start demo', exact: true })
                .click()
            await expect(
                page.getByRole('button', { name: 'Reset demo', exact: true })
            ).toBeVisible()
            await page.goto('/reviews')
            await expect(
                page.getByText('A revised coastal story', { exact: true })
            ).toHaveCount(0)
            await page.goto('/movieLists')
            await expect(
                page.getByText('Weekend picks', { exact: true })
            ).toHaveCount(0)
            expect(errors).toEqual([])
        } finally {
            await context.request.delete('/api/demo/session', {
                headers: { Origin: baseURL! },
            })
        }
    })
