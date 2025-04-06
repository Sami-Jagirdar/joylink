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

    const [selectedLayout, setSelectedLayout] = useState<string>("");
    const [layouts, setLayouts] = useState<string[]>([]);

    useEffect(() => {
        const fetchLayout = async () => {
            const layouts = await window.electron.getLayouts();
            if (layouts) {
                setLayouts(layouts);
            } else {
                setLayouts([]);
            }
        };
        fetchLayout();
    }, []);

    const handleLayoutChange = (layout: string) => {
        setSelectedLayout(layout);
        window.electron.setLayout(layout);
    };


    return (
        <div className="min-h-screen bg-neutral-900 text-white p-4">
          <h1 className="text-2xl font-bold mb-4">Choose Your Layout</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {layouts.map((layout) => (
              <div
                key={layout}
                onClick={() => handleLayoutChange(layout)}
                className={`cursor-pointer border rounded-lg p-4 flex flex-col items-center justify-center hover:shadow-lg transition-all
                  ${selectedLayout === layout ? "ring-4 ring-red-500" : "ring-0"}`}
              >
                {layoutPreviews[layout] ? (
                  <img src={layoutPreviews[layout]} alt={layout} className="w-full h-auto object-contain" />
                ) : (
                  <span className="text-lg font-medium">{layout}</span>
                )}
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-end">
            <button
              onClick={() => navigate('/customize')}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Customize
            </button>
          </div>
        </div>
      );
    
}

export default ChooseLayout;