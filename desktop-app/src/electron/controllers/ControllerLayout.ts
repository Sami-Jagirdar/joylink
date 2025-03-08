import { ControllerInput } from "../controller-inputs/ControllerInput";

export class ControllerLayout {
    protected id: string;
    inputs: Map<string, ControllerInput> = new Map();
    
    constructor(id: string) {
        this.id = id;
    }

    addInput(input: ControllerInput): void {
        this.inputs.set(input.getId(), input)
    }

}