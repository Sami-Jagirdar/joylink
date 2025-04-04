import { ControllerInput } from "../controller-inputs/ControllerInput.js";

export class ControllerLayout {
    protected id: string;
    inputs: Map<string, ControllerInput> = new Map();
    
    constructor(id: string) {
        this.id = id;
    }

    addInput(input: ControllerInput): void {
        this.inputs.set(input.getId(), input)
    }

    clearInputs(): void {
        this.inputs.clear();
    }

}