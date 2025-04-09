import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { serveControllerApp } from './electron/server';
import express from 'express';
import https from 'https';
import { Server } from 'socket.io';
import { AddressInfo } from 'net';
import * as util from "./electron/util.js";

const consoleSpy = vi.spyOn(console, 'log');
const findPrivateIpSpy = vi.spyOn(util, 'findPrivateIp');

// Mock dependencies
vi.mock('express', () => {
    const appMock = {
        use: vi.fn(),
    };

    // Create a mock function for express that returns the appMock.
    // Attach a 'static' function to it.
    const expressMock = vi.fn(() => appMock);
    expressMock.static = vi.fn(() => 'static-middleware');

    // Return the mock as the default export.
    return { default: expressMock };
});

vi.mock('https', () => ({
    default: {
        createServer: vi.fn(() => ({
            listen: vi.fn((port, host, callback) => {
                callback();
            }),
            address: vi.fn(() => ({ port: 8443 } as AddressInfo)),
        })),
    },
}));

vi.mock('fs', () => ({
    default: {
        readFileSync: vi.fn((path) => {
            if (path.includes('key.pem')) return 'mocked-private-key';
            if (path.includes('cert.pem')) return 'mocked-certificate';
            return '';
        }),
    },
}));

vi.mock('socket.io', () => ({
    Server: vi.fn(() => 'mocked-socket-io-server'),
}));

// Mock the util module with a proper mock function that can be modified later
vi.mock('./util', () => {
    return {
        findPrivateIp: vi.fn().mockReturnValue('192.168.1.100')
    };
});

// Mock electron before any imports that might use it
vi.mock('electron', () => ({
    app: {
        getAppPath: vi.fn(() => '/mocked/app/path'),
    },
}));

// Then mock pathResolver which might use electron
vi.mock('./pathResolver', () => ({
    getControllerPath: vi.fn(() => '/mocked/controller/path'),
    getCertPath: vi.fn(() => '/mocked/cert/path'),
}));

describe('server', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    describe('serveControllerApp', () => {
        it('should set up an HTTPS server with the correct certificates', async () => {
            await serveControllerApp();
            
           expect(https.createServer).toHaveBeenCalledWith(
                { 
                    key: 'mocked-private-key', 
                    cert: 'mocked-certificate' 
                },
                expect.anything()
            );
        });

        it('should serve static files from the controller path', async () => {
            const app = express();
            await serveControllerApp();
            
            expect(express.static).toHaveBeenCalled();
            expect(app.use).toHaveBeenCalled();
        });

        it('should create a socket.io server', async () => {
            await serveControllerApp();
            
            expect(Server).toHaveBeenCalled();
        });

        it('should reject when no network connection is available', async () => {
            findPrivateIpSpy.mockReturnValueOnce(null);
            
            // Test that the promise rejects
            await expect(serveControllerApp()).rejects.toBeUndefined();
            
            // Verify the correct log message
            expect(consoleSpy).toHaveBeenCalledWith('No Network Connection');});

    });
});