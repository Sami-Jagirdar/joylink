import { app, BrowserWindow } from 'electron';
import path from 'path';
import { isDev } from './util.js';
import { getPreloadPath } from './pathResolver.js';
import { serveControllerApp } from './server.js';
import { ControllerLayout } from './controllers/ControllerLayout.js';
import { KeyboardTarget, Mapping, MouseClickTarget } from '../../types.js';
import {Key} from '@nut-tree-fork/nut-js'
import { ButtonInput } from './controller-inputs/ButtonInput.js';
import { ipcMain } from 'electron';

const mappings: Mapping[] = [
    {
        id: 'a',
        source: 'button',
        target: {type: 'keyboard', keybinding: [Key.Num4]}
    },
    {
        id: 'b',
        source: 'button',
        target: {type: 'keyboard', keybinding: [Key.Num5]}
    }, 
    {
        id: 'x',
        source: 'button',
        target: {type: 'keyboard', keybinding: [Key.Num8]}
    },
    {
        id: 'y',
        source: 'button',
        target: {type: 'keyboard', keybinding: [Key.Num9]}
    },
    {
        id: 'up',
        source: 'button',
        target: {type: 'keyboard', keybinding: [Key.W]}
    },
    {
        id: 'down',
        source: 'button',
        target: {type: 'keyboard', keybinding: [Key.S]}
    },
    {
        id: 'left',
        source: 'button',
        target: {type: 'keyboard', keybinding: [Key.A]}
    },
    {
        id: 'right',
        source: 'button',
        target: {type: 'keyboard', keybinding: [Key.D]}
    }
]

const maxConnections = 1;
const connectedClients: string[] = [];

const initializeController = (controller: ControllerLayout) => {
    for (const mapping of mappings) {
        // console.log(mapping);
        if (mapping.source === 'button') {
            if (mapping.target.type === 'keyboard') {
                const buttonInput = new ButtonInput(mapping.id, mapping.target as KeyboardTarget);
                controller.addInput(buttonInput);
            } else if (mapping.target.type === 'mouseClick') {
                const buttonInput = new ButtonInput(mapping.id, mapping.target as MouseClickTarget);
                controller.addInput(buttonInput);
            }
        }
    }
}

app.on("ready", async () => {
    const mainWindow = new BrowserWindow({
        webPreferences: {
            preload: getPreloadPath(),
        }
    });
    if (isDev()) {
        const port = process.env.LOCAL_PORT;
        if (port) {
            mainWindow.loadURL(`http://localhost:${port}`)
        } else {
            mainWindow.loadURL('http://localhost:7777')
        }
    } else {
        mainWindow.loadFile(path.join(app.getAppPath(), "/dist-react/index.html"))
    }
    const serverUrl = await serveControllerApp();
    const [server, url] = serverUrl
    const controllerLayout = new ControllerLayout("LayoutA");

    mainWindow.webContents.on('did-finish-load', () => {
        if (mainWindow) {
            mainWindow.webContents.send('setControllerUrl', url);
        }
    });

    //TODO This block has no purpose yet, it is just to log live data from the controller
    if (server) {
        server.on('connection', async (socket) => {
            // Check if maximum connections reached
            if (connectedClients.length >= maxConnections) {
                console.log('Maximum connections reached, rejecting new connection.');
                socket.emit('max-connections-reached');
                socket.disconnect(true);
                return;
            }

            console.log('A client connected');

            // Request client to send device info
            socket.emit('request-device-info');
            
            let clientDeviceName: string | null = null;
            socket.on('device-info', async (data: { deviceName: string }) => {
                console.log("Device Type: ", data.deviceName);
                clientDeviceName = data.deviceName;
                connectedClients.push(data.deviceName);

                const mainWindow = BrowserWindow.getAllWindows()[0]; // Get the main window
                if (mainWindow) {
                    mainWindow.webContents.send('setClientDeviceInformation', connectedClients);
                }
            });

            initializeController(controllerLayout)

            socket.on('joystick-move', (data) => {
                console.log('Joystick moved:', data);
            });

            socket.on('button', async (data: {button: string, pressed: boolean}) =>{
                // console.log(controllerLayout.inputs.get('x'));
                console.log(data.pressed);
                // console.log(controllerLayout.inputs.get(data.buttonId)?.getMappingTarget())
                await controllerLayout.inputs.get(data.button)?.handleInput(data.pressed)
            })

            ipcMain.on('manually-disconnect', (_event, data) => {
                console.log(`Manually disconnecting: ${data}`);
        
                // Find and remove the client from connectedClients list
                const index = connectedClients.indexOf(data);
                if (index !== -1) {
                    connectedClients.splice(index, 1);
                }
        
                // Send updated list to UI
                const mainWindow = BrowserWindow.getAllWindows()[0];
                if (mainWindow) {
                    mainWindow.webContents.send('setClientDeviceInformation', connectedClients);
                }
        
                // Disconnect the socket
                if (clientDeviceName === data) {
                    console.log(`Disconnecting socket for: ${data}`);
                    socket.emit('manually-disconnect');
                    socket.disconnect(true);
                }
            });

            socket.on('disconnect', () => {
                console.log('A client disconnected');
                // Optional: remove client from the connectedClients list on disconnect
                if (clientDeviceName) {
                    const index = connectedClients.indexOf(clientDeviceName);
                    if (index !== -1) {
                        connectedClients.splice(index, 1);
                    }
                }

                const mainWindow = BrowserWindow.getAllWindows()[0];
                if (mainWindow) {
                    mainWindow.webContents.send('setClientDeviceInformation', connectedClients);
                }
            });
        });

        server.on('connect_error', (error) => {
            console.log(error)
        });

        // Handle the 'error' event from the spawn itself (e.g., if 'node' or the script isn't found)
        server.once('error', (error) => {
            console.error(`Failed to start server process: ${error.message}`);
        });

        // Handle when the server process exits
        server.once('exit', (code, signal) => {
            if (code !== 0) {
                console.log(`Server process exited with code ${code}`);
            } else {
                console.log('Server process exited successfully');
            }

            //e.g. SIGKILL or SIGTERM
            if (signal) {
                console.log(`Server process was terminated by signal: ${signal}`);
            }
        });
        server.on('close', (code) => {
            console.log(`Server process exited with code ${code}`);
        });
    }
})
