import { KeyboardTarget, MouseClickTarget } from "../../types.js";
import { ControllerInput } from "./ControllerInput.js";

export class VoiceCommandInput extends ControllerInput {
    constructor(id: string, mappingTarget: KeyboardTarget | MouseClickTarget) {
        super(id, mappingTarget);
    }

    async handleInput(frame: Int16Array): Promise<void> {
        console.log(frame);
    }

    private async handleKeyboardInput(command: string) {
        console.log(command);
    }

    private async handleMouseInput(command: string) {
        console.log(command);
    }
}