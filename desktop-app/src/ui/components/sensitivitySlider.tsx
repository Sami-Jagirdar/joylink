import React, { useEffect } from 'react';
import { Mapping } from '../../types';

interface SensitivitySliderProps {
  currentMapping: Mapping;
  onSensitivityChange: (newSensitivity: number) => void;
}

function SensitivitySlider({ currentMapping, onSensitivityChange }: SensitivitySliderProps) {

    const [sensitivity, setSensitivity] = React.useState<number>(1);
  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSensitivity(parseInt(event.target.value, 10));
    onSensitivityChange(parseInt(event.target.value, 10));
  };

  useEffect(() => {
    if (currentMapping && currentMapping.target.type === 'mouseMotion') {
      setSensitivity(currentMapping.target.sensitivity)
    }
  }, [currentMapping])

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-lg font-medium">Mouse Motion Sensitivity</h3>
      <p className="text-sm text-neutral-400 mt-1">
        Adjust the sensitivity for mouse motion input.
      </p>
      <div className="w-full flex items-center mt-4">
        <input
          type="range"
          min="1"
          max="100"
          value={sensitivity}
          onChange={handleSliderChange}
          className="w-full accent-red-600 cursor-pointer"
        />
      </div>
      <div className="mt-2">
        <span className="text-sm">Current Sensitivity: {sensitivity}</span>
      </div>
    </div>
  );
}

export default SensitivitySlider;
