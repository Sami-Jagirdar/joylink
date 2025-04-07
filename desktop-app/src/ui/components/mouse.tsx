import { useEffect, useState } from "react";
import { Mapping } from "../../types";
import { ButtonNum } from "../models";

interface MouseLayoutProps {
    currentMapping? : Mapping;
    onMappingChange?: (newMouseClick: ButtonNum) => void;
}

function MouseLayout({currentMapping, onMappingChange}: MouseLayoutProps) {
    const [selectedClick, setSelectedClick] = useState<ButtonNum | null>(null);

    useEffect(() => {
        if (currentMapping && currentMapping.target.type === 'mouseClick') {
            const button: ButtonNum = currentMapping.target.mouseClick.valueOf();
            setSelectedClick(button);
        } else setSelectedClick(null);
    }, [currentMapping])

    const handleButtonClick = (button: ButtonNum): void => {
        setSelectedClick(button);
        if (onMappingChange) {
            onMappingChange(button);
        }
    }

    const getButtonName = (button: ButtonNum): string => {
        switch (button) {
            case ButtonNum.LEFT:
                return "Left Click";
            case ButtonNum.MIDDLE:
                return "Middle Click";
            case ButtonNum.RIGHT:
                return "Right Click";
            default:
                return "Unknown Button";
        }
    };

    return (
        <div className="flex flex-col items-center">
            <div className="mb-6">
                <h3 className="text-lg font-medium">
                    {currentMapping ? 
                        `Binding for: ${currentMapping.id}` : 
                        "Mouse Button Selection"}
                </h3>
                <p className="text-sm text-neutral-400 mt-1">
                    Click on a mouse button to select it
                </p>
            </div>

            {/* Mouse visual representation */}
            <div className="relative w-64 h-72 border-2 border-neutral-600 rounded-full rounded-b-4xl bg-black flex flex-col items-center">
                {/* Top buttons (left and right clicks) */}
                <div className="flex w-full mt-2">
                    <div 
                        className={`w-1/2 h-28 border-r border-neutral-600 cursor-pointer rounded-tl-full flex items-center justify-center
                            ${selectedClick === ButtonNum.LEFT ? 'bg-red-700' : 'hover:bg-neutral-600'}`}
                        onClick={() => handleButtonClick(ButtonNum.LEFT)}
                    >
                        <span className="text-sm font-medium">LEFT</span>
                    </div>
                    <div 
                        className={`w-1/2 h-28 cursor-pointer rounded-tr-full flex items-center justify-center
                            ${selectedClick === ButtonNum.RIGHT ? 'bg-red-700' : 'hover:bg-neutral-600'}`}
                        onClick={() => handleButtonClick(ButtonNum.RIGHT)}
                    >
                        <span className="text-sm font-medium">RIGHT</span>
                    </div>
                </div>

                {/* Scroll wheel (middle button) */}
                <div className="w-full flex justify-center mt-2">
                    <div 
                        className={`w-12 h-12 rounded-4xl border-2 border-neutral-500 cursor-pointer flex items-center justify-center
                            ${selectedClick === ButtonNum.MIDDLE ? 'bg-red-700 border-red-400' : 'hover:bg-neutral-600'}`}
                        onClick={() => handleButtonClick(ButtonNum.MIDDLE)}
                    >
                        <span className="text-xs font-medium">MID</span>
                    </div>
                </div>

                {/* Mouse body */}
                <div className="absolute bottom-0 w-full h-24 flex items-end justify-center pb-4">
                    <div className="w-4 h-10 border-2 border-neutral-500 rounded-t-full rounded-b-3xl"></div>
                </div>
            </div>

            {/* Currently selected button display */}
            <div className="mt-8 p-4 bg-neutral-800 rounded-md w-full">
                <h4 className="font-medium mb-2">Selected Button:</h4>
                {selectedClick !== null ? (
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-red-700"></div>
                        <span>{getButtonName(selectedClick)}</span>
                    </div>
                ) : (
                    <div className="text-neutral-500 italic">No button selected</div>
                )}
            </div>
        </div>
    );
}

export default MouseLayout;