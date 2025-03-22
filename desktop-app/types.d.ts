import {Key, Button} from "@nut-tree-fork/nut-js";

type InputType = 'button' | 'analog' | 'motion' | 'voice'

type OutputTarget = KeyboardTarget | MouseClickTarget | MouseMotionTarget

interface KeyboardTarget {
    type: 'keyboard';
    keybinding: Key[];
}

interface MouseClickTarget {
    type: 'mouseClick';
    mouseClick: Button
}

interface MouseMotionTarget {
    type: 'mouseMotion';
    sensitivity: number;
}

interface Mapping {
    id: string; // eg: button-A
    source: InputType;
    target: OutputTarget;
    iconPath?: string;
}

// To make IPC typesafe
type EventPayloadMapping = {
    getControllerMappings: Mapping[];
    getControllerUrl: string;
}

interface Window {
    electron: {
        getControllerMappings: () => Promise<Mapping[]>;
        setControllerMappings: (data: Mapping[]) => void;
        listenForClientDeviceInformation: (callback: (data: string[]) => void) => void;
        sendManualDisconnect: (data: string) => void;
        listenForControllerUrl: (callback: (data: string) => void) => void;
        getControllerUrl: () => Promise<string>;
    };
}
