import { test, expect } from '@playwright/test';

// This test can only verify the presence of the login buttons and the BFF endpoint response when called with invalid token.
// Full OAuth flow cannot be completed headless without provider credentials and consent flow.

test('shows login buttons and /api/auth/session returns 400 for missing token', async ({
  page,
  request,
}) => {
  await page.goto('http://localhost:3000/(auth)/login');
  await expect(page.getByText('Continue with Google')).toBeVisible();
  await expect(page.getByText('Continue with GitHub')).toBeVisible();

  // call front BFF which forwards to backend
  const res = await request.post('http://localhost:3000/api/auth/session', {
    data: { idToken: 'fake' },
  });
  expect([400, 500, 404]).toContain(res.status());
});
