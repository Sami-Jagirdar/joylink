import { KeyboardTarget, MouseClickTarget } from "../../../types";
import { ControllerInput } from "./ControllerInput";
import {keyboard, mouse} from "@nut-tree-fork/nut-js";

export class ButtonInput extends ControllerInput {
    constructor(id: string, mappingTarget: KeyboardTarget | MouseClickTarget) {
        super(id, mappingTarget)
    }

    async handleInput(data: {pressed: boolean}): Promise<void> {
        if (this.mappingTarget.type == "keyboard") {
            await this.handleKeyboardInput(data.pressed);
        } else if (this.mappingTarget.type == "mouseClick") {
            await this.handleMouseClickInput(data.pressed);
        }
    }

    private async handleKeyboardInput(pressed: boolean) {
        const {keybinding} = this.mappingTarget as KeyboardTarget;

        if (pressed) {
            await keyboard.pressKey(...keybinding)
        } else {
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