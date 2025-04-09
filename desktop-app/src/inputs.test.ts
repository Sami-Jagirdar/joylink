import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getPreloadPath, getUIPath, getAssetPath, getControllerPath, getCertPath, getLayoutPath } from './electron/pathResolver';
import { app } from 'electron';
import path from 'path';
import { isDev } from './electron/util';
import { defineConfig } from 'vitest/config';
import { keyboard, mouse, Point } from "@nut-tree-fork/nut-js";
import { AnalogInput } from "./electron/controller-inputs/AnaogInput.ts";
import { ButtonInput } from "./electron/controller-inputs/ButtonInput";
import { MotionInput } from "./electron/controller-inputs/MotionControllerInput";
import { VoiceCommandInput } from "./electron/controller-inputs/VoiceCommandInput";
import { KeyboardTarget, MouseClickTarget } from "./types";
import { ControllerLayout } from "./electron/controllers/ControllerLayout";
import { ControllerInput } from "./electron/controller-inputs/ControllerInput";

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
    };

    const mockAnalogKeyboardTarget: AnalogKeyboardTarget = {
        type: "analogKeyboard",
        positiveX: ["d"],
        positiveY: ["w"],
        negativeX: ["a"],
        negativeY: ["s"],
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

    it("should apply deadzone correctly", async () => {
        const analogInput = new AnalogInput("test-id", mockMouseMotionTarget);
        await analogInput.setScreenDimensions();

        const position: Coordinates = { x: 0.1, y: 0.1 }; // Within deadzone
        await analogInput.handleInput(position);

        expect(mouse.setPosition).not.toHaveBeenCalled();
    });
});

describe("ButtonInput", () => {
    const keyboardTarget: KeyboardTarget = {
        type: "keyboard",
        keybinding: ["Shift", "A"],
    };

    const mouseClickTarget: MouseClickTarget = {
        type: "mouseClick",
        mouseClick: "left",
    };

    it("should handle keyboard input when pressed", async () => {
        const buttonInput = new ButtonInput("test-id", keyboardTarget);
        await buttonInput.handleInput(true);

        expect(keyboard.pressKey).toHaveBeenCalledWith("Shift", "A");
        expect(keyboard.releaseKey).not.toHaveBeenCalled();
    });

    it("should handle mouse click input when pressed", async () => {
        const buttonInput = new ButtonInput("test-id", mouseClickTarget);
        await buttonInput.handleInput(true);

        expect(mouse.pressButton).toHaveBeenCalledWith("left");
        expect(mouse.releaseButton).not.toHaveBeenCalled();
    });
});

describe("MotionInput", () => {
    const mockMouseTarget: MouseMotionTarget = { type: "mouseMotion" };
    const mockKeyboardTarget: AnalogKeyboardTarget = {
        type: "analogKeyboard",
        positiveX: ["d"],
        positiveY: ["w"],
        negativeX: ["a"],
        negativeY: ["s"],
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

        expect(keyboard.pressKey).toHaveBeenCalledWith("s");
        expect(keyboard.releaseKey).toHaveBeenCalledWith("w");
    });

    it("should clip values within range", () => {
        const motionInput = new MotionInput("test-id", mockMouseTarget);
        const result = (motionInput as any).clipInRange(15, 0, 10);
        expect(result).toBe(10);
    });
});

describe("VoiceCommandInput", () => {
    describe("handleInput", () => {
        it("should handle keyboard input correctly", async () => {
            const keybinding = ["KeyA"];
            const mappingTarget: KeyboardTarget = { type: "keyboard", keybinding };
            const voiceCommandInput = new VoiceCommandInput("test-id", mappingTarget);

            await voiceCommandInput.handleInput();

            expect(keyboard.pressKey).toHaveBeenCalledWith(...keybinding);
            expect(keyboard.releaseKey).toHaveBeenCalledWith(...keybinding);
        });

        it("should handle mouse click input correctly", async () => {
            const mouseClick = "left";
            const mappingTarget: MouseClickTarget = { type: "mouseClick", mouseClick };
            const voiceCommandInput = new VoiceCommandInput("test-id", mappingTarget);

            await voiceCommandInput.handleInput();

            expect(mouse.pressButton).toHaveBeenCalledWith(mouseClick);
            expect(mouse.releaseButton).toHaveBeenCalledWith(mouseClick);
        });

        it("should throw an error for invalid mapping target type", async () => {
            const invalidMappingTarget = { type: "invalid" } as any;
            const voiceCommandInput = new VoiceCommandInput("test-id", invalidMappingTarget);

            await expect(voiceCommandInput.handleInput()).rejects.toThrowError(
                "Invalid mapping target type."
            );
        });
    });

    describe("handleKeyboardInput", () => {
        it("should press and release the correct keys", async () => {
            const keybinding = ["KeyB"];
            const mappingTarget: KeyboardTarget = { type: "keyboard", keybinding };
            const voiceCommandInput = new VoiceCommandInput("test-id", mappingTarget);

            await (voiceCommandInput as any).handleKeyboardInput();

            expect(keyboard.pressKey).toHaveBeenCalledWith(...keybinding);
            expect(keyboard.releaseKey).toHaveBeenCalledWith(...keybinding);
        });
    });

    describe("handleMouseInput", () => {
        it("should press and release the correct mouse button", async () => {
            const mouseClick = "right";
            const mappingTarget: MouseClickTarget = { type: "mouseClick", mouseClick };
            const voiceCommandInput = new VoiceCommandInput("test-id", mappingTarget);

            await (voiceCommandInput as any).handleMouseInput();

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