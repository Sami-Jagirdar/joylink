/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */
const electron = require('electron');
electron.contextBridge.exposeMainWorld("electron", {
    // We can change the name of the function, using 'subscribeStatistics' for now because it was in the tutorial
    // Basically, subscribStatistics is like a function that is called from the electron backend to send data to the desktop ui frontend
    // but I named it subscribeStatistics here, it can be named anything, similar for getStaticData
    subscribeStatistics: (callback: (statistics: any) => void) => callback({}),
    getStaticData: () => console.log('static'),
})