import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import layoutOne from '../../assets/layout-one.png';
import layoutTwo from '../../assets/layout-two.png';


function ChooseLayout() {
    const navigate = useNavigate();

    const layoutPreviews: Record<string, string> = {
        'layout-one': layoutOne,
        'layout-two': layoutTwo,
    }

    const [selectedLayout, setSelectedLayout] = useState<string>("layout-one");
    const [layouts, setLayouts] = useState<string[]>([]);

    useEffect(() => {
        const fetchLayouts = async () => {
            const layouts = await window.electron.getLayouts();
            if (layouts) {
                setLayouts(layouts);
            } else {
                setLayouts([]);
            }
        };
        const fetchCurrentLayout = async () => {
            const currentLayout = await window.electron.getCurrentLayout();
            if (currentLayout) {
                setSelectedLayout(currentLayout);
            } else {
                setSelectedLayout("layout-one");
            }
        };
        fetchLayouts();
        fetchCurrentLayout();
    }, []);

    const handleLayoutChange = (layout: string) => {
        setSelectedLayout(layout);
        window.electron.setLayout(layout);
    };


    return (
        <div className="min-h-screen text-white p-8 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-8 text-center">Choose Your Layout</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-center justify-items-center">
              {layouts.map((layout) => (
                <div
                  key={layout}
                  onClick={() => handleLayoutChange(layout)}
                  className={`cursor-pointer border rounded-lg p-4 flex flex-col items-center transition-all 
                    ${selectedLayout === layout ? "ring-4 ring-red-500" : "ring-0"}`}
                >
                  {layoutPreviews[layout] ? (
                    <img src={layoutPreviews[layout]} alt={layout} className="w-full h-auto object-contain mb-4" />
                  ) : (
                    <div className="w-full h-40 flex items-center justify-center mb-4">
                      <span className="text-lg font-medium">{layout}</span>
                    </div>
                  )}
                  <span className="text-lg font-medium">{layout}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end">
            <button
                className="px-8 py-4 mr-4 bg-neutral-900 text-white text-xl font-semibold rounded-lg hover:border-red-700 hover:border shadow-lg transform hover:scale-105 cursor-pointer"
                onClick={() => navigate('/start')}
            >
                Back
            </button>

            <button
              onClick={() => navigate('/customize')}
              className="px-8 py-4 bg-red-700 text-white text-xl font-semibold rounded-lg hover:border-red-700 hover:border shadow-lg transform hover:scale-105 cursor-pointer"
            >
              Customize
            </button>
          </div>
        </div>
      );
    
}

export default ChooseLayout;