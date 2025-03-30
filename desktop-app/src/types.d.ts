import {Key, Button} from "@nut-tree-fork/nut-js";

type InputType = 'button' | 'analog' | 'motion' | 'voice'

type OutputTarget = KeyboardTarget | MouseClickTarget | MouseMotionTarget | AnalogKeyboardTarget

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

interface AnalogKeyboardTarget {
    type: 'analogKeyboard';
    positiveX: Key[];
    positiveY: Key[];
    negativeX: Key[];
    negativeY: Key[];
}

interface Mapping {
    id: string; // eg: button-A
    source: InputType;
    target: OutputTarget;
    iconPath?: string;
}

type Coordinates = {
    x: number;
    y: number;
}


// To make IPC typesafe
type EventPayloadMapping = {
    getControllerMappings: Mapping[];
    getControllerUrl: string;
}

interface Window {
    electron: {
        getControllerMappings: () => Promise<Mapping[]>;
        listenForClientDeviceInformation: (callback: (data: string[]) => void) => void;
        sendManualDisconnect: (data: string) => void;
        listenForControllerUrl: (callback: (data: string) => void) => void;
        getControllerUrl: () => Promise<string>;
        setControllerMappings: (mappings: Mapping[]) => void;
    };
}