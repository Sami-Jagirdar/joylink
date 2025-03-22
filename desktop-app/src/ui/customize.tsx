import { useEffect, useState } from "react";
import { Mapping } from "../../types";
import { useNavigate } from "react-router-dom";
import {Key, Button} from "@nut-tree-fork/nut-js";
// Input SVGs
import buttonA from '../assets/button-A.svg'
import buttonB from '../assets/button-B.svg'
import buttonX from '../assets/button-X.svg'
import buttonY from '../assets/button-Y.svg'
import buttonUp from '../assets/button-Up.svg'
import buttonDown from '../assets/button-Down.svg'
import buttonLeft from '../assets/button-Left.svg'
import buttonRight from '../assets/button-Right.svg'
import buttonStart from '../assets/button-Start.svg'
import buttonSelect from '../assets/button-Select.svg'

enum KeyNum {
    Escape = 0,
    F1 = 1,
    F2 = 2,
    F3 = 3,
    F4 = 4,
    F5 = 5,
    F6 = 6,
    F7 = 7,
    F8 = 8,
    F9 = 9,
    F10 = 10,
    F11 = 11,
    F12 = 12,
    F13 = 13,
    F14 = 14,
    F15 = 15,
    F16 = 16,
    F17 = 17,
    F18 = 18,
    F19 = 19,
    F20 = 20,
    F21 = 21,
    F22 = 22,
    F23 = 23,
    F24 = 24,
    Print = 25,
    ScrollLock = 26,
    Pause = 27,
    Grave = 28,
    Num1 = 29,
    Num2 = 30,
    Num3 = 31,
    Num4 = 32,
    Num5 = 33,
    Num6 = 34,
    Num7 = 35,
    Num8 = 36,
    Num9 = 37,
    Num0 = 38,
    Minus = 39,
    Equal = 40,
    Backspace = 41,
    Insert = 42,
    Home = 43,
    PageUp = 44,
    NumLock = 45,
    NumPadEqual = 46,
    Divide = 47,
    Multiply = 48,
    Subtract = 49,
    Tab = 50,
    Q = 51,
    W = 52,
    E = 53,
    R = 54,
    T = 55,
    Y = 56,
    U = 57,
    I = 58,
    O = 59,
    P = 60,
    LeftBracket = 61,
    RightBracket = 62,
    Backslash = 63,
    Delete = 64,
    End = 65,
    PageDown = 66,
    NumPad7 = 67,
    NumPad8 = 68,
    NumPad9 = 69,
    Add = 70,
    CapsLock = 71,
    A = 72,
    S = 73,
    D = 74,
    F = 75,
    G = 76,
    H = 77,
    J = 78,
    K = 79,
    L = 80,
    Semicolon = 81,
    Quote = 82,
    Return = 83,
    NumPad4 = 84,
    NumPad5 = 85,
    NumPad6 = 86,
    LeftShift = 87,
    Z = 88,
    X = 89,
    C = 90,
    V = 91,
    B = 92,
    N = 93,
    M = 94,
    Comma = 95,
    Period = 96,
    Slash = 97,
    RightShift = 98,
    Up = 99,
    NumPad1 = 100,
    NumPad2 = 101,
    NumPad3 = 102,
    Enter = 103,
    LeftControl = 104,
    LeftSuper = 105,
    LeftWin = 106,
    LeftCmd = 107,
    LeftAlt = 108,
    Space = 109,
    RightAlt = 110,
    RightSuper = 111,
    RightWin = 112,
    RightCmd = 113,
    Menu = 114,
    RightControl = 115,
    Fn = 116,
    Left = 117,
    Down = 118,
    Right = 119,
    NumPad0 = 120,
    Decimal = 121,
    Clear = 122,
    AudioMute = 123,
    AudioVolDown = 124,
    AudioVolUp = 125,
    AudioPlay = 126,
    AudioStop = 127,
    AudioPause = 128,
    AudioPrev = 129,
    AudioNext = 130,
    AudioRewind = 131,
    AudioForward = 132,
    AudioRepeat = 133,
    AudioRandom = 134
}

enum ButtonNum {
    LEFT = 0,
    MIDDLE = 1,
    RIGHT = 2
}


function Customize() {
    const navigate = useNavigate();
    const [mappings, setMappings] = useState<Mapping[]>([]);

    const buttonIcons: Record<string, string> = {
        // Uncomment and add your actual imports
        'a': buttonA,
        'b': buttonB,
        'x': buttonX,
        'y': buttonY,
        'up': buttonUp,
        'down': buttonDown,
        'left': buttonLeft,
        'right': buttonRight,
        'start': buttonStart,
        'select': buttonSelect,
      };

    useEffect(() => {
        const fetchMappings = async () => {
            const fetchedMappings = await window.electron.getControllerMappings();
            setMappings(fetchedMappings);
        };
        fetchMappings();
    }, []);

    useEffect(() => {
        window.electron.setControllerMappings(mappings);
    }, [mappings]);

    //handler for the customize button
    const handleCustomize = (mappingId: string) => {
        console.log(`Customize button clicked for: ${mappingId}`);
        //TODO: implement customization logic
    };

    // Render key binding pills
    const renderKeyBindings = (keybinding: typeof Key[keyof typeof Key][]) => {
        const pills = [];
        
        // Create 5 pills (some may be empty)
        for (let i = 0; i < 5; i++) {
            const key = keybinding[i];
            pills.push(
                <div key={i} className={`w-1/5 h-10 rounded-md flex items-center justify-center ${key ? 'bg-neutral-800 border border-blue-300' : 'bg-neutral-800 border border-gray-200'}`}>
                    {KeyNum[key] || ''}
                </div>
            );
        }
        
        return (
            <div className="flex space-x-2">
                {pills}
            </div>
        );
    };

    // Render mouse click binding pills
    const renderMouseClickBindings = (mouseClick: typeof Button[keyof typeof Button]) => {
        return (
            <div className="flex space-x-2">
                <div className="w-1/5 h-10 rounded-md flex items-center justify-center bg-neutral-800 border border-red-300">
                    {ButtonNum[mouseClick]}
                </div>
            </div>
        );
    };

    return (
        <div className="container min-w-screen mx-auto p-4">
            <h1 className=" text-xl font-bold text-white mb-4">Customize Controller Mappings</h1>
            {/* Have a png of the chosen layout at the top */}
            
            <div className="space-y-3 p-4">
                {mappings.map((mapping) => (
                    <div key={mapping.id} className=" w-auto p-4 border rounded-lg shadow-sm hover:shadow-md bg-neutral-600 transition-shadow">
                        <div className="flex items-center ">
                        {/* Input section */}
                        <div className="mr-6 w-auto flex items-center">
                            {/* Placeholder for an input image if it exists */}
                            <div className="rounded-full flex items-center justify-center mr-3">
                                <img src={buttonIcons[mapping.id]} alt={mapping.id} className="w-12 h-12" />
                            </div>
                        
                            <div>
                                <div className="font-medium">{mapping.source.charAt(0).toUpperCase() + mapping.source.slice(1)}</div>
                                <div className="text-xs text-gray-300">ID: {mapping.id}</div>
                            </div>
                        </div>
                    
                        {/* Mapping section */}
                        <div className="flex-grow mx-4">
                            <div className="mb-2 text-sm font-medium">
                                <span className={`px-3 py-1 rounded-full ${
                                    mapping.target.type === 'keyboard' ? 'border-blue-100 bg-neutral-800 text-blue-300' : 
                                    mapping.target.type === 'mouseClick' ? 'border-red-100 bg-neutral-800 text-red-300' : 
                                    'bg-neutral-800 text-purple-300'
                                }`}>
                                    {mapping.target.type === 'keyboard' ? 'Keyboard' : 
                                    mapping.target.type === 'mouseClick' ? 'Mouse Click' : 
                                    'Mouse Motion'}
                                </span>
                            </div>
                            {mapping.target.type === 'keyboard' && renderKeyBindings(mapping.target.keybinding)}
                            {mapping.target.type === 'mouseClick' && renderMouseClickBindings(mapping.target.mouseClick)}
                        </div>
                    
                        {/* Customize button */}
                        <div>
                            <button
                            className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:!border-white transition-colors"
                            
                            onClick={() => handleCustomize(mapping.id)}
                            >
                                Customize
                            </button>
                        </div>
                    </div>
                </div>
                ))}
            </div>
            
            <button
                className="px-8 py-4 bg-blue-600 text-white text-xl font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition-colors duration-300 transform hover:scale-105"
                onClick={() => navigate('/connections')}
            >
                Play
            </button>



        </div>
    );
}

export default Customize;