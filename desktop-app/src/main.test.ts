import { test, expect, vi } from 'vitest';
import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { initializeController } from './electron/main.ts';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        include: ['src/main.ts', 'src/util.ts'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html'],
      },
    },
});

vi.mock('electron', () => ({
    ipcMain: {
        handle: vi.fn((channel, listener) => {
            if (channel === 'getControllerMappings') {
                // Simulate the handler being called
                listener();
            }
        }),
        on: vi.fn(),
    },
    app: {
        on: vi.fn(),
        getAppPath: vi.fn(() => '/mocked/path'),
    },
    BrowserWindow: vi.fn(() => ({
        loadURL: vi.fn(),
        loadFile: vi.fn(),
        webContents: {
            send: vi.fn(),
            on: vi.fn(),
        },
        setTitle: vi.fn(),
        setIcon: vi.fn(),
    })),
}));

vi.mock('fs', () => ({
    readFileSync: vi.fn(),
}));

vi.mock('./electron/server.js', () => ({
    serveControllerApp: vi.fn(),
}));

vi.mock('./electron/controllers/ControllerLayout.js', () => ({
    ControllerLayout: vi.fn(),
}));

vi.mock('./electron/server.js', () => ({
  serveControllerApp: vi.fn(() => Promise.resolve([{ on: vi.fn() }, 'http://mock-url'])),
}));

// Pass 
test('should initialize the app and load the correct URL in development mode', async () => {
    const mockedLoadURL = vi.fn();
    BrowserWindow.mockImplementation(() => ({
        loadURL: mockedLoadURL,
        webContents: { send: vi.fn(), on: vi.fn() },
        setTitle: vi.fn(),
        setIcon: vi.fn(),
    }));

    process.env.NODE_ENV = 'development';
    process.env.LOCAL_PORT = '3000';

    const main = await import('./electron/main.js');
    app.on.mock.calls[0][1]();

    expect(mockedLoadURL).toHaveBeenCalledWith('http://localhost:3000');
});

// Pass
test('should initialize the app and load the correct file in production mode', async () => {
    const mockedLoadFile = vi.fn();
    BrowserWindow.mockImplementation(() => ({
        loadFile: mockedLoadFile,
        webContents: { send: vi.fn(), on: vi.fn() },
        setTitle: vi.fn(),
        setIcon: vi.fn(),
    }));

    process.env.NODE_ENV = 'production';

    const main = await import('./electron/main.js');
    app.on.mock.calls[0][1](); // Simulate app "ready" event

    expect(mockedLoadFile).toHaveBeenCalledWith(
        path.join('/mocked/path', '/dist-react/index.html')
    );
});

test('should handle getControllerMappings IPC call', async () => {
    const mockMappings = [
        { id: 'a', source: 'button', target: { type: 'keyboard', keybinding: [32] } },
        { id: 'b', source: 'button', target: { type: 'keyboard', keybinding: [33] } },
        { id: 'x', source: 'button', target: { type: 'keyboard', keybinding: [36] } },
        { id: 'y', source: 'button', target: { type: 'keyboard', keybinding: [37] } },
        { id: 'up', source: 'button', target: { type: 'keyboard', keybinding: [52] } },
        { id: 'down', source: 'button', target: { type: 'keyboard', keybinding: [73] } },
        { id: 'left', source: 'button', target: { type: 'keyboard', keybinding: [72] } },
        { id: 'right', source: 'button', target: { type: 'keyboard', keybinding: [74] } },
        { id: 'start', source: 'button', target: { type: 'keyboard', keybinding: [43] } },
        { id: 'select', source: 'button', target: { type: 'mouseClick', mouseClick: 0 } },
        { id: 'accelerometer', source: 'motion', target: { type: 'mouseMotion', sensitivity: 25 } },
        { id: 'punch', source: 'voice', target: { type: 'keyboard', keybinding: [36] } },
        { id: 'shoot', source: 'voice', target: { type: 'mouseClick', mouseClick: 0 } },
        { id: 'stop', source: 'voice', target: { type: 'keyboard', keybinding: [29] } },
        { id: 'move', source: 'voice', target: { type: 'keyboard', keybinding: [30] } },
        { id: 'block', source: 'voice', target: { type: 'keyboard', keybinding: [31] } },
        { id: 'kick', source: 'voice', target: { type: 'keyboard', keybinding: [34] } },
        { id: 'jump', source: 'voice', target: { type: 'keyboard', keybinding: [35] } },
        { id: 'crouch', source: 'voice', target: { type: 'keyboard', keybinding: [38] } },
    ];
    const main = await import('./electron/main.js');
    main.currentLayout = mockMappings;

    const handler = ipcMain.handle.mock.calls.find(([channel]) => channel === 'getControllerMappings')?.[1];
    expect(handler).toBeInstanceOf(Function);

    const result = handler();
    expect(result).toEqual(mockMappings);
});

test('should handle set-layout IPC call and update current layout', async () => {
    const mockMappingsLayoutOne = [
      { id: 'a', source: 'button', target: { type: 'keyboard', keybinding: [32] } },
    ];
  
    const mockMappingsLayoutTwo = [
      { id: 'a', source: 'button', target: { type: 'keyboard', keybinding: [32] } },
      { id: 'b', source: 'button', target: { type: 'keyboard', keybinding: [33] } },
      // … other mappings … 
      { id: 'crouch', source: 'voice', target: { type: 'keyboard', keybinding: [38] } },
    ];
  
    const main = await import('./electron/main.js');
    main.setLayouts(mockMappingsLayoutOne, mockMappingsLayoutTwo);
    
    main.setCurrentLayout(mockMappingsLayoutOne);
  
    expect(main.getCurrentLayout()).not.toEqual(mockMappingsLayoutTwo);
  
    const handler = ipcMain.on.mock.calls.find(([channel]) => channel === 'set-layout')[1];
    handler(null, 'layout-two');
  
    expect(main.getCurrentLayout()).toEqual(mockMappingsLayoutTwo);
  });

// Pass
test('should initialize controller with correct mappings', async () => {
    const mockController = {
        clearInputs: vi.fn(),
        addInput: vi.fn(),
      };
      
    const mockMappings = [
        { id: 'a', source: 'button', target: { type: 'keyboard', keybinding: ['KeyA'] } },
        { id: 'b', source: 'button', target: { type: 'mouseClick', mouseClick: 'left' } },
    ];

    await initializeController(mockController, mockMappings);

    expect(mockController.clearInputs).toHaveBeenCalled();
});

// Pass
test('should initialize IPC handlers correctly', async () => {
    const main = await import('./electron/main.js');

    expect(ipcMain.handle).toHaveBeenCalledWith('getControllerMappings', expect.any(Function));
    expect(ipcMain.on).toHaveBeenCalledWith('set-layout', expect.any(Function));
});