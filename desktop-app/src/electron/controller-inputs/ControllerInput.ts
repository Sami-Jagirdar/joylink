import { OutputTarget } from "../../../types";

export abstract class ControllerInput {
    protected id: string; 
    protected enabled: boolean;
    protected mappingTarget: OutputTarget;

    constructor(id: string, mappingTarget: OutputTarget) {
        this.id = id;
        this.mappingTarget = mappingTarget;
        this.enabled = true;
    }

    abstract handleInput(data: unknown): Promise<void>;

}