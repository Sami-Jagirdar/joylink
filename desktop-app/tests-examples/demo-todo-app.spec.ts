import { test, expect, _electron } from '@playwright/test';

let electronApp: Awaited<ReturnType<typeof _electron.launch>>;
let mainPage: Awaited<ReturnType<typeof electronApp.firstWindow>>; 

test.beforeEach(async () => {
  electronApp = await _electron.launch({
    args: ["."],
    env: {
      NODE_ENV: 'development',}
  });
  mainPage = await electronApp.firstWindow();
});

test.afterEach(async () => {
  await electronApp.close();
});

