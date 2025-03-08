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
}

