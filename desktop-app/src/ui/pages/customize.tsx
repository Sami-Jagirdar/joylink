import { useEffect, useState } from "react";
import { Mapping } from "../../types";
import { useNavigate } from "react-router-dom";
import {Key, Button} from "@nut-tree-fork/nut-js";
// Input SVGs
import buttonA from '../../assets/button-A.svg'
import buttonB from '../../assets/button-B.svg'
import buttonX from '../../assets/button-X.svg'
import buttonY from '../../assets/button-Y.svg'
import buttonUp from '../../assets/button-Up.svg'
import buttonDown from '../../assets/button-Down.svg'
import buttonLeft from '../../assets/button-Left.svg'
import buttonRight from '../../assets/button-Right.svg'
import buttonStart from '../../assets/button-Start.svg'
import buttonSelect from '../../assets/button-Select.svg'
import { ButtonNum, KeyNum } from "../models";
import CustomizeModal from "../components/customizeModal";

function Customize() {
    const navigate = useNavigate();
    const [mappings, setMappings] = useState<Mapping[]>([]);
    const [selectedMapping, setSelectedMapping] = useState<Mapping>({
        id: 'a', source: 'button', target: {type: 'keyboard', keybinding: []}
    })
    const [isModalOpen, setIsModalOpen] = useState(false);

    const buttonIcons: Record<string, string> = {
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
    const handleCustomize = (mapping: Mapping) => {
        console.log(`Customize button clicked for: ${mapping.id}`);
        setSelectedMapping(mapping)
        //TODO: implement customization logic
        if (mapping.source == 'button') {
            handleButtonCustomize(mapping)
        }
    };

    const handleButtonCustomize = (mapping: Mapping) => {
        console.log(mapping);
        openModal()
    }

    // Render key binding pills
    const renderKeyBindings = (keybinding: typeof Key[keyof typeof Key][]) => {
        const pills = [];
        
        // Create 5 pills (some may be empty)
        for (let i = 0; i < 5; i++) {
            const key = keybinding[i];
            pills.push(
                <div key={i} className={`w-1/6 h-10 rounded-md flex items-center justify-center ${key ? 'bg-neutral-900 border border-blue-300' : 'bg-neutral-900 border border-neutral-400'}`}>
                    {KeyNum[key] || ''}
                </div>
            );
        }
        
        return (
            <div className="flex space-x-5">
                {pills}
            </div>
        );
    };

    // Render mouse click binding pills
    const renderMouseClickBindings = (mouseClick: typeof Button[keyof typeof Button]) => {
        return (
            <div className="flex space-x-5">
                <div className="w-1/6 h-10 rounded-md flex items-center justify-center bg-neutral-900 border border-green-300">
                    {ButtonNum[mouseClick]}
                </div>
            </div>
        );
    };

    const openModal = () => {
        setIsModalOpen(true);
      };
    
      const closeModal = () => {
        setIsModalOpen(false);
      };

    return (
        <div className="container min-w-screen mx-auto p-4">
            <h1 className=" text-xl font-bold text-white mb-4">Customize Controller Mappings</h1>
            {/* Have a png of the chosen layout at the top */}
            
            <div className="space-y-3 p-4">
                {mappings.map((mapping) => (
                    <div key={mapping.id} className=" w-auto mb-2 p-4 border-b-neutral-500 border-b rounded-xl shadow-md hover:shadow-lg transition-shadow">
                        <div className="flex items-center ">
                        {/* Input section */}
                        <div className="mr-6 w-auto flex items-center">
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
                                    mapping.target.type === 'mouseClick' ? 'border-green-100 bg-neutral-800 text-green-300' : 
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
                            className="px-4 py-2 mt-6 rounded-md transition-colors hover:text-red-700 hover:cursor-pointer"
                            
                            onClick={() => handleCustomize(mapping)}
                            >
                                Customize
                            </button>
                        </div>
                    </div>
                </div>
                ))}
            </div>
            
            <button
                className="px-8 py-4 bg-neutral-900 text-white text-xl font-semibold rounded-lg hover:border-red-700 hover:border shadow-lg transform hover:scale-105 cursor-pointer"
                onClick={() => navigate('/connections')}
            >
                Play
            </button>

            <CustomizeModal 
                isOpen={isModalOpen} 
                onClose={closeModal} 
                mappings={mappings}
                selectedMapping={selectedMapping} 
            />

        </div>
    );
}

export default Customize;