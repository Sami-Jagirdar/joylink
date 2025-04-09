import { keyboard, mouse } from "@nut-tree-fork/nut-js";
import { KeyboardTarget, MouseClickTarget } from "../../types.js";
import { ControllerInput } from "./ControllerInput.js";

// FR16- Process.Voice.Commands
export class VoiceCommandInput extends ControllerInput {

    constructor(id: string, mappingTarget: KeyboardTarget | MouseClickTarget) {
        super(id, mappingTarget);
    }

    async handleInput(): Promise<void> {
        if (this.mappingTarget.type === "keyboard") {
            await this.handleKeyboardInput();
        } else if (this.mappingTarget.type === "mouseClick") {
            await this.handleMouseInput();
        }
    }

    private async handleKeyboardInput() {
        const {keybinding} = this.mappingTarget as KeyboardTarget;
        await keyboard.pressKey(...keybinding);
        await keyboard.releaseKey(...keybinding);
    }

    private async handleMouseInput() {
        const {mouseClick} = this.mappingTarget as MouseClickTarget;
        await mouse.pressButton(mouseClick);
        await mouse.releaseButton(mouseClick);
    }
}