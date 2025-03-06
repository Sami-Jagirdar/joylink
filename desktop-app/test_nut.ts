import {keyboard, Key} from "@nut-tree-fork/nut-js";

async function testKeyboard() {
    console.log("Pressing 'A' key...");
    // await keyboard.pressKey(Key.A);
    // await keyboard.pressKey(Key.B);

    await keyboard.pressKey(...[Key['LeftControl'],Key['A']]);
  
    await new Promise((resolve) => setTimeout(resolve, 2000));
  
    console.log("Releasing 'A' key...");
    // await keyboard.releaseKey(Key.A);
    await keyboard.releaseKey(Key['LeftControl'],Key['A']);
  }
  
  testKeyboard().catch(console.error);

  