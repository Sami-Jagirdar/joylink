import { describe, it, expect, vi } from 'vitest';
import { isDev, findPrivateIp, ipcHandle, convertMapping, revertMapping, convertButtonString, convertKeyString, getKeyString, getButtonString } from './electron/util';
import { ipcMain } from 'electron';
import { Key, Button } from '@nut-tree-fork/nut-js';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        include: ['src/**/*.{js,ts,jsx,tsx}'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html'],
      },
    },
});

vi.mock('electron', () => {
    return {
      ipcMain: {
        handle: vi.fn(),
      },
    };
  });

describe('isDev', () => {
    it('should return true if NODE_ENV is "development"', () => {
        process.env.NODE_ENV = 'development';
        expect(isDev()).toBe(true);
    });

    it('should return false if NODE_ENV is not "development"', () => {
        process.env.NODE_ENV = 'production';
        expect(isDev()).toBe(false);
    });
});

describe('findPrivateIp', () => {
    it('should return a private IPv4 address if available', () => {
        const mockInterfaces = {
            eth0: [{ family: 'IPv4', internal: false, address: '192.168.1.1' }],
        };
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        vi.spyOn(require('os'), 'networkInterfaces').mockReturnValue(mockInterfaces);
        expect(findPrivateIp()).toBe('192.168.1.1');
    });

    it('should return null if no private IPv4 address is found', () => {
        const mockInterfaces = {
            eth0: [{ family: 'IPv6', internal: false, address: '::1' }],
        };
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        vi.spyOn(require('os'), 'networkInterfaces').mockReturnValue(mockInterfaces);
        expect(findPrivateIp()).toBeNull();
    });
});

describe('ipcHandle', () => {
    it('should register an ipcMain handler with the correct key and handler', () => {
        const mockHandler = vi.fn();
        const mockIpcMainHandle = vi.spyOn(ipcMain, 'handle');
        ipcHandle('getControllerMappings', mockHandler);
        expect(mockIpcMainHandle).toHaveBeenCalledWith('getControllerMappings', expect.any(Function));
    });
});

describe('convertMapping', () => {
    it('should convert keybinding for "keyboard" type', () => {
        const mapping = {
            target: { type: 'keyboard', keybinding: ['Key.A', 'Key.B'] },
        };
        convertMapping(mapping);
        expect(mapping.target.keybinding).toEqual([Key.A, Key.B]);
    });

    it('should convert directional keys for "analogKeyboard" type', () => {
        const mapping = {
            target: {
                type: 'analogKeyboard',
                positiveX: ['Key.A'],
                positiveY: ['Key.B'],
            },
        };
        convertMapping(mapping);
        expect(mapping.target.positiveX).toEqual([Key.A]);
        expect(mapping.target.positiveY).toEqual([Key.B]);
    });

    it('should convert mouseClick for "mouseClick" type', () => {
        const mapping = {
            target: { type: 'mouseClick', mouseClick: 'Button.LEFT' },
        };
        convertMapping(mapping);
        expect(mapping.target.mouseClick).toEqual(Button.LEFT);
    });

    it('should not modify mapping if type is unknown', () => {
        const mapping = { target: { type: 'unknown' } };
        const originalMapping = JSON.stringify(mapping);
        convertMapping(mapping);
        expect(JSON.stringify(mapping)).toBe(originalMapping);
    });
});

describe('revertMapping', () => {
    it('should revert keybinding for "keyboard" type', () => {
        const mapping = {
            target: { type: 'keyboard', keybinding: [Key.A, Key.B] },
        };
        revertMapping(mapping);
        expect(mapping.target.keybinding).toEqual(['Key.A', 'Key.B']);
    });

    it('should revert directional keys for "analogKeyboard" type', () => {
        const mapping = {
            target: {
                type: 'analogKeyboard',
                positiveX: [Key.A],
                positiveY: [Key.B],
            },
        };
        revertMapping(mapping);
        expect(mapping.target.positiveX).toEqual(['Key.A']);
        expect(mapping.target.positiveY).toEqual(['Key.B']);
    });

    it('should revert mouseClick for "mouseClick" type', () => {
        const mapping = {
            target: { type: 'mouseClick', mouseClick: Button.LEFT },
        };
        revertMapping(mapping);
        expect(mapping.target.mouseClick).toEqual('Button.LEFT');
    });

    it('should not modify mapping if type is unknown', () => {
        const mapping = { target: { type: 'unknown' } };
        const originalMapping = JSON.stringify(mapping);
        revertMapping(mapping);
        expect(JSON.stringify(mapping)).toBe(originalMapping);
    });

    it ("should throw error if keyString length is not 2", () => {
        const keyString = "Key.A.B";
        expect(() => convertKeyString(keyString)).toThrowError();

    });

    it ("should throw error if keyString length is not 2", () => {
        const keyString = "Key.A.B";
        expect(() => convertButtonString(keyString)).toThrowError();

    });

    it ("should return invalid keystring correctly", () => {
        const keyCode = 9999;
        const keyString = getKeyString(keyCode);
        expect(keyString).toBe("9999");
    });

    it ("should return invalid buttonstring correctly", () => {
        const buttonCode = 9999;
        const buttonString = getButtonString(buttonCode);
        expect(buttonString).toBe("9999");
    });


});