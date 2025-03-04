import os from 'os';

export function isDev(): boolean {
    return process.env.NODE_ENV === "development";
}

// Get private IPv4 address for LAN accessibility
export function findPrivateIp(): string | null {
    const interfaces = os.networkInterfaces();
    for (let devName in interfaces) {
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
};

