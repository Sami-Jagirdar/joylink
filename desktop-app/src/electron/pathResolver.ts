import path from 'path';
import { app } from 'electron';
import { isDev } from './util.js';

export function getPreloadPath() {
  return path.join(
    app.getAppPath(),
    isDev() ? '.' : '..',
    '/dist-electron/preload.cjs'
  );
}

export function getUIPath() {
  return path.join(app.getAppPath(), '/dist-react/index.html');
}

export function getAssetPath() {
  return path.join(app.getAppPath(), isDev() ? '.' : '..', '/src/assets');
}

export function getControllerPath() {
  return path.join(app.getAppPath(), '../controller-app/dist-controller');
}

export function getCertPath() {
  return path.join(app.getAppPath(), '/certs');
}

export function getLayoutPath() {
  return path.join(
    app.getAppPath(),
    isDev() ? '.' : '..',
    '/src/electron/layouts'
  );
}