import { test, expect } from '@playwright/test';

test.describe('VIT GPA Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
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
    // Check first subject is DB with 3 credits and A grade
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
    await page.locator('.calculate-btn-large').click();
    
    // GPA should be 9.00 (all A grades with 3,1,3,1,3,3,1,3,1,3,1.5,3 credits)
    const gpaValue = page.locator('#gpa-value');
    await expect(gpaValue).toBeVisible();
    await expect(gpaValue).toHaveText('9.00');
  });

  test('should color grade >= 9 as green', async ({ page }) => {
    await page.locator('.calculate-btn-large').click();
    
    const gpaValue = page.locator('#gpa-value');
    const color = await gpaValue.evaluate(el => window.getComputedStyle(el).color);
    expect(color).toBe('rgb(22, 163, 74)'); // Green
  });

  test('theme toggle should work', async ({ page }) => {
    const toggleBtn = page.locator('#theme-toggle');
    
    // Click to switch to light mode
    await toggleBtn.click();
    await expect(page.locator('html')).not.toHaveAttribute('class', 'dark');
    
    // Click again to switch back to dark mode
    await toggleBtn.click();
    await expect(page.locator('html')).toHaveAttribute('class', 'dark');
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    
    // Results panel should not be sticky on mobile
    const resultsPanel = page.locator('.results-panel');
    await expect(resultsPanel).not.toHaveCSS('position', 'sticky');
  });

  test('should add new subject row', async ({ page }) => {
    const addButton = page.locator('#add-subject-btn');
    const initialCount = page.locator('.subject-row').count();
    
    await addButton.click();
    
    await expect(page.locator('.subject-row')).toHaveCount(initialCount + 1);
  });

  test('should clear all subjects', async ({ page }) => {
    // Mock confirm dialog
    page.on('dialog', dialog => dialog.accept());
    
    const clearBtn = page.locator('#clear-btn');
    await clearBtn.click();
    
    // Should reset to 4 empty subject rows
    await expect(page.locator('.subject-row')).toHaveCount(4);
  });
});
