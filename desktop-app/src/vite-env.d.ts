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
            getMotionEnabled: () => Promise<boolean>;
            setMotionEnabled: (enabled: boolean) => void;
            getVoiceEnabled: () => Promise<boolean>;
            setVoiceEnabled: (enabled: boolean) => void;
            saveControllerMappings: (mappings: Mapping[]) => void;
            // Define other methods you expose via contextBridge here
        };
    }
}

// This line is necessary to make the file a module (it will prevent global conflicts)
export {};
