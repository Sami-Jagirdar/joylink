import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getPreloadPath, getUIPath, getAssetPath, getControllerPath, getCertPath, getLayoutPath } from './electron/pathResolver';
import path from 'path';
import { isDev } from './electron/util';
import { defineConfig } from 'vitest/config';
import { keyboard, mouse, Point } from "@nut-tree-fork/nut-js";
import { AnalogInput } from "./electron/controller-inputs/AnaogInput.ts";
import { ButtonInput } from "./electron/controller-inputs/ButtonInput";
import { MotionInput } from "./electron/controller-inputs/MotionControllerInput";
import { VoiceCommandInput } from "./electron/controller-inputs/VoiceCommandInput";
import { Accelerometer, AnalogKeyboardTarget, Coordinates, KeyboardTarget, MouseClickTarget, MouseMotionTarget } from "./types";
import { ControllerLayout } from "./electron/controllers/ControllerLayout";
import { ControllerInput } from "./electron/controller-inputs/ControllerInput";
import {Button, Key} from "@nut-tree-fork/nut-js";

export default defineConfig({
    test: {
        include: ['src/**/*.{js,ts,jsx,tsx}'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html'],
      },
    },
});

vi.mock('electron', () => ({
    app: {
        getAppPath: vi.fn(() => '/mocked/app/path'),
    },
}));

vi.mock('./electron/util', () => ({
    isDev: vi.fn(),
}));

vi.mock('clearInterval', () => ({
    clearInterval: vi.fn(),
}));

vi.mock("@nut-tree-fork/nut-js", () => ({
    keyboard: {
        pressKey: vi.fn(),
        releaseKey: vi.fn(),
        config: { autoDelayMs: 0 },
    },
    mouse: {
        setPosition: vi.fn(),
        getPosition: vi.fn(() => Promise.resolve(new Point(0, 0))),
        pressButton: vi.fn(),
        releaseButton: vi.fn(),
        config: { autoDelayMs: 0 },
    },
    Key: {
        Escape: 0,
        F1: 1,
        F2: 2,
        F3: 3,
        F4: 4,
        F5: 5,
        F6: 6,
        F7: 7,
        F8: 8,
        F9: 9,
        F10: 10,
        F11: 11,
        F12: 12,
        F13: 13,
        F14: 14,
        F15: 15,
        F16: 16,
        F17: 17,
        F18: 18,
        F19: 19,
        F20: 20,
        F21: 21,
        F22: 22,
        F23: 23,
        F24: 24,
        Print: 25,
        ScrollLock: 26,
        Pause: 27,
        Grave: 28,
        Num1: 29,
        Num2: 30,
        Num3: 31,
        Num4: 32,
        Num5: 33,
        Num6: 34,
        Num7: 35,
        Num8: 36,
        Num9: 37,
        Num0: 38,
        Minus: 39,
        Equal: 40,
        Backspace: 41,
        Insert: 42,
        Home: 43,
        PageUp: 44,
        NumLock: 45,
        NumPadEqual: 46,
        Divide: 47,
        Multiply: 48,
        Subtract: 49,
        Tab: 50,
        Q: 51,
        W: 52,
        E: 53,
        R: 54,
        T: 55,
        Y: 56,
        U: 57,
        I: 58,
        O: 59,
        P: 60,
        LeftBracket: 61,
        RightBracket: 62,
        Backslash: 63,
        Delete: 64,
        End: 65,
        PageDown: 66,
        NumPad7: 67,
        NumPad8: 68,
        NumPad9: 69,
        Add: 70,
        CapsLock: 71,
        A: 72,
        S: 73,
        D: 74,
        F: 75,
        G: 76,
        H: 77,
        J: 78,
        K: 79,
        L: 80,
        Semicolon: 81,
        Quote: 82,
        Return: 83,
        NumPad4: 84,
        NumPad5: 85,
        NumPad6: 86,
        LeftShift: 87,
        Z: 88,
        X: 89,
        C: 90,
        V: 91,
        B: 92,
        N: 93,
        M: 94,
        Comma: 95,
        Period: 96,
        Slash: 97,
        RightShift: 98,
        Up: 99,
        NumPad1: 100,
        NumPad2: 101,
        NumPad3: 102,
        Enter: 103,
        LeftControl: 104,
        LeftSuper: 105,
        LeftWin: 106,
        LeftCmd: 107,
        LeftAlt: 108,
        Space: 116,
        RightAlt: 110,
        RightSuper: 111,
        RightWin: 112,
        RightCmd: 113,
        Menu: 114,
        RightControl: 115,
        Fn: 109,
        Left: 117,
        Down: 118,
        Right: 119,
        NumPad0: 120,
        Decimal: 121,
        Clear: 122,
        AudioMute: 123,
        AudioVolDown: 124,
        AudioVolUp: 125,
        AudioPlay: 126,
        AudioStop: 127,
        AudioPause: 128,
        AudioPrev: 129,
        AudioNext: 130,
        AudioRewind: 131,
        AudioForward: 132,
        AudioRepeat: 133,
        AudioRandom: 134
    },
    Button: {
        LEFT: "left",
        MIDDLE: "middle",
        RIGHT: "right"
    },
    Point: class {
        constructor(public x: number, public y: number) {}
    },
    screen: {
        width: vi.fn(() => Promise.resolve(1920)),
        height: vi.fn(() => Promise.resolve(1080)),
    },
}));

describe('pathResolver', () => {
    describe('getPreloadPath', () => {
        it('should return the correct preload path in development mode', () => {
            vi.mocked(isDev).mockReturnValue(true);
            const result = getPreloadPath();
            expect(result).toBe(path.join('/mocked/app/path', '.', '/dist-electron/preload.cjs'));
        });

        it('should return the correct preload path in production mode', () => {
            vi.mocked(isDev).mockReturnValue(false);
            const result = getPreloadPath();
            expect(result).toBe(path.join('/mocked/app/path', '..', '/dist-electron/preload.cjs'));
        });
    });

    describe('getUIPath', () => {
        it('should return the correct UI path', () => {
            const result = getUIPath();
            expect(result).toBe(path.join('/mocked/app/path', '/dist-react/index.html'));
        });
    });

    describe('getAssetPath', () => {
        it('should return the correct asset path in development mode', () => {
            vi.mocked(isDev).mockReturnValue(true);
            const result = getAssetPath();
            expect(result).toBe(path.join('/mocked/app/path', '.', '/src/assets'));
        });

        it('should return the correct asset path in production mode', () => {
            vi.mocked(isDev).mockReturnValue(false);
            const result = getAssetPath();
            expect(result).toBe(path.join('/mocked/app/path', '..', '/src/assets'));
        });
    });

    describe('getControllerPath', () => {
        it('should return the correct controller path', () => {
            const result = getControllerPath();
            expect(result).toBe(path.join('/mocked/app/path', '../controller-app/dist-controller'));
        });
    });

    describe('getCertPath', () => {
        it('should return the correct certificate path', () => {
            const result = getCertPath();
            expect(result).toBe(path.join('/mocked/app/path', '/certs'));
        });
    });

    describe('getLayoutPath', () => {
        it('should return the correct layout path in development mode', () => {
            vi.mocked(isDev).mockReturnValue(true);
            const result = getLayoutPath();
            expect(result).toBe(path.join('/mocked/app/path', '.', '/src/electron/layouts'));
        });

        it('should return the correct layout path in production mode', () => {
            vi.mocked(isDev).mockReturnValue(false);
            const result = getLayoutPath();
            expect(result).toBe(path.join('/mocked/app/path', '..', '/src/electron/layouts'));
        });
    });
});


describe("AnalogInput", () => {
    const mockMouseMotionTarget: MouseMotionTarget = {
        type: "mouseMotion",
        sensitivity: 1.0,
    };

    const mockKeyboardTarget: AnalogKeyboardTarget = {
        type: "analogKeyboard",
        positiveX: [Key.D],
        positiveY: [Key.W],
        negativeX: [Key.A],
        negativeY: [Key.S],
    };


    it("should initialize with correct properties", () => {
        const analogInput = new AnalogInput("test-id", mockMouseMotionTarget);
        expect(analogInput.getId()).toBe("test-id");
        expect(analogInput.getMappingTarget()).toBe(mockMouseMotionTarget);
    });

    it("should stop motion when input is zero", async () => {
        const analogInput = new AnalogInput("test-id", mockMouseMotionTarget);
        await analogInput.setScreenDimensions();

        const position: Coordinates = { x: 0, y: 0 };
        await analogInput.handleInput(position);

        expect(mouse.setPosition).not.toHaveBeenCalled();
    });

    

    it("should handle analog keyboard input correctly", async () => {
        const analogInput = new AnalogInput("testi1d", mockKeyboardTarget);
        await analogInput.setScreenDimensions();

        const position: Coordinates = { x: 1, y: 0.5 };
        await analogInput.handleInput(position);
        expect(analogInput.getIsMoving()).toBe(false);

        expect(keyboard.releaseKey).toHaveBeenCalledWith(...mockKeyboardTarget.positiveX);
        expect(keyboard.pressKey).toHaveBeenCalledWith(...mockKeyboardTarget.positiveX);

        const position2: Coordinates = { x: 0, y: 0 };
        await analogInput.handleInput(position2);
        expect(keyboard.releaseKey).toHaveBeenCalledWith(...mockKeyboardTarget.positiveX);


        const position3: Coordinates = { x: -0.5, y: 1 };
        await analogInput.handleInput(position3);
        expect(keyboard.releaseKey).toHaveBeenCalledWith(...mockKeyboardTarget.negativeX);

        const position4: Coordinates = { x: 1, y: 0 };
        await analogInput.handleInput(position4);
        expect(keyboard.releaseKey).toHaveBeenCalledWith(...mockKeyboardTarget.positiveY);

        const position5: Coordinates = { x: 0.5, y: -0.5 };
        await analogInput.handleInput(position5);
        expect(keyboard.releaseKey).toHaveBeenCalledWith(...mockKeyboardTarget.negativeY);


    });

    it("should handle 0 position correctly", async () => {
        const analogInput = new AnalogInput("test-id", mockKeyboardTarget);
        await analogInput.setScreenDimensions();
        const position: Coordinates = { x: 0, y: 0 };
        await analogInput.handleInput(position);
        expect(keyboard.releaseKey).toHaveBeenCalledWith(...mockKeyboardTarget.positiveX);
    });

    it ("should clear interval if already set", () => {
        const analogInput = new AnalogInput("test-id", mockMouseMotionTarget);
        analogInput.setAnalogInterval();
        const position: Coordinates = { x: 1, y: 0.5 };
        analogInput.handleInput(position);
    });

    it("should apply deadzone correctly", async () => {
        const analogInput = new AnalogInput("test-id", mockMouseMotionTarget);
        await analogInput.setScreenDimensions();

        const position: Coordinates = { x: 0.1, y: 0.1 }; // Within deadzone
        await analogInput.handleInput(position);

        expect(mouse.setPosition).not.toHaveBeenCalled();
    });

    it("should apply sensitivity correctly", async () => {
        const analogInput = new AnalogInput("test-id", mockMouseMotionTarget);
        await analogInput.setScreenDimensions();
        analogInput.setSensitivity(25);

        expect(analogInput.getSensitivity()).equals(25);
    });

    it("should call stop motion when input is zero", async () => {
        const analogInput = new AnalogInput("test-id", mockMouseMotionTarget);
        await analogInput.setScreenDimensions();

        // First make the mouse start moving
        const position1: Coordinates = { x: 1, y: 0 };
        await analogInput.handleInput(position1);

        // Make sure it stops moving
        const position: Coordinates = { x: 0, y: 0 };
        await analogInput.handleInput(position);
        expect(analogInput.getIsMoving()).toBe(false);
    });

});

describe("ButtonInput", () => {
    const keyboardTarget: KeyboardTarget = {
        type: "keyboard",
        keybinding: [Key.LeftShift, Key.A],
    };

    const mouseClickTarget: MouseClickTarget = {
        type: "mouseClick",
        mouseClick: Button.LEFT,
    };

    it("should handle keyboard input when pressed", async () => {
        const buttonInput = new ButtonInput("test-id", keyboardTarget);
        await buttonInput.handleInput(true);

        expect(keyboard.pressKey).toHaveBeenCalledWith(...keyboardTarget.keybinding);
    });

    it("should handle keyboard input when released", async () => {
        const buttonInput = new ButtonInput("test-id", keyboardTarget);
        await buttonInput.handleInput(false);

        expect(keyboard.releaseKey).toHaveBeenCalledWith(...keyboardTarget.keybinding);
    });

    it("should handle mouse click input when pressed", async () => {
        const buttonInput = new ButtonInput("test-id", mouseClickTarget);
        await buttonInput.handleInput(true);

        expect(mouse.pressButton).toHaveBeenCalledWith(mouseClickTarget.mouseClick);
        expect(mouse.releaseButton).not.toHaveBeenCalled();
    });

    it("should handle mouse click input when released", async () => {
        const buttonInput = new ButtonInput("test-id", mouseClickTarget);
        await buttonInput.handleInput(false);

        expect(mouse.releaseButton).toHaveBeenCalledWith(mouseClickTarget.mouseClick);
    });
});

describe("MotionInput", () => {
    const mockMouseTarget: MouseMotionTarget = { type: "mouseMotion", sensitivity: 1.0 };
    const mockKeyboardTarget: AnalogKeyboardTarget = {
        type: "analogKeyboard",
        positiveX: [Key.D],
        positiveY: [Key.W],
        negativeX: [Key.A],
        negativeY: [Key.S],
    };

    it("should initialize with correct properties", () => {
        const motionInput = new MotionInput("test-id", mockMouseTarget);
        expect(motionInput.getId()).toBe("test-id");
        expect(motionInput.getMappingTarget()).toBe(mockMouseTarget);
    });

    it("should handle analog keyboard input with negative Y direction", async () => {
        const motionInput = new MotionInput("test-id", mockKeyboardTarget);

        const accelerometer: Accelerometer = { x: 0, y: -9.81, z: 0 };
        await motionInput.handleInput(accelerometer);

        expect(keyboard.pressKey).toHaveBeenCalledWith(Key.S);

        const accelerometer2: Accelerometer = { x: 0, y: 0, z: 0 };
        await motionInput.handleInput(accelerometer2);

        expect(keyboard.pressKey).toHaveBeenCalledWith(Key.S);

    });

    it("should clip values within range", () => {
        const motionInput = new MotionInput("test-id", mockMouseTarget);
        const result = (motionInput).clipInRange(15, 0, 10);
        expect(result).toBe(10);
    });

    it("should set top of phone position correctly", () => {
        const motionInput = new MotionInput("test-id", mockMouseTarget);
        const accelerometer: Accelerometer = { x: -9.81, y: 0, z: 0 };
        motionInput.handleInput(accelerometer);

        expect(motionInput.topOfPhoneIsOnLeft).toBe(true);

        const accelerometer2: Accelerometer = { x: 9.81, y: 0, z: 0 };
        motionInput.handleInput(accelerometer2);
        expect(motionInput.topOfPhoneIsOnLeft).toBe(false);
    });

    it("should clip mouse position within screen bounds", () => {
        const motionInput = new MotionInput("test-id", mockMouseTarget);
        motionInput.setScreenDimensions();
        
        const accelerometer: Accelerometer = { x: 0, y: 0, z: 0 };
        motionInput.handleInput(accelerometer);        
    });

    it ("should consider tilt angle less than tiltFix - deadAngleTiltKeyboard", async () => {
        const motionInput = new MotionInput("test-id", mockKeyboardTarget);
        const accelerometer: Accelerometer = { x: 0, y: 0, z: -9.81 };
        motionInput.handleInput(accelerometer);
        expect(keyboard.releaseKey).toHaveBeenCalled();
    });

    it("Should consider tilt angle equal to tiltFix - deadAngleTiltKeyboard", async () => {
        const motionInput = new MotionInput("test-id", mockKeyboardTarget);
        const accelerometer: Accelerometer = { x: 0, y: 0, z: -9.81/Math.sqrt(2) };
        motionInput.handleInput(accelerometer);
        expect(keyboard.releaseKey).toHaveBeenCalled();
    });

    // it("Should consider tilt angle beyond tiltfix + deadAngleTiltMouse"), async () => {
    //     const motionInput = new MotionInput("test-id", mockKeyboardTarget);
    //     const accelerometer: Accelerometer = { x: 0, y: 0, z: -9.81/(3*9.81) };
    //     motionInput.handleInput(accelerometer);
    //     expect(keyboard.releaseKey).toHaveBeenCalled();
    // }
});

describe("VoiceCommandInput", () => {
    describe("handleInput", () => {
        it("should handle keyboard input correctly", async () => {
            const keybinding = [Key.A];
            const mappingTarget: KeyboardTarget = { type: "keyboard", keybinding };
            const voiceCommandInput = new VoiceCommandInput("test-id", mappingTarget);

            await voiceCommandInput.handleInput();

            expect(keyboard.pressKey).toHaveBeenCalledWith(...keybinding);
            expect(keyboard.releaseKey).toHaveBeenCalledWith(...keybinding);
        });

        it("should handle mouse click input correctly", async () => {
            const mouseClick = Button.LEFT;
            const mappingTarget: MouseClickTarget = { type: "mouseClick", mouseClick };
            const voiceCommandInput = new VoiceCommandInput("test-id", mappingTarget);

            await voiceCommandInput.handleInput();

            expect(mouse.pressButton).toHaveBeenCalledWith(mouseClick);
            expect(mouse.releaseButton).toHaveBeenCalledWith(mouseClick);
        });
    });

    describe("handleKeyboardInput", () => {
        it("should press and release the correct keys", async () => {
            const keybinding = [Key.B];
            const mappingTarget: KeyboardTarget = { type: "keyboard", keybinding };
            const voiceCommandInput = new VoiceCommandInput("punch", mappingTarget);

            await voiceCommandInput.handleInput();

            expect(keyboard.pressKey).toHaveBeenCalledWith(...keybinding);
            expect(keyboard.releaseKey).toHaveBeenCalledWith(...keybinding);
        });
    });

    describe("handleMouseInput", () => {
        it("should press and release the correct mouse button", async () => {
            const mouseClick = Button.RIGHT;
            const mappingTarget: MouseClickTarget = { type: "mouseClick", mouseClick };
            const voiceCommandInput = new VoiceCommandInput("punch", mappingTarget);

            await (voiceCommandInput).handleInput();

            expect(mouse.pressButton).toHaveBeenCalledWith(mouseClick);
            expect(mouse.releaseButton).toHaveBeenCalledWith(mouseClick);
        });
    });
});

describe("ControllerLayout", () => {
    let controllerLayout: ControllerLayout;
    let mockInput: ControllerInput;

    beforeEach(() => {
        controllerLayout = new ControllerLayout("test-layout");
        mockInput = {
            getId: vi.fn(() => "mock-input"),
        } as unknown as ControllerInput;
    });

    it("should initialize with an empty inputs map", () => {
        expect(controllerLayout.inputs.size).toBe(0);
    });

    it("should add an input to the inputs map", () => {
        controllerLayout.addInput(mockInput);
        expect(controllerLayout.inputs.size).toBe(1);
        expect(controllerLayout.inputs.get("mock-input")).toBe(mockInput);
    });

    it("should clear all inputs from the inputs map", () => {
        controllerLayout.addInput(mockInput);
        expect(controllerLayout.inputs.size).toBe(1);

        controllerLayout.clearInputs();
        expect(controllerLayout.inputs.size).toBe(0);
    });

    it("should not throw an error when clearing an already empty inputs map", () => {
        expect(() => controllerLayout.clearInputs()).not.toThrow();
    });

    it("should overwrite an existing input with the same ID", () => {
        const anotherMockInput = {
            getId: vi.fn(() => "mock-input"),
        } as unknown as ControllerInput;

        controllerLayout.addInput(mockInput);
        controllerLayout.addInput(anotherMockInput);

        expect(controllerLayout.inputs.size).toBe(1);
        expect(controllerLayout.inputs.get("mock-input")).toBe(anotherMockInput);
    });
});