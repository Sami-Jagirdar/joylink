import { MouseMotionTarget, Accelerometer, AnalogKeyboardTarget } from "../../types.js";
import { ControllerInput } from "./ControllerInput.js";
import {keyboard, mouse, Point} from "@nut-tree-fork/nut-js"
mouse.config.autoDelayMs = 0;
mouse.config.autoDelayMs = 0;

// FR17- Process.Motion.Input
export class MotionInput extends ControllerInput {
    private g = 9.81;
    private halfG = this.g/2;
    private negativeHalfG = this.g/-2
    private topOfPhoneIsOnLeft = true;
    private tiltFix = 60 * (Math.PI/180); //Set tilt angle where no movement is made to 60 degrees
    private mousePosition = new Point(0,0);
    private deadAngleSteerKeyboard = 8 * (Math.PI/180); //Middle 10x2 degrees are dead
    private deadAngleTiltKeyboard = 15 * (Math.PI/180);
    private deadAngleSteerMouse = 2 * (Math.PI/180);
    private deadAngleTiltMouse = 3 * (Math.PI/180);

    private currentYDir = 0;
    private currentXDir = 0;

    constructor(id: string, mappingTarget: MouseMotionTarget | AnalogKeyboardTarget) {
        super(id, mappingTarget)
    }

    /**
     * Maps raw acceleromter data to mouse motions. Magnitude of acceleration is 9.81 at any time
     * the phone is stationary. Use the direction of this acceleration to determine where the ground
     * and the orientation of the phone. If the phone is flat on a table facing upwards, z would be -9.81
     * and x and y will be 0. If the phone is perfectly on its edge and in landscape (camera side on left),
     * x would be -9.81.
     *
     * Here, a phone is assumed to be held in landscape. A 45 degree angle indicates no movement. Changing this
     * will cause up and down movement. If the phone is tilted sidedways, this will mean left and right mouse
     * movement.
     *
     * Note all calculations within this method are in radians, however degrees are specified in comments for clarity.
     * @param accelerometer
     */
    async handleInput(accelerometer: Accelerometer): Promise<void> {
        //Tilt angle is how much the phone (when held in landscape) is upright.
        //0 means flat relative to ground, 90 means upright
        const tiltAngle = Math.acos(this.clipInRange(-accelerometer.z / this.g, -1, 1));

        //Math is different depending on which landscape orientation is used
        if (accelerometer.x < this.negativeHalfG) {
            this.topOfPhoneIsOnLeft = true
        } else if ( accelerometer.x > this.halfG) {
            this.topOfPhoneIsOnLeft = false
        }

        //Steer angle (when held in landscape) is like the steering angle of the car
        //0 is when the phone is parallel, negative when steering left, positive when steering right
        let steerAngle
        if (this.topOfPhoneIsOnLeft) {
            steerAngle = Math.atan2(-accelerometer.y, -accelerometer.x - accelerometer.z); //Not using pythagreas since this is just approximate
        } else {
            steerAngle = Math.atan2(accelerometer.y, accelerometer.x - accelerometer.z); //Not using pythagreas since this is just approximate
        }

        if (this.mappingTarget.type === "mouseMotion") {
            if ((steerAngle > this.deadAngleSteerMouse) || (steerAngle < -this.deadAngleSteerMouse)) {
                this.mousePosition.x = this.clipInRange(this.mousePosition.x + steerAngle*this.sensitivity, 0, this.screenWidth)
            }
            if ((tiltAngle > this.tiltFix + this.deadAngleTiltMouse) || (tiltAngle < this.tiltFix - this.deadAngleTiltMouse)) {
                this.mousePosition.y = this.clipInRange(this.mousePosition.y + (tiltAngle - this.tiltFix)*this.sensitivity, 0, this.screenHeight)
            }
            mouse.setPosition(this.mousePosition);
        } else if (this.mappingTarget.type === "analogKeyboard") {
            const {positiveX, positiveY, negativeX, negativeY} = this.mappingTarget as AnalogKeyboardTarget

            if (tiltAngle > this.tiltFix + this.deadAngleTiltKeyboard) {
                if (this.currentYDir <= 0) {
                    this.currentYDir = 1
                    await keyboard.releaseKey(...positiveY)
                    await keyboard.pressKey(...negativeY);
                }
            } else if (tiltAngle < this.tiltFix - this.deadAngleTiltKeyboard) {
                if (this.currentYDir >= 0) {
                    this.currentYDir = -1
                    await keyboard.releaseKey(...negativeY)
                    await keyboard.pressKey(...positiveY);
                }
            } else {
                this.currentYDir = 0
                await keyboard.releaseKey(...negativeY);
                await keyboard.releaseKey(...positiveY);
            }
            if (steerAngle > this.deadAngleSteerKeyboard) {
                if (this.currentXDir <= 0) {
                    this.currentXDir = 1
                    await keyboard.releaseKey(...negativeX)
                    await keyboard.pressKey(...positiveX);
                }
            } else if (steerAngle < -this.deadAngleSteerKeyboard) {
                if (this.currentXDir >= 0) {
                    this.currentXDir = -1
                    await keyboard.releaseKey(...positiveX)
                    await keyboard.pressKey(...negativeX);
                }
            } else {
                this.currentXDir = 0
                await keyboard.releaseKey(...negativeX);
                await keyboard.releaseKey(...positiveX);
            }
        }

    }

    private clipInRange(val: number, low: number, high: number): number{
        return Math.min(high, Math.max(low, val))
    }

}
