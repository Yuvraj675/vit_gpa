import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test.describe('New Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:54928');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    // Clear localStorage for clean state
    await page.evaluate(() => {
      localStorage.clear();
    });
  });

  test('delete button should appear next to each subject row', async ({ page }) => {
    // Verify delete buttons exist (should be 12 based on test data)
    const deleteButtons = page.locator('.delete-btn');
    await expect(deleteButtons).toHaveCount(12);
  });

  test('delete button should remove subject row', async ({ page }) => {
    const initialCount = await page.locator('.subject-row').count();
    expect(initialCount).toBe(12);

    // Click the first delete button
    await page.locator('.delete-btn').first().click();

    await expect(page.locator('.subject-row')).toHaveCount(initialCount - 1);
  });

  test('delete button should not delete last subject', async ({ page }) => {
    // Start with a single subject
    await page.evaluate(() => {
      inputContainer.innerHTML = '';
      createInputPair();
      updateCredits();
    });

    await expect(page.locator('.subject-row')).toHaveCount(1);

    // Try to delete - should show alert and not remove
    await page.locator('.delete-btn').first().click();

    await expect(page.locator('.subject-row')).toHaveCount(1);
  });

  test('sign-out button should be hidden when not signed in', async ({ page }) => {
    // The sign-out button should have the 'hidden' class when not signed in
    const signOutBtn = page.locator('#sign-out-btn');
    await expect(signOutBtn).toHaveClass(/hidden/);
  });

  test('sign-out confirmation modal should appear', async ({ page }) => {
    // Simulate being signed in by manually triggering the modal
    await page.evaluate(() => {
      showSignOutModal();
    });

    // Verify modal is visible
    await expect(page.locator('.confirm-modal')).toBeVisible();
    await expect(page.locator('.confirm-modal-content h3')).toContainText('Sign Out');
  });

  test('cancel sign-out should keep user logged in', async ({ page }) => {
    await page.evaluate(() => {
      showSignOutModal();
    });

    // Click Cancel
    await page.locator('#confirm-cancel').click();

    // Modal should be gone
    await expect(page.locator('.confirm-modal')).not.toBeVisible();
  });

  test('calculate should persist results to localStorage', async ({ page }) => {
    // Calculate GPA
    await page.evaluate(() => {
      if (typeof displayResults === 'function') {
        displayResults();
      }
    });

    // Save results
    await page.evaluate(() => {
      if (typeof saveResults === 'function') {
        saveResults();
      }
    });

    // Verify localStorage has results
    const savedResults = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('gpaResults') || '{}');
    });

    expect(savedResults.gpa).toBeTruthy();
    expect(savedResults.cgpa).toBeTruthy();
    expect(savedResults.credits).toBeTruthy();
  });

  test('refreshing page should restore calculated results', async ({ page }) => {
    // First, calculate and save results
    await page.evaluate(() => {
      if (typeof displayResults === 'function') {
        displayResults();
      }
      if (typeof saveResults === 'function') {
        saveResults();
      }
    });

    // Refresh the page
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Verify results are restored
    const gpaValue = await page.locator('#gpa-value').textContent();
    const cgpaValue = await page.locator('#cgpa-value').textContent();
    const creditsValue = await page.locator('#stat-credits').textContent();

    expect(gpaValue).toBe('9.00');
    expect(cgpaValue).toBeTruthy();
    expect(creditsValue).toBeTruthy();
  });

  test('results should have correct colors after refresh', async ({ page }) => {
    // Calculate with GPA >= 9
    await page.evaluate(() => {
      if (typeof displayResults === 'function') {
        displayResults();
      }
      if (typeof saveResults === 'function') {
        saveResults();
      }
    });

    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    const gpaColor = await page.locator('#gpa-value').evaluate(el => 
      window.getComputedStyle(el).color
    );
    expect(gpaColor).toBe('rgb(22, 163, 74)'); // Green for >= 9
  });
});
