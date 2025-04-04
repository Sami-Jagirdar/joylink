import { useEffect, useState } from 'react';
import KeyboardLayout from './keyboard';
import { Mapping } from '../../types';
import { ButtonNum, KeyNum } from '../models';
import {Key, Button} from "@nut-tree-fork/nut-js";
import MouseLayout from './mouse';

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


type multiKey = {
  'up': KeyNum[];
  'down': KeyNum[];
  'left': KeyNum[];
  'right': KeyNum[];
}

function CustomizeModal ({ isOpen, onClose, mappings, selectedMapping, onSave }: CustomizeModalProps) {
  const [selectedTab, setSelectedTab] = useState<'mouse' | 'keyboard'>('keyboard');
  const [objectType, setObjectType] = useState<'single' | 'multi'>();
  const [tempKeybinding, setTempKeybinding] = useState<KeyNum[]>([])
  const [tempMouseClick, setTempMouseClick] = useState<ButtonNum>(ButtonNum.LEFT);
  const [tempMultiKeybinding, setTempMultiKeybinding] = useState<multiKey>({
    up: [],
    down: [],
    left: [],
    right: [],
  });
  const [currentDirection, setCurrentDirection] = useState<'up'| 'down'| 'left'| 'right'>('up')

  useEffect(() => {
    setObjectType(selectedMapping.source === 'button' ? 'single' : 'multi')
  }, [selectedMapping])

  const handleKeybindingChange = (newKeys: KeyNum[]) => {
    if (objectType === 'single') {
      console.log(`new keys: ${JSON.stringify(newKeys)}`);
      setTempKeybinding(newKeys);
    } else if (objectType === 'multi') {
      console.log(`new keys: ${JSON.stringify(newKeys)}`)
      setTempMultiKeybinding({
        ...tempMultiKeybinding,
        [currentDirection]: newKeys
      });
    }
  };
  const nextDirection = () => {
    if (currentDirection == 'up') {
      setCurrentDirection('down')
    } else if (currentDirection == 'down') {
      setCurrentDirection('left')
    } else if (currentDirection == 'left') {
      setCurrentDirection('right')
    } else if (currentDirection == 'right') {
      setCurrentDirection('up')
    }
    
  }
  const handleMouseClickChange = (newButton: ButtonNum) => {
    console.log(`new keys: ${JSON.stringify(newButton)}`);
    setTempMouseClick(newButton);
  }

  const handleClose = () => {
    setCurrentDirection('up');
    onClose();
  }

  const handleSave = () => {
    if (!selectedMapping) {return;}
    console.log(123)
    console.log(tempMultiKeybinding)

    if (selectedTab === 'keyboard') {
      if (objectType === 'single') {
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
      } else if (objectType === 'multi') {

        const mapKeyNumToKey = (keyNum: KeyNum) => {
          return keyNum.valueOf()
        }
        setCurrentDirection('up')
        onSave({
          ...selectedMapping,
          target: {
            type: 'analogKeyboard',
            positiveX: tempMultiKeybinding.right.map(mapKeyNumToKey),
            positiveY: tempMultiKeybinding.up.map(mapKeyNumToKey),
            negativeX: tempMultiKeybinding.left.map(mapKeyNumToKey),
            negativeY: tempMultiKeybinding.down.map(mapKeyNumToKey),
          }

        })
      }
    } else {
      const button: Button = tempMouseClick?.valueOf();
      onSave({
        ...selectedMapping,
        target: {
          type: 'mouseClick',
          mouseClick: button
        }
      })
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
              <MouseLayout
              currentMapping={selectedMapping}
              onMappingChange={handleMouseClickChange} />
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Keyboard Customization</h3>
              {objectType==='single' && 
              (<>
                <p>Select upto 3 keys on the keyboard to bind to chosen button.</p>
                <div className="bg-neutral-800 rounded-md p-4">
                  <KeyboardLayout
                  currentMapping={selectedMapping}
                  allMappings={mappings}
                  onMappingChange={handleKeybindingChange}/>
                </div> 
              </>)}
              {objectType==='multi' && 
              (<>
                <p>Select upto 3 keys on the keyboard to bind to the {currentDirection} direction. </p>
                <div className="bg-neutral-800 rounded-md p-4">
                  <KeyboardLayout
                  currentMapping={selectedMapping}
                  allMappings={mappings}
                  onMappingChange={handleKeybindingChange}
                  currentDirection={currentDirection}/>
                </div> 
              </>)}
              
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end space-x-2 p-4 border-t border-neutral-700">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-neutral-700 text-white rounded-md hover:bg-neutral-600 hover:cursor-pointer"
          >
            Cancel
          </button>
          {objectType === 'multi' && currentDirection !== 'right' ? (
              <button
                className="px-4 py-2 bg-red-700 text-white rounded-md hover:cursor-pointer hover:bg-red-500"
                onClick={nextDirection}
              >
                Next
              </button>
            ) : (
              <button
                className="px-4 py-2 bg-red-700 text-white rounded-md hover:cursor-pointer hover:bg-red-500"
                onClick={handleSave}
              >
                Save Changes
              </button>
            )
          }
        </div>
      </div>
    </div>
  );
}

export default CustomizeModal;
