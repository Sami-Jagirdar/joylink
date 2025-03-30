/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect } from "react";
import Keyboard, { } from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import "../index.css";
import { Mapping } from "../../types";
import { keyNumToKeyboardMap, KeyNum, keyboardToKeyNumMap, modifiers } from "../models";

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
  onMappingChange?: (newKeybinding: KeyNum[]) => void;
}

function KeyboardLayout({ currentMapping, allMappings, onMappingChange}: KeyboardLayoutProps) {

  const [layoutName, setLayoutName] = useState<string>("default");
  const [selectedKeys, setSelectedKeys] = useState<KeyNum[]>([]);
  const [unavailableKeys, ] = useState<KeyNum[]>([]);

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

    // The below code for getting unavailable keys is unnecessary
    // Users should be able to map the same keys
    // to different buttons if they want

    // const unavailable: KeyNum[] = [];
    // allMappings.forEach(mapping => {
    //   if (
    //     mapping.id !== currentMapping?.id && 
    //     mapping.target.type === 'keyboard'
    //   ) {
    //     (mapping.target as KeyboardTarget).keybinding.forEach(key => {
    //       const num: KeyNum = key.valueOf();
    //       if (!unavailable.includes(num)) {
    //         unavailable.push(num);
    //       }
    //     });
    //   }
    // });
    // setUnavailableKeys(unavailable);

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


/* sortKeysByModifierPriority Generated with the help of Claude LLM
  Prompt: export const modifiers: KeyNum[] = [
    KeyNum.LeftControl,
    KeyNum.RightControl,
    KeyNum.LeftAlt,
    KeyNum.RightAlt,
    KeyNum.LeftShift,
    KeyNum.RightShift,
  ]

  Basically the selected keys, if they contain any modifier, the modifier must be at the start and those modifiers must have the above order as well and then the other key can go after.

  Eg: User clicks keys in the order: A -> LeftShift -> LeftControl
  It must be reordered to LeftControl -> LeftShift -> A

  The handleKeyPress function was also provided in the prompt*/
const sortKeysByModifierPriority = (keys: KeyNum[]): KeyNum[] => {

  const modifierKeys: KeyNum[] = [];
  const nonModifierKeys: KeyNum[] = [];
  
  keys.forEach(key => {
    if (modifiers.includes(key)) {
      modifierKeys.push(key);
    } else {
      nonModifierKeys.push(key);
    }
  });
  
  // Sort modifiers according to their order in the modifiers array
  modifierKeys.sort((a, b) => {
    const indexA = modifiers.indexOf(a);
    const indexB = modifiers.indexOf(b);
    return indexA - indexB;
  });
  
  // Return modifiers followed by non-modifiers
  return [...modifierKeys, ...nonModifierKeys];
};
  
  // Have to use any because the node module itself is of any type and disables typescript eslint rule for this
  const keyboardRef = useRef<any>(null);
  const keyboardControlPadRef = useRef<any>(null);
  const keyboardArrowRef = useRef<any>(null);
  const keyboardNumPadRef = useRef<any>(null);
  const keyboardNumPadEndRef = useRef<any>(null);

  const getCommonKeyboardOptions = (): KeyboardOptions => ({
    onChange: handleChange,
    onKeyPress: handleKeyPress,
    theme: "simple-keyboard hg-theme-default hg-layout-default",
    physicalKeyboardHighlight: true,
    syncInstanceInputs: true,
    mergeDisplay: true,
    debug: true
  });

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

    if (unavailableKeys.includes(keyboardToKeyNumMap[button])) {
      return;
    }

    if (selectedKeys.includes(keyboardToKeyNumMap[button])) {
      // Ideally, we find a way to know which keyboard reference called this method
      // For now, since button is unique to each ref, only one of these executes as expected
      keyboardRef.current.removeButtonTheme(button, "selected-key")
      keyboardArrowRef.current.removeButtonTheme(button, "selected-key")
      keyboardControlPadRef.current.removeButtonTheme(button, "selected-key")
      keyboardNumPadRef.current.removeButtonTheme(button,"selected-key")
      keyboardNumPadEndRef.current.removeButtonTheme(button, "selected-key")

      const newSelected = selectedKeys.filter(k => k !== keyboardToKeyNumMap[button]);
      setSelectedKeys(newSelected);
      if (onMappingChange) {
        onMappingChange(newSelected);
      }
    } else {

      if (selectedKeys.length >= 3) {
        return; // Max 3 keys can be mapped
      }

      keyboardRef.current.addButtonTheme(button, "selected-key")
      keyboardArrowRef.current.addButtonTheme(button, "selected-key")
      keyboardControlPadRef.current.addButtonTheme(button, "selected-key")
      keyboardNumPadRef.current.addButtonTheme(button,"selected-key")
      keyboardNumPadEndRef.current.addButtonTheme(button, "selected-key")

      const newSelected = [...selectedKeys, keyboardToKeyNumMap[button]]
      const sortedKeys = sortKeysByModifierPriority(newSelected);

      setSelectedKeys(sortedKeys)
      if (onMappingChange) {
        onMappingChange(sortedKeys);
      }
    }

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