import { useState } from 'react';
import KeyboardLayout from './keyboard'; // Import your keyboard component
import { Mapping } from '../../types';
import { KeyNum } from '../models';
import {Key} from "@nut-tree-fork/nut-js";

interface CustomizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  mappings: Mapping[];
  selectedMapping: Mapping;
  onSave: (updatedMapping: Mapping) => void;
}

// TabOption component for the modal tabs
const TabOption = ({ 
  label, 
  isActive, 
  onClick 
}: { 
  label: string; 
  isActive: boolean; 
  onClick: () => void;
}) => (
  <button
    className={`px-4 py-2 font-medium rounded-t-md ${
      isActive 
        ? 'bg-neutral-100 text-neutral-900 border-b-2 border-red-500' 
        : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
    }`}
    onClick={onClick}
  >
    {label}
  </button>
);

function CustomizeModal ({ isOpen, onClose, mappings, selectedMapping, onSave }: CustomizeModalProps) {
  const [selectedTab, setSelectedTab] = useState<'mouse' | 'keyboard'>('keyboard');
  const [tempKeybinding, setTempKeybinding] = useState<KeyNum[]>([])

  const handleKeybindingChange = (newKeys: KeyNum[]) => {
    console.log(`new keys: ${JSON.stringify(newKeys)}`)
    setTempKeybinding(newKeys);
  };

  const handleSave = () => {
    if (!selectedMapping) {return;}

    if (selectedTab === 'keyboard') {
      const keybinding: Key[] = []
      tempKeybinding.forEach(key => {
        keybinding.push(key.valueOf())
      })
      
      onSave({
        ...selectedMapping,
        target: {
          type: 'keyboard',
          keybinding: keybinding
        }
      })
    } else {
      // TODO: Handle mouse click save
    }

    onClose();
    }


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-neutral-900 text-white rounded-lg shadow-xl w-11/12 max-w-6xl max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b border-neutral-700">
          <h2 className="text-xl font-semibold">Customize Controls</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-neutral-700 text-neutral-400 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-neutral-700">
          <TabOption 
            label="Keyboard" 
            isActive={selectedTab === 'keyboard'} 
            onClick={() => setSelectedTab('keyboard')} 
          />
          <TabOption 
            label="Mouse" 
            isActive={selectedTab === 'mouse'} 
            onClick={() => setSelectedTab('mouse')} 
          />
        </div>

        {/* Modal Content */}
        <div className="p-4 flex-1 overflow-auto">
          {selectedTab === 'mouse' ? (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Mouse Customization</h3>
              <p>Configure your mouse settings here.</p>
              
              {/* Display mappings for mouse */}
              <div className="bg-neutral-800 p-4 rounded-md">
                <h4 className="font-medium mb-2">Current Mappings</h4>
                <pre className="text-sm overflow-x-auto">
                  {JSON.stringify(mappings, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Keyboard Customization</h3>
              <p>Select upto 3 keys on the keyboard to bind to chosen button.</p>
              
              {/* Keyboard Component */}
              <div className="bg-neutral-800 rounded-md p-4">
                <KeyboardLayout 
                currentMapping={selectedMapping} 
                allMappings={mappings} 
                onMappingChange={handleKeybindingChange}/>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end space-x-2 p-4 border-t border-neutral-700">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-neutral-700 text-white rounded-md hover:bg-neutral-600 hover:cursor-pointer"
          >
            Cancel
          </button>
          <button 
            className="px-4 py-2 bg-red-700 text-white rounded-md hover:cursor-pointer hover:bg-red-500"
            onClick={handleSave}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default CustomizeModal;