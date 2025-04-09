import { describe, it, expect, vi } from 'vitest';
import { isDev, findPrivateIp, ipcHandle, convertMapping, revertMapping } from './electron/util';
import { ipcMain } from 'electron';
import { Key, Button } from '@nut-tree-fork/nut-js';

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
        vi.spyOn(require('os'), 'networkInterfaces').mockReturnValue(mockInterfaces);
        expect(findPrivateIp()).toBe('192.168.1.1');
    });

    it('should return null if no private IPv4 address is found', () => {
        const mockInterfaces = {
            eth0: [{ family: 'IPv6', internal: false, address: '::1' }],
        };
        vi.spyOn(require('os'), 'networkInterfaces').mockReturnValue(mockInterfaces);
        expect(findPrivateIp()).toBeNull();
    });
});

describe('ipcHandle', () => {
    it('should register an ipcMain handler with the correct key and handler', () => {
        const mockHandler = vi.fn();
        const mockIpcMainHandle = vi.spyOn(ipcMain, 'handle');
        ipcHandle('testKey', mockHandler);
        expect(mockIpcMainHandle).toHaveBeenCalledWith('testKey', expect.any(Function));
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
});