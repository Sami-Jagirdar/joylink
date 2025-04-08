import express from 'express';
import https from 'https';
import fs from 'fs';
import { Server } from 'socket.io';
import { findPrivateIp } from './util.js';
import { AddressInfo } from 'net';
import { getControllerPath, getCertPath } from './pathResolver.js';

//Serve the controller app and return the server object (useful for recieving data)
//and the url the app is hosted on
export async function serveControllerApp(): Promise<[Server, string]> {
    console.log(getCertPath() + "/server.key")
    const privateKey = fs.readFileSync(getCertPath() + "/key.pem")
    const certificate = fs.readFileSync(getCertPath() + "/cert.pem")
    const credentials = { key: privateKey, cert: certificate };

    // FR1 Host.Controller.Interface
    // FR3 - Establish.Real.Time.Communication - Server side socket communication
    return new Promise((resolve, reject) => {
        // Prepare the controller app to serve via http
        const app = express();
        const server = https.createServer(credentials, app);
        app.use(express.static(getControllerPath()));

        // Set up live communications via sockets
        const io = new Server(server);

        // Get the local IP address for LAN access
        const ip = findPrivateIp();

        // Start listening for connection requests
        if (ip) {
            server.listen(0, ip, () => { //0 implies dynamic port assignment
                if (server) {
                    const port = (server.address() as AddressInfo).port;
                    const url = `https://${ip}:${port}`
                    console.log(`Server running at ${url}`);
                    resolve( [io, url] )
                }
            });
        } else {
            console.log("No Network Connection")
            reject()
        }
    })

}
