/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { contextBridge, ipcRenderer } from 'electron';
import { EventPayloadMapping, Mapping, Window } from '../types.js';

contextBridge.exposeInMainWorld("electron", {
    listenForControllerUrl: (callback: (data: string) => void) => {
        ipcRenderer.on('setControllerUrl', (event, data) => {
            callback(data);
        });
    },

    getControllerUrl: async () => {
        return await ipcInvoke('getControllerUrl');
    },

    sendManualDisconnect: (data: string) => {
        console.log("Manual disconnect requested for:", data);
        ipcRenderer.send('manually-disconnect', data);
    },

    listenForClientDeviceInformation: (callback: (data: string[]) => void) => {
        ipcRenderer.on('setClientDeviceInformation', (_event, data) => {
            callback(data);
        });
    },

    getControllerMappings: async () => {
        return await ipcInvoke('getControllerMappings');
    },

    setControllerMappings: (data: Mapping[]) => {
        ipcRenderer.send('set-controller-mappings', data);
    },

    getLayouts: async () => {
        return await ipcInvoke('getLayouts');
    },

    getCurrentLayout: async () => {
        return await ipcInvoke('getCurrentLayout');
    },

    setLayout: (data: string) => {
        ipcRenderer.send('set-layout', data);
    },

    getMotionEnabled: async () => {
        return await ipcInvoke('getMotionEnabled');
    },

    setMotionEnabled: (data: boolean) => {
        ipcRenderer.send('setMotionEnabled', data);
    },

    getVoiceEnabled: async () => {
        return await ipcInvoke('getVoiceEnabled');
    },

    setVoiceEnabled: (data: boolean) => {
        ipcRenderer.send('setVoiceEnabled', data);
    },

} satisfies Window["electron"]);

// Wrapper for ipcRenderer.invoke to make it typesafe.
// Ideally, should have similar wrappers for other ipcRenderer methods
function ipcInvoke<Key extends keyof EventPayloadMapping>(
    key: Key
): Promise<EventPayloadMapping[Key]> {
    return ipcRenderer.invoke(key)
}
