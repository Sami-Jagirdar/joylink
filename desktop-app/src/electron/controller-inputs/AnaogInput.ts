import { KeyboardTarget, MouseMotionTarget, Coordinates } from "../../types.js";
import { ControllerInput } from "./ControllerInput.js";
import {keyboard, mouse, Point, screen} from "@nut-tree-fork/nut-js"
keyboard.config.autoDelayMs = 0;
mouse.config.autoDelayMs = 0;



export class AnalogInput extends ControllerInput {
    private sensitivity = 15;
    private deadzone = 0.07;
    private lastPosition: Point = {x:0,y:0};
    private screenWidth: number = 1600;
    private screenHeight: number = 900;
    constructor(id: string, mappingTarget: MouseMotionTarget | KeyboardTarget) {
        super(id, mappingTarget)
    }

    async setScreenDimensions() {
        this.screenWidth = await screen.width();
        this.screenHeight = await screen.height();

        console.log(this.screenHeight);
        console.log(this.screenWidth);
    }

    async handleInput(position: Coordinates): Promise<void> {
        console.log(position);
        if (this.mappingTarget.type == "mouseMotion") {
            await this.handleMouseMotionInput(position);
        }

    }

    private async handleMouseMotionInput(position: Coordinates) {
        if (Math.abs(position.x) < this.deadzone) {
            position.x = 0;
        }
        if (Math.abs(position.y) < this.deadzone) {
            position.y = 0;
        }

        this.lastPosition = await mouse.getPosition();

        position.x*=this.sensitivity;
        position.y*=this.sensitivity;

        const point_x = Math.max(Math.min(this.lastPosition.x + position.x, this.screenWidth), 0)
        const point_y = Math.max(Math.min(this.lastPosition.y - position.y, this.screenHeight), 0)

        const point = new Point(point_x, point_y)

        // mouse.move(straightTo(point));
        mouse.setPosition(point);

        this.lastPosition.x = point_x;
        this.lastPosition.y = point_y;
    }

    setSensitivity(sensitivity: number): void {
        if (sensitivity > 0) {
            this.sensitivity = sensitivity;
        }
    }
}