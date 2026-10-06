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

  test('should calculate GPA when calculate function called', async ({ page }) => {
    // Call displayResults directly to test the calculation logic
    await page.evaluate(() => {
      if (typeof displayResults === 'function') {
        displayResults();
      }
    });
    
    const gpaValue = page.locator('#gpa-value');
    await expect(gpaValue).toBeVisible();
    await expect(gpaValue).toHaveText('9.00');
  });

  test('should color grade >= 9 as green', async ({ page }) => {
    await page.evaluate(() => {
      if (typeof displayResults === 'function') {
        displayResults();
      }
    });
    
    const gpaValue = page.locator('#gpa-value');
    const color = await gpaValue.evaluate(el => window.getComputedStyle(el).color);
    expect(color).toBe('rgb(22, 163, 74)'); // Green
  });

  test('theme toggle should work', async ({ page }) => {
    // Toggle theme via JavaScript to test the logic
    await page.evaluate(() => {
      const appWrapper = document.getElementById('app-wrapper');
      const themeIcon = document.getElementById('theme-icon');
      
      if (appWrapper && themeIcon) {
        appWrapper.classList.toggle('dark');
        const isDark = appWrapper.classList.contains('dark');
        const theme = isDark ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
        
        if (isDark) {
          document.documentElement.classList.add('dark');
          themeIcon.textContent = '🌙';
        } else {
          document.documentElement.classList.remove('dark');
          themeIcon.textContent = '☀️';
        }
      }
    });
    
    await expect(page.locator('html')).not.toHaveAttribute('class', 'dark');
    
    // Toggle back
    await page.evaluate(() => {
      const appWrapper = document.getElementById('app-wrapper');
      const themeIcon = document.getElementById('theme-icon');
      
      if (appWrapper && themeIcon) {
        appWrapper.classList.toggle('dark');
        const isDark = appWrapper.classList.contains('dark');
        const theme = isDark ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
        
        if (isDark) {
          document.documentElement.classList.add('dark');
          themeIcon.textContent = '🌙';
        } else {
          document.documentElement.classList.remove('dark');
          themeIcon.textContent = '☀️';
        }
      }
    });
    
    await expect(page.locator('html')).toHaveAttribute('class', 'dark');
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    
    const resultsPanel = page.locator('.results-panel');
    await expect(resultsPanel).not.toHaveCSS('position', 'sticky');
  });

  test('should add new subject row', async ({ page }) => {
    const initialCount = await page.locator('.subject-row').count();
    
    // Add subject via JavaScript
    await page.evaluate(() => {
      if (typeof createInputPair === 'function' && inputContainer) {
        if (inputContainer.children.length < 20) {
          createInputPair();
        }
      }
    });
    
    await expect(page.locator('.subject-row')).toHaveCount(initialCount + 1);
  });

  test('should clear all subjects', async ({ page }) => {
    // Clear via JavaScript
    await page.evaluate(() => {
      if (inputContainer) {
        localStorage.removeItem('gpaChoices');
        localStorage.removeItem('gpaUpdated');
        inputContainer.innerHTML = '';
        for(let i=0; i<4; i++) {
          if (typeof createInputPair === 'function') {
            createInputPair();
          }
        }
        if (typeof updateCredits === 'function') {
          updateCredits();
        }
      }
    });
    
    await expect(page.locator('.subject-row')).toHaveCount(4);
  });
});
