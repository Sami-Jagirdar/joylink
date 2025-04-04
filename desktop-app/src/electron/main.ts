import { app, BrowserWindow } from 'electron';
import path from 'path';
// import { isDev } from './util.js';
import { getPreloadPath } from './pathResolver.js';
import { serveControllerApp } from './server.js';
import { ControllerLayout } from './controllers/ControllerLayout.js';
import { KeyboardTarget, Mapping, MouseClickTarget, MouseMotionTarget, Coordinates, AnalogKeyboardTarget, Accelerometer } from '../types.js';
import {Button, Key} from '@nut-tree-fork/nut-js'
import { ButtonInput } from './controller-inputs/ButtonInput.js';
import { ipcMain } from 'electron';
import { ipcHandle, isDev } from './util.js';
import { AnalogInput } from './controller-inputs/AnaogInput.js';
import { MotionInput } from './controller-inputs/MotionControllerInput.js';

// This should ideally be a constant and we should wrap it in a class or object and mutate it via those objects for data integrity
let mappingsLayoutA: Mapping[] = [
    {
        id: 'a',
        source: 'button',
        target: {type: 'keyboard', keybinding: [Key.Num4]},
    },
    {
        id: 'b',
        source: 'button',
        target: {type: 'keyboard', keybinding: [Key.Num5]},
    },
    {
        id: 'x',
        source: 'button',
        target: {type: 'keyboard', keybinding: [Key.Num8]},
    },
    {
        id: 'y',
        source: 'button',
        target: {type: 'keyboard', keybinding: [Key.Num9]},
    },
    {
        id: 'up',
        source: 'button',
        target: {type: 'keyboard', keybinding: [Key.W]},
    },
    {
        id: 'down',
        source: 'button',
        target: {type: 'keyboard', keybinding: [Key.S]},
    },
    {
        id: 'left',
        source: 'button',
        target: {type: 'keyboard', keybinding: [Key.A]},
    },
    {
        id: 'right',
        source: 'button',
        target: {type: 'keyboard', keybinding: [Key.D]},
    },
    {
        id: 'start',
        source: 'button',
        target: {type: 'keyboard', keybinding: [Key.Home]},
    },
    {
        id: 'select',
        source: 'button',
        target: {type: 'mouseClick', mouseClick: Button.LEFT},
    },
    {
        id: 'right-analog',
        source: 'analog',
        target: {type: 'mouseMotion', sensitivity: 15}
    },
    {
        id: 'left-analog',
        source: 'analog',
        target: {type: 'analogKeyboard',
            positiveX: [Key.D], positiveY: [Key.W],
            negativeX: [Key.A], negativeY: [Key.S]
        }
    },
    {
        id: 'accelerometer',
        source: 'motion',
        target: {type: 'mouseMotion', sensitivity: 25}
    },
]

const maxConnections = 1;
const connectedClients: string[] = [];

const initializeControllerA = async (controller: ControllerLayout, mappings: Mapping[]) => {
    controller.clearInputs();
    for (const mapping of mappings) {
        if (mapping.source === 'button') {
            if (mapping.target.type === 'keyboard') {
                const buttonInput = new ButtonInput(mapping.id, mapping.target as KeyboardTarget);
                controller.addInput(buttonInput);
            } else if (mapping.target.type === 'mouseClick') {
                const buttonInput = new ButtonInput(mapping.id, mapping.target as MouseClickTarget);
                controller.addInput(buttonInput);
            }
        }
        else if (mapping.source === "analog") {
            if (mapping.target.type === 'mouseMotion') {
                const analogInput = new AnalogInput(mapping.id, mapping.target as MouseMotionTarget);
                analogInput.setSensitivity(mapping.target.sensitivity);
                await analogInput.setScreenDimensions();
                controller.addInput(analogInput);
            } else if (mapping.target.type === 'analogKeyboard') {
                const analogInput = new AnalogInput(mapping.id, mapping.target as AnalogKeyboardTarget);
                controller.addInput(analogInput);
            }
        }
        else if (mapping.source === "motion") {
            if (mapping.target.type === 'mouseMotion') {
                const motionInput = new MotionInput(mapping.id, mapping.target as MouseMotionTarget);
                motionInput.setSensitivity(mapping.target.sensitivity);
                await motionInput.setScreenDimensions();
                controller.addInput(motionInput);
            } else if (mapping.target.type === 'analogKeyboard') {
                const motionInput = new MotionInput(mapping.id, mapping.target as AnalogKeyboardTarget)
                controller.addInput(motionInput)
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

    if (mainWindow) {
        mainWindow.webContents.send('setControllerUrl', url);
    }

    ipcHandle('getControllerUrl', () => {
        return url;
    });

    ipcHandle('getControllerMappings', () => {
        return mappingsLayoutA;
    });

    ipcMain.on('set-controller-mappings',  async (_event, data) => {
        mappingsLayoutA = data;
        await initializeControllerA(controllerLayout, data);
    })

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

            // send layout to client
            socket.emit('layout', 'layout-two');

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

            await initializeControllerA(controllerLayout, mappingsLayoutA)

            socket.on('joystick-move', async (data) => {
                console.log('Joystick moved:', data);
                const joystickCoordinates: Coordinates = {x: data.x, y:data.y};
                await controllerLayout.inputs.get(data.joystickId)?.handleInput(joystickCoordinates)
            });

            socket.on('joystick-stop', async (data) => {
                console.log('Joystick stopped:', data);
                await controllerLayout.inputs.get(data.joystickId)?.handleInput({x:0, y:0});
            });

            socket.on('button', async (data: {button: string, pressed: boolean}) =>{
                console.log(data.pressed);
                await controllerLayout.inputs.get(data.button)?.handleInput(data.pressed)
            })

            socket.on('device-motion', async (data: Accelerometer) => {
                //console.log(data);
                await controllerLayout.inputs.get('accelerometer')?.handleInput(data);

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
