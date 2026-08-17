import { test, expect } from '@playwright/test';

test('offline reload still shows the app shell', async ({ page, context }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Start exploring' }).click();
  await expect(page.getByRole('heading', { name: /FINDS/ })).toBeVisible();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { name: /FINDS/ })).toBeVisible();
});
