import { useNavigate } from 'react-router-dom';
import icon from '../../assets/icon.png';

function StartPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen min-w-screen flex flex-col items-center justify-center">
      <img
          src={icon}
          alt="JoyLink Logo"
          className="w-32 h-32 mb-4"
        />
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-red-600 mb-2">JoyLink</h1>
        <p className="text-xl text-zinc-400">Turn your mobile device into a game controller</p>
      </div>
      
      <button
        className="px-8 py-4 bg-neutral-900 text-white text-xl font-semibold rounded-lg hover:border-red-700 hover:border shadow-lg transform hover:scale-105 cursor-pointer"
        onClick={() => navigate('/choose-layout')}
      >
        Start
      </button>
    </div>
  );
}

export default StartPage;