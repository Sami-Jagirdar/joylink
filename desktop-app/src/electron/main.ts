import { app, BrowserWindow } from 'electron';
import path from 'path';
import { isDev } from './util.js';
import { getPreloadPath } from './pathResolver.js';
import { serveControllerApp } from './server.js';

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

    mainWindow.webContents.on('did-finish-load', () => {
        if (mainWindow) {
            mainWindow.webContents.send('setControllerUrl', url);
        }
    });

    //TODO This block has no purpose yet, it is just to log live data from the controller
    if (server) {
        server.on('connection', (socket:any) => {
            console.log('A client connected');

            socket.on('joystick-move', (data:any) => {
                console.log('Joystick moved:', data);
            });

            socket.on('disconnect', () => {
                console.log('A client disconnected');
            });
        });

        server.on('connect_error', (any:any) => {
            console.log(any)
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
        server.on('close', (code: any) => {
            console.log(`Server process exited with code ${code}`);
        });
    }
})
