import { test, expect } from '@playwright/test';

// 增加超时时间
test.setTimeout(60000);

test.describe('新标签页应用 - 基础功能', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
  });

  test('页面加载成功', async ({ page }) => {
    await expect(page).toHaveTitle('新标签页');
  });

  test('时钟显示正常', async ({ page }) => {
    const clock = page.locator('text=/\\d{1,2}:\\d{2}/');
    await expect(clock.first()).toBeVisible({ timeout: 10000 });
  });

  test('设置按钮可见', async ({ page }) => {
    const settingsButton = page.locator('button[aria-label="打开设置"]');
    await expect(settingsButton).toBeVisible({ timeout: 10000 });
  });
});

test.describe('搜索功能', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
  });

  test('搜索框可见', async ({ page }) => {
    const searchInput = page.locator('input[type="text"]').first();
    await expect(searchInput).toBeVisible({ timeout: 10000 });
  });

  test('搜索框可输入', async ({ page }) => {
    const searchInput = page.locator('input[type="text"]').first();
    await expect(searchInput).toBeVisible({ timeout: 10000 });
    await searchInput.fill('测试搜索');
    await expect(searchInput).toHaveValue('测试搜索');
  });

  test('清空搜索框', async ({ page }) => {
    const searchInput = page.locator('input[type="text"]').first();
    await expect(searchInput).toBeVisible({ timeout: 10000 });
    await searchInput.fill('测试内容');
    await searchInput.clear();
    await expect(searchInput).toHaveValue('');
  });

  test('键盘快捷键 Ctrl+K 聚焦搜索框', async ({ page }) => {
    const searchInput = page.locator('input[type="text"]').first();
    await expect(searchInput).toBeVisible({ timeout: 10000 });
    await page.keyboard.press('Control+k');
    await expect(searchInput).toBeFocused({ timeout: 3000 });
  });
});

test.describe('设置面板', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
  });

  test('点击设置按钮', async ({ page }) => {
    const settingsButton = page.locator('button[aria-label="打开设置"]');
    await expect(settingsButton).toBeVisible({ timeout: 10000 });
    
    // 点击设置按钮
    await settingsButton.click();
    
    // 等待一段时间让 Modal 动画完成
    await page.waitForTimeout(500);
    
    // 检查是否有 Modal 相关元素出现
    const modal = page.locator('.ant-modal, [role="dialog"]');
    await expect(modal.first()).toBeVisible({ timeout: 10000 });
  });
});

test.describe('右键菜单', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
  });

  test('右键显示上下文菜单', async ({ page }) => {
    // 等待页面加载
    await page.waitForTimeout(1000);
    
    await page.click('body', { button: 'right', position: { x: 300, y: 500 } });
    
    // 检查菜单项
    await expect(page.locator('text=添加标签')).toBeVisible({ timeout: 5000 });
  });
});

test.describe('响应式布局', () => {
  test('桌面视图布局正常', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    const searchInput = page.locator('input[type="text"]').first();
    await expect(searchInput).toBeVisible({ timeout: 10000 });
  });

  test('小屏幕视图', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    const searchInput = page.locator('input[type="text"]').first();
    await expect(searchInput).toBeVisible({ timeout: 10000 });
  });
});
