/// <reference types="vite/client" />

declare global {
    interface Window {
        electron: {
            listenForControllerUrl: (callback: (url: string) => void) => void;
            listenForClientDeviceInformation: (callback: (deviceInformation: string[]) => void) => void;
            getControllerUrl: () => Promise<string>;
            sendManualDisconnect: (deviceName: string) => void; 
            getControllerMappings: () => Promise<Mapping[]>;
            setControllerMappings: (mappings: Mapping[]) => void;
            getLayouts: () => Promise<string[]>;
            setLayout: (layout: string) => void;
            getCurrentLayout: () => Promise<string>;
            // Define other methods you expose via contextBridge here
        };
    }
}

// This line is necessary to make the file a module (it will prevent global conflicts)
export {};
