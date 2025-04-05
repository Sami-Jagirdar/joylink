import os from 'os';
import { EventPayloadMapping } from '../types.js';
import { ipcMain } from 'electron';
import { Button, Key } from '@nut-tree-fork/nut-js';

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

// Conversion functions for enum strings.
function convertKeyString(keyString: string): number {
    const parts = keyString.split('.');
    if (parts.length !== 2 || parts[0] !== 'Key') {
      throw new Error('Invalid key format: ' + keyString);
    }
    const keyName = parts[1];
    return Key[keyName as keyof typeof Key];
}
  
function convertButtonString(buttonString: string): number {
    const parts = buttonString.split('.');
    if (parts.length !== 2 || parts[0] !== 'Button') {
        throw new Error('Invalid button format: ' + buttonString);
    }
    const buttonName = parts[1];
    return Button[buttonName as keyof typeof Button];
}

// Function to process each mapping.
export function convertMapping(mapping: any): void {
    // For "keyboard" type, convert the keybinding array.
    if (mapping.target.type === "keyboard" && mapping.target.keybinding) {
        mapping.target.keybinding = mapping.target.keybinding.map(convertKeyString);
    }

    // For "analogKeyboard" type, convert each directional key array.
    if (mapping.target.type === "analogKeyboard") {
        ["positiveX", "positiveY", "negativeX", "negativeY"].forEach(prop => {
        if (mapping.target[prop]) {
            mapping.target[prop] = mapping.target[prop].map(convertKeyString);
        }
        });
    }

    // For "mouseClick" type, convert the mouseClick property if needed.
    if (mapping.target.type === "mouseClick" && mapping.target.mouseClick && mapping.target.mouseClick.startsWith("Button.")) {
        mapping.target.mouseClick = convertButtonString(mapping.target.mouseClick);
    }
}

// Helper function to convert a key code back into its enum string (e.g., 33 -> "Key.Num4")
function getKeyString(keyCode: number): string {
    // Cast the Key enum as a record to iterate its keys.
    const keyEnum = Key as unknown as Record<string, number>;
    const keyNames = Object.keys(keyEnum).filter((name: string) => typeof keyEnum[name] === 'number');
    for (const name of keyNames) {
        if (keyEnum[name] === keyCode) {
            return `Key.${name}`;
        }
    }
    return keyCode.toString();
}

// Helper function to convert a button code back into its enum string (e.g., 0 -> "Button.LEFT")
function getButtonString(buttonCode: number): string {
    const buttonEnum = Button as unknown as Record<string, number>;
    const buttonNames = Object.keys(buttonEnum).filter((name: string) => typeof buttonEnum[name] === 'number');
    for (const name of buttonNames) {
        if (buttonEnum[name] === buttonCode) {
            return `Button.${name}`;
        }
    }
    return buttonCode.toString();
}
  
  // Function that “reverts” the mapping conversion for each mapping object.
export function revertMapping(mapping: any) {
    // For "keyboard" type mappings, convert the keybinding array numbers to strings.
    if (mapping.target.type === "keyboard" && mapping.target.keybinding) {
      mapping.target.keybinding = mapping.target.keybinding.map(getKeyString);
    }
  
    // For "analogKeyboard" type, convert each directional key array.
    if (mapping.target.type === "analogKeyboard") {
      ["positiveX", "positiveY", "negativeX", "negativeY"].forEach(prop => {
        if (mapping.target[prop]) {
          mapping.target[prop] = mapping.target[prop].map(getKeyString);
        }
      });
    }
  
    // For "mouseClick" type, convert the mouseClick property if it's a number.
    if (mapping.target.type === "mouseClick" && typeof mapping.target.mouseClick === "number") {
      mapping.target.mouseClick = getButtonString(mapping.target.mouseClick);
    }
  }