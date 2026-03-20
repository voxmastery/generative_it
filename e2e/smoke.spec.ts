import { test, expect } from '@playwright/test';

test('Home: hero renders and CTAs route correctly', async ({ page }) => {
  await page.goto('/');

  const hero = page.locator('section.hero');
  await expect(hero).toBeVisible();

  await expect(page.getByText('Now Serving Clients in 12+ Countries')).toBeVisible();
  await expect(page.locator('h1.hero-title')).toBeVisible();

  const primary = page.locator('a.hero-btn-primary');
  if (await primary.count()) {
    // If premium hero CTAs exist, validate routing.
    await expect(primary).toHaveAttribute('href', /\/contacts$/);
  } else {
    const cta = page.getByRole('link', { name: /Start Your Project/i });
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute('href', /\/contacts$/);
  }

  await expect(page.locator('footer')).toBeVisible();
});

test('Navigation: all main routes load and key content exists', async ({ page }) => {
  await page.goto('/about');
  await expect(page.getByRole('heading', { name: 'About Us' })).toBeVisible();

  await page.goto('/services');
  await expect(page.getByRole('heading', { name: 'Services we offer' })).toBeVisible();

  await page.goto('/contacts');
  await expect(page.getByRole('heading', { name: 'Send Us a Message' })).toBeVisible();
});

test('Contacts: form fields are present and interactive', async ({ page }) => {
  await page.goto('/contacts');

  // Reactive form: use stable IDs and placeholders
  await expect(page.locator('input#name')).toBeVisible();
  await expect(page.locator('input#name')).toHaveAttribute('placeholder', 'John Doe');

  await expect(page.locator('input#email')).toBeVisible();
  await expect(page.locator('input#email')).toHaveAttribute('placeholder', 'john@example.com');

  await expect(page.locator('input#subject')).toBeVisible();
  await expect(page.locator('input#subject')).toHaveAttribute('placeholder', 'Project inquiry');

  await expect(page.locator('input#phone')).toBeVisible();
  await expect(page.locator('input#phone')).toHaveAttribute('placeholder', '+91 000-000-0000');

  await expect(page.locator('textarea#message')).toBeVisible();
  await expect(page.locator('textarea#message')).toHaveAttribute('placeholder', 'Tell us about your project...');

  const submit = page.getByRole('button', { name: 'Submit' });
  await expect(submit).toBeVisible();
});

test('Footer: branded copy appears', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Generative IT Solution')).toBeVisible();
});

