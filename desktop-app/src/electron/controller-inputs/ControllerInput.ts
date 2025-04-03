import { OutputTarget } from "../../types.js";
import {screen} from "@nut-tree-fork/nut-js"


export abstract class ControllerInput {
    protected id: string;
    protected enabled: boolean;
    protected mappingTarget: OutputTarget;
    protected screenWidth: number = 1600;
    protected screenHeight: number = 900;
    protected sensitivity = 15;


    constructor(id: string, mappingTarget: OutputTarget) {
        this.id = id;
        this.mappingTarget = mappingTarget;
        this.enabled = true;
    }

    getId(): string {
        return this.id;
    }

    getMappingTarget(): OutputTarget {
        return this.mappingTarget;
    }

    async setScreenDimensions() {
        this.screenWidth = await screen.width();
        this.screenHeight = await screen.height();

        console.log(this.screenHeight);
        console.log(this.screenWidth);
    }

    setSensitivity(sensitivity: number): void {
        if (sensitivity > 0) {
            this.sensitivity = sensitivity;
        }
    }

    abstract handleInput(data: unknown): Promise<void>;

}
