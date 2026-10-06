import { test, expect } from '@playwright/test';

test.describe('VIT GPA Calculator - Debug', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:54928');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
  });

  test('debug: check button state', async ({ page }) => {
    const btn = page.locator('#calculate-btn');
    
    console.log('Button visible:', await btn.isVisible());
    console.log('Button enabled:', await btn.isEnabled());
    console.log('Button count:', await btn.count());
    
    // Try different click methods
    await btn.click({ force: true });
    console.log('After force click');
    
    await page.waitForTimeout(500);
    console.log('GPA after force click:', await page.locator('#gpa-value').textContent());
    
    // Try mouse click
    await btn.hover();
    await page.mouse.click(100, 100); // Click at specific coordinates
    await page.waitForTimeout(500);
    console.log('GPA after mouse click:', await page.locator('#gpa-value').textContent());
  });
});
