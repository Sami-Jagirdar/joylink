/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld("electron", {

    // Use this as a template to create more APIs to send data from UI to Electron
    sendData: (data: any) => ipcRenderer.send('set-data', data),

    // Use this as a template to create more APIs to send data from Electron to UI
    listenForControllerUrl: (callback: (data: any) => void) => {
        ipcRenderer.on('setControllerUrl', (event, data) => {
            callback(data);
        });
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
})
