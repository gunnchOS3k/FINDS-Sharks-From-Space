import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('loads, generates, and exposes provenance', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /FINDS — Sharks From Space/i })).toBeVisible();
  await page.getByRole('button', { name: 'Start exploring' }).click();
  await expect(page.getByText(/exploratory research/i)).toBeVisible();
  await page.getByRole('button', { name: /Generate hotspots/i }).click();
  await expect(page.getByText(/Obs\.|demo|offline|live|cache/i).first()).toBeVisible({ timeout: 30_000 });
  await page.getByText('Data provenance').click();
  await expect(page.getByText('Agency: NASA')).toBeVisible();
  await page.getByRole('button', { name: /Select .+ cell/ }).first().click();
  await expect(page.getByRole('heading', { name: 'Selected cell' })).toBeVisible();
  await page.getByRole('button', { name: 'Shark gallery' }).click();
  await expect(page.getByRole('heading', { name: 'Shark species cards' })).toBeVisible();
  await page.getByRole('button', { name: 'Close gallery' }).click();
  await page.getByRole('button', { name: 'Help' }).click();
  await expect(page.getByRole('heading', { name: 'About FINDS' })).toBeVisible();
});

test('primary screens have no serious axe violations', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Start exploring' }).click();
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag22aa']).analyze();
  const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
  expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
});
