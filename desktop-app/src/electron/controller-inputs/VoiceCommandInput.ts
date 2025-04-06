import { KeyboardTarget, MouseClickTarget } from "../../types.js";
import { ControllerInput } from "./ControllerInput.js";

export class VoiceCommandInput extends ControllerInput {

    constructor(id: string, mappingTarget: KeyboardTarget | MouseClickTarget) {
        super(id, mappingTarget);
    }

    async handleInput(frame: unknown): Promise<void> {
        // if (!this.rhino) return;
        // const isFinalized = this.rhino.process(frame);
        // if (isFinalized) {
        //     const command = this.rhino.getInference();
        //     if (command.isUnderstood) {
        //         console.log(command);
        //     }
        // }
        console.log(frame);
    }

    private async handleKeyboardInput(command: string) {
        console.log(command);
    }

    private async handleMouseInput(command: string) {
        console.log(command);
    }
}