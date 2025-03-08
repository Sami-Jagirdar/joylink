/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { contextBridge, ipcRenderer } from 'electron';

// contextBridge code is incomplete right now. Will be developed according to our apps needs
contextBridge.exposeInMainWorld("electron", {
    // subscribeStatistics is just an example function (you can make your own name)
    // it determines what data is sent from the backend when this function is called
    // In this case I'm simply sending an empty object
    subscribeStatistics: (callback: (statistics: any) => void) => callback({}),

    // getStaticData is similarly an example function
    // This is used on the frontend to get the data sent by the backend
    // In this case, I'm just logging a hardoded string
    getStaticData: () => console.log('static'),

    // Use this as a template to create more APIs to send data from UI to Electron
    sendData: (data: any) => ipcRenderer.send('set-data', data),

    // Use this as a template to create more APIs to send data from Electron to UI
    listenForControllerUrl: (callback: (data: any) => void) => {
        ipcRenderer.on('setControllerUrl', (event, data) => {
            callback(data);
        });
    },
})
