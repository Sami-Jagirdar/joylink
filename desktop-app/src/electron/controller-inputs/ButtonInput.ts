import { KeyboardTarget, MouseClickTarget } from "../../types.js";
import { ControllerInput } from "./ControllerInput.js";
import {keyboard, mouse} from "@nut-tree-fork/nut-js";
keyboard.config.autoDelayMs = 0;
mouse.config.autoDelayMs = 0;

// FR14- Process.User.Actions.Buttons
export class ButtonInput extends ControllerInput {
    constructor(id: string, mappingTarget: KeyboardTarget | MouseClickTarget) {
        super(id, mappingTarget)
    }

    async handleInput(pressed: boolean): Promise<void> {
        if (this.mappingTarget.type == "keyboard") {
            await this.handleKeyboardInput(pressed);
        } else if (this.mappingTarget.type == "mouseClick") {
            await this.handleMouseClickInput(pressed);
        }
    }

    private async handleKeyboardInput(pressed: boolean) {
        const {keybinding} = this.mappingTarget as KeyboardTarget;
        if (pressed) {
            console.log("pressing", keybinding)
            // For multiple keys, the below  works well for key bindings like Shift+a, 
            // but not for something like q + w
            await keyboard.pressKey(...keybinding)
        } else {
            console.log("releasing", keybinding)
            await keyboard.releaseKey(...keybinding)

        }
    }

    private async handleMouseClickInput(pressed: boolean) {
        const {mouseClick} = this.mappingTarget as MouseClickTarget;

        if (pressed) {
            await mouse.pressButton(mouseClick)
        } else {
            await mouse.releaseButton(mouseClick)
        }
    }
}