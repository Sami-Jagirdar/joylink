/// <reference types="vite/client" />

declare global {
    interface Window {
        electron: {
            listenForControllerUrl: (callback: (url: string) => void) => void;
            // Define other methods you expose via contextBridge here
        };
    }
}

// This line is necessary to make the file a module (it will prevent global conflicts)
export {};
