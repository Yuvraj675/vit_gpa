import { test, expect } from '@playwright/test';

test.describe('VIT GPA Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:54928');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
  });

  test('should have correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/VIT CGPA Calculator/);
  });

  test('should have dark mode by default', async ({ page }) => {
    await expect(page.locator('html')).toHaveAttribute('class', 'dark');
  });

  test('should show 12 subjects from test data', async ({ page }) => {
    const subjects = page.locator('.subject-row');
    await expect(subjects).toHaveCount(12);
  });

  test('should display test data values', async ({ page }) => {
    const firstRow = page.locator('.subject-row').first();
    await expect(firstRow.locator('.subject-name')).toHaveValue('DB');
    await expect(firstRow.locator('.credits')).toHaveValue('3');
    await expect(firstRow.locator('.grades')).toHaveValue('9');
  });

  test('should have previous results inputs visible', async ({ page }) => {
    const cgpaInput = page.locator('#prev');
    const creditsInput = page.locator('#prev_creds');
    
    await expect(cgpaInput).toBeVisible();
    await expect(cgpaInput).toHaveValue('9.59');
    await expect(creditsInput).toHaveValue('85');
  });

  test('should have calculate button', async ({ page }) => {
    const calculateBtn = page.locator('.calculate-btn-large');
    await expect(calculateBtn).toBeVisible();
    await expect(calculateBtn).toHaveText('Calculate GPA');
  });

  test('should calculate GPA when button clicked', async ({ page }) => {
    // Use evaluate to trigger the click directly
    await page.evaluate(() => {
      const btn = document.getElementById('calculate-btn');
      if (btn) btn.click();
    });
    
    const gpaValue = page.locator('#gpa-value');
    await expect(gpaValue).toBeVisible();
    await expect(gpaValue).toHaveText('9.00');
  });

  test('should color grade >= 9 as green', async ({ page }) => {
    await page.evaluate(() => {
      const btn = document.getElementById('calculate-btn');
      if (btn) btn.click();
    });
    
    const gpaValue = page.locator('#gpa-value');
    const color = await gpaValue.evaluate(el => window.getComputedStyle(el).color);
    expect(color).toBe('rgb(22, 163, 74)');
  });

  test('theme toggle should work', async ({ page }) => {
    const toggleBtn = page.locator('#theme-toggle');
    
    await page.evaluate(() => {
      const btn = document.getElementById('theme-toggle');
      if (btn) btn.click();
    });
    
    await expect(page.locator('html')).not.toHaveAttribute('class', 'dark');
    
    await page.evaluate(() => {
      const btn = document.getElementById('theme-toggle');
      if (btn) btn.click();
    });
    
    await expect(page.locator('html')).toHaveAttribute('class', 'dark');
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    
    const resultsPanel = page.locator('.results-panel');
    await expect(resultsPanel).not.toHaveCSS('position', 'sticky');
  });

  test('should add new subject row', async ({ page }) => {
    const addButton = page.locator('#add-subject-btn');
    const initialCount = await page.locator('.subject-row').count();
    
    await page.evaluate(() => {
      const btn = document.getElementById('add-subject-btn');
      if (btn) btn.click();
    });
    
    await expect(page.locator('.subject-row')).toHaveCount(initialCount + 1);
  });

  test('should clear all subjects', async ({ page }) => {
    page.on('dialog', dialog => dialog.accept());
    
    await page.evaluate(() => {
      const btn = document.getElementById('clear-btn');
      if (btn) btn.click();
    });
    
    await expect(page.locator('.subject-row')).toHaveCount(4);
  });
});
