/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect } from "react";
import Keyboard, { } from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import "../index.css";
import { KeyboardTarget, Mapping } from "../../types";
import { keyNumToKeyboardMap, KeyNum } from "../models";

// Define the keyboard options interface
interface KeyboardOptions {
  onChange: (input: string) => void;
  onKeyPress: (button: string) => void;
  theme: string;
  physicalKeyboardHighlight: boolean;
  syncInstanceInputs: boolean;
  mergeDisplay: boolean;
  debug: boolean;
  layout?: {
    [key: string]: string[];
  };
  display?: {
    [key: string]: string;
  };
}

interface KeyboardLayoutProps {
  currentMapping?: Mapping;
  allMappings: Mapping[];
  // onMappingChange?: (newKeybinding: KeyNum[]) => void;
}

function KeyboardLayout({ currentMapping, allMappings, }: KeyboardLayoutProps) {

  const [layoutName, setLayoutName] = useState<string>("default");
  const [selectedKeys, setSelectedKeys] = useState<KeyNum[]>([]);
  const [unavailableKeys, setUnavailableKeys] = useState<KeyNum[]>([]);

  useEffect(() => {
    // Set selected keys from current mapping if it's a keyboard mapping
    if (currentMapping && currentMapping.target.type === 'keyboard') {
      const keys: KeyNum[] = [];
      currentMapping.target.keybinding.forEach(keycap => {
        const num = keycap.valueOf();
        keys.push(num)
      })
      setSelectedKeys(keys);
    } else {
      setSelectedKeys([]);
    }

    // Collect unavailable keys from other mappings
    const unavailable: KeyNum[] = [];
    allMappings.forEach(mapping => {
      if (
        mapping.id !== currentMapping?.id && 
        mapping.target.type === 'keyboard'
      ) {
        (mapping.target as KeyboardTarget).keybinding.forEach(key => {
          const num: KeyNum = key.valueOf();
          if (!unavailable.includes(num)) {
            unavailable.push(num);
          }
        });
      }
    });
    
    setUnavailableKeys(unavailable);
  }, [currentMapping, allMappings]);

  useEffect(() => {
    // Get all keyboard refs
    const keyboardRefs = [
      keyboardRef.current,
      keyboardControlPadRef.current,
      keyboardArrowRef.current,
      keyboardNumPadRef.current,
      keyboardNumPadEndRef.current
    ];

    // Clear all themes first

    // Apply selected key theme
    selectedKeys.forEach(key => {
      const buttonStr = keyNumToKeyboardMap[key];
      if (buttonStr) {
        keyboardRefs.forEach(kbRef => {
          if (kbRef) {
            kbRef.addButtonTheme(buttonStr, "selected-key");
            // Also apply to uppercase version if it's a letter
            if (/^[a-z]$/.test(buttonStr)) {
              kbRef.addButtonTheme(buttonStr.toUpperCase(), "selected-key");
            }
          }
        });
      }
    });

    // Apply unavailable key theme
    unavailableKeys.forEach(key => {
      const buttonStr = keyNumToKeyboardMap[key];
      if (buttonStr) {
        keyboardRefs.forEach(kbRef => {
          if (kbRef) {
            kbRef.addButtonTheme(buttonStr, "unavailable-key");
            // Also apply to uppercase version if it's a letter
            if (/^[a-z]$/.test(buttonStr)) {
              kbRef.addButtonTheme(buttonStr.toUpperCase(), "unavailable-key");
            }
          }
        });
      }
    });
  }, [selectedKeys, unavailableKeys, layoutName]);

  
  // Have to use any because the node module itself is of any type and disables typescript eslint rule for this
  const keyboardRef = useRef<any>(null);
  const keyboardControlPadRef = useRef<any>(null);
  const keyboardArrowRef = useRef<any>(null);
  const keyboardNumPadRef = useRef<any>(null);
  const keyboardNumPadEndRef = useRef<any>(null);

  // Define common keyboard options
  const getCommonKeyboardOptions = (): KeyboardOptions => ({
    onChange: handleChange,
    onKeyPress: handleKeyPress,
    theme: "simple-keyboard hg-theme-default hg-layout-default",
    physicalKeyboardHighlight: true,
    syncInstanceInputs: true,
    mergeDisplay: true,
    debug: true
  });

  // Define all keyboard options
  const getKeyboardOptions = (): KeyboardOptions => ({
    ...getCommonKeyboardOptions(),
    /**
     * Layout by:
     * Sterling Butters (https://github.com/SterlingButters)
     */
    layout: {
      default: [
        "{escape} {f1} {f2} {f3} {f4} {f5} {f6} {f7} {f8} {f9} {f10} {f11} {f12}",
        "` 1 2 3 4 5 6 7 8 9 0 - = {backspace}",
        "{tab} q w e r t y u i o p [ ] \\",
        "{capslock} a s d f g h j k l ; ' {enter}",
        "{shiftleft} z x c v b n m , . / {shiftright}",
        "{controlleft} {altleft} {metaleft} {space} {metaright} {altright}"
      ],
      shift: [
        "{escape} {f1} {f2} {f3} {f4} {f5} {f6} {f7} {f8} {f9} {f10} {f11} {f12}",
        "~ ! @ # $ % ^ & * ( ) _ + {backspace}",
        "{tab} Q W E R T Y U I O P { } |",
        '{capslock} A S D F G H J K L : " {enter}',
        "{shiftleft} Z X C V B N M < > ? {shiftright}",
        "{controlleft} {altleft} {metaleft} {space} {metaright} {altright}"
      ]
    },
    display: {
      "{escape}": "esc ⎋",
      "{tab}": "tab ⇥",
      "{backspace}": "backspace ⌫",
      "{enter}": "enter ↵",
      "{capslock}": "caps lock ⇪",
      "{shiftleft}": "shift ⇧",
      "{shiftright}": "shift ⇧",
      "{controlleft}": "ctrl ⌃",
      "{controlright}": "ctrl ⌃",
      "{altleft}": "alt ⌥",
      "{altright}": "alt ⌥",
      "{metaleft}": "cmd ⌘",
      "{metaright}": "cmd ⌘"
    }
  });

  const getKeyboardControlPadOptions = (): KeyboardOptions => ({
    ...getCommonKeyboardOptions(),
    layout: {
      default: [
        "{prtscr} {scrolllock} {pause}",
        "{insert} {home} {pageup}",
        "{delete} {end} {pagedown}"
      ]
    }
  });

  const getKeyboardArrowsOptions = (): KeyboardOptions => ({
    ...getCommonKeyboardOptions(),
    layout: {
      default: ["{arrowup}", "{arrowleft} {arrowdown} {arrowright}"]
    }
  });

  const getKeyboardNumPadOptions = (): KeyboardOptions => ({
    ...getCommonKeyboardOptions(),
    layout: {
      default: [
        "{numlock} {numpaddivide} {numpadmultiply}",
        "{numpad7} {numpad8} {numpad9}",
        "{numpad4} {numpad5} {numpad6}",
        "{numpad1} {numpad2} {numpad3}",
        "{numpad0} {numpaddecimal}"
      ]
    }
  });

  const getKeyboardNumPadEndOptions = (): KeyboardOptions => ({
    ...getCommonKeyboardOptions(),
    layout: {
      default: ["{numpadsubtract}", "{numpadadd}", "{numpadenter}"]
    }
  });

  const handleChange = (newInput: string): void => {
    console.log("Input changed", newInput);
  };

  const handleKeyPress = (button: string): void => {
    console.log("Button pressed", button);

    // Ideally, we find a way to know which keyboard reference called this method
    // For now, since button is unique to each ref, only one of these is executes as expected
    keyboardRef.current.addButtonTheme(button, "selected-key")
    keyboardArrowRef.current.addButtonTheme(button, "selected-key")
    keyboardControlPadRef.current.addButtonTheme(button, "selected-key")
    keyboardNumPadRef.current.addButtonTheme(button,"selected-key")
    keyboardNumPadEndRef.current.addButtonTheme(button, "selected-key")
  };

  const handleShift = (): void => {
    setLayoutName(prevLayout => 
      prevLayout === "default" ? "shift" : "default"
    );

    
  };

  return (
    <div>
        <div className="ml-2 mb-4 flex">
            <button
            className="px-4 py-2 bg-black text-neutral-400 rounded-md hover:!border-red-700 hover:border-1 cursor-pointer"
            onClick={handleShift}
            >
                Shift View
            </button>
        </div>
 
      <div className={"keyboardContainer"}>
        <Keyboard
          baseClass={"simple-keyboard-main"}
          keyboardRef={r => (keyboardRef.current = r)}
          layoutName={layoutName}
          {...getKeyboardOptions()}
        />

        <div className="controlArrows">
          <Keyboard
            baseClass={"simple-keyboard-control"}
            keyboardRef={r => (keyboardControlPadRef.current = r)}
            {...getKeyboardControlPadOptions()}
          />
          <Keyboard
            baseClass={"simple-keyboard-arrows"}
            keyboardRef={r => (keyboardArrowRef.current = r)}
            {...getKeyboardArrowsOptions()}
          />
        </div>

        <div className="numPad">
          <Keyboard
            baseClass={"simple-keyboard-numpad"}
            keyboardRef={r => (keyboardNumPadRef.current = r)}
            {...getKeyboardNumPadOptions()}
          />
          <Keyboard
            baseClass={"simple-keyboard-numpadEnd"}
            keyboardRef={r => (keyboardNumPadEndRef.current = r)}
            {...getKeyboardNumPadEndOptions()}
          />
        </div>
      </div>
    </div>
  );
}

export default KeyboardLayout;