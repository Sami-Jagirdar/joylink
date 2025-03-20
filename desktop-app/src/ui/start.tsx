import { useNavigate } from 'react-router-dom';

function StartPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-blue-600 mb-2">JoyLink</h1>
        <p className="text-xl text-gray-600">Turn your mobile device into a game controller</p>
      </div>
      
      <button
        className="px-8 py-4 bg-blue-600 text-white text-xl font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition-colors duration-300 transform hover:scale-105"
        onClick={() => navigate('/connections')}
      >
        Start
      </button>
    </div>
  );
}

export default StartPage;