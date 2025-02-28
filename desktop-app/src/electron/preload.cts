/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */
const electron = require('electron');

// contextBridge code is incomplete right now. Will be developed according to our apps needs
electron.contextBridge.exposeMainWorld("electron", {
    // subscribeStatistics is just an example function (you can make your own name)
    // it determines what data is sent from the backend when this function is called
    // In this case I'm simply sending an empty object
    subscribeStatistics: (callback: (statistics: any) => void) => callback({}),

    // getStaticData is similarly an example function
    // This is used on the frontend to get the data sent by the backend
    // In this case, I'm just logging a hardoded string
    getStaticData: () => console.log('static'),
})