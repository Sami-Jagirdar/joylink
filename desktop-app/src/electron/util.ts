import os from 'os';
import { EventPayloadMapping } from '../types.js';
import { ipcMain } from 'electron';

export function isDev(): boolean {
    return process.env.NODE_ENV === "development";
}

// Get private IPv4 address for LAN accessibility
export function findPrivateIp(): string | null {
    const interfaces = os.networkInterfaces();
    for (const devName in interfaces) {
        if (interfaces[devName]) {
            for (let i = 0; i < interfaces[devName].length; i++) {
                const iface = interfaces[devName][i];
                if (iface.family === 'IPv4' && !iface.internal) {
                    return iface.address;
                }
            }
        }
    }
    return null;
}

// Wrapper for ipcMain.Handle to make it typesafe.
// by ensuring the handler returns a type that matches one of the EventPayloadMapping keys
export function ipcHandle<Key extends keyof EventPayloadMapping & string>(
    key: Key,
    handler: () => EventPayloadMapping[Key]
) {
    ipcMain.handle(key, () => handler());
}

