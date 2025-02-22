import {keyboard, Key} from "@nut-tree-fork/nut-js";

async function testKeyboard() {
    console.log("Pressing 'A' key...");
    await keyboard.pressKey(Key.A);
  
    // Wait 1 second
    await new Promise((resolve) => setTimeout(resolve, 1000));
  
    console.log("Releasing 'A' key...");
    await keyboard.releaseKey(Key.A);
  }
  
  testKeyboard().catch(console.error);

  