import { MouseMotionTarget, Coordinates, AnalogKeyboardTarget } from "../../types.js";
import { ControllerInput } from "./ControllerInput.js";
import {keyboard, mouse, Point, screen} from "@nut-tree-fork/nut-js"
keyboard.config.autoDelayMs = 0;
mouse.config.autoDelayMs = 0;

// Coordinates correspond to joystick x,y
// Point corresponds to mouse x,y

export class AnalogInput extends ControllerInput {
    private sensitivity = 15;
    private deadzone = 0.15;
    private lastPosition: Point = {x:0,y:0};
    private currentPosition: Coordinates = {x:0, y:0};
    private moveInterval: NodeJS.Timeout | null = null;
    private isMoving: boolean = false;
    private screenWidth: number = 1600;
    private screenHeight: number = 900;
    private isXMoving: boolean = false;
    private isYMoving: boolean = false;
    constructor(id: string, mappingTarget: MouseMotionTarget | AnalogKeyboardTarget) {
        super(id, mappingTarget)
    }

    async setScreenDimensions() {
        this.screenWidth = await screen.width();
        this.screenHeight = await screen.height();

        console.log(this.screenHeight);
        console.log(this.screenWidth);
    }

    async handleInput(position: Coordinates): Promise<void> {
        // console.log(position);

        // Apply Deadzone
        if (Math.abs(position.x) <= this.deadzone) {
            position.x = 0;
        }
        if (Math.abs(position.y) <= this.deadzone) {
            position.y = 0;
        }

        this.currentPosition = position;
        
        // Need the stopMotion to stop the interval
        if (this.mappingTarget.type === "mouseMotion") {
            if (!this.isMoving) {
                this.startMotion();
            } else if (this.currentPosition.x===0 && this.currentPosition.y===0) {
                this.stopMotion();
            }
        } else if (this.mappingTarget.type === "analogKeyboard") {
            this.handleKeyboardInput();
        }
        
    }

    async startMotion(): Promise<void> {
        // Clear any existing interval to avoid multiple intervals
        if (this.moveInterval) {
            clearInterval(this.moveInterval);
        }

        this.isMoving = true;
        
        // Set up interval for continuous movement
        this.moveInterval = setInterval(async () => {
            await this.handleMouseMotionInput();
        }, 16); // ~60fps updates
    } 

    stopMotion(): void {
        this.isMoving = false
        if (this.moveInterval) {
            clearInterval(this.moveInterval);
        }
        this.currentPosition = {x:0,y:0};
    }

    private async handleMouseMotionInput() {

        this.lastPosition = await mouse.getPosition();

        const point_x = Math.max(Math.min(this.lastPosition.x + this.currentPosition.x*this.sensitivity, this.screenWidth), 0)
        const point_y = Math.max(Math.min(this.lastPosition.y - this.currentPosition.y*this.sensitivity, this.screenHeight), 0)

        const point = new Point(point_x, point_y)

        // mouse.move(straightTo(point));
        mouse.setPosition(point);

        this.lastPosition.x = point_x;
        this.lastPosition.y = point_y;
    }

    private async handleKeyboardInput() {
        const {positiveX, positiveY, negativeX, negativeY} = this.mappingTarget as AnalogKeyboardTarget
        if (this.currentPosition.x === 0) {
            await keyboard.releaseKey(...positiveX);
            await keyboard.releaseKey(...negativeX);
            this.isXMoving = false;
        }
        if (this.currentPosition.y === 0) {
            await keyboard.releaseKey(...positiveY);
            await keyboard.releaseKey(...negativeY);
            this.isYMoving = false;
        }

        if (this.currentPosition.x === 0 && this.currentPosition.y === 0) {
            return;
        }

        if (!this.isXMoving) {
            if (this.currentPosition.x!==0) {
                this.isXMoving = true;
            }
            if (this.currentPosition.x > 0) {
                await keyboard.releaseKey(...positiveX);
                await keyboard.pressKey(...positiveX);
            } else if (this.currentPosition.x < 0) {
                await keyboard.releaseKey(...negativeX);
                await keyboard.pressKey(...negativeX);
            }
        }
        
        if (!this.isYMoving) {
            if (this.currentPosition.y!==0) {
                this.isYMoving = true;
            }
            if (this.currentPosition.y > 0) {
                await keyboard.releaseKey(...positiveY);
                await keyboard.pressKey(...positiveY);
            } else if (this.currentPosition.y < 0) {
                await keyboard.releaseKey(...negativeY);
                await keyboard.pressKey(...negativeY);
            }
        }
        
    }

    setSensitivity(sensitivity: number): void {
        if (sensitivity > 0) {
            this.sensitivity = sensitivity;
        }
    }

}