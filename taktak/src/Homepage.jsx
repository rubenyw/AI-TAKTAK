import { useNavigate } from 'react-router-dom';

const Homepage = () => {
    const navigate = useNavigate();
    return (
        <div className="grid place-content-center gap-5 h-full w-full bg-black text-white">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={()=>navigate("/player")}>
                Multiplayer
            </button>
            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={()=>navigate("/bot")}>
             Vs Bot
            </button>
        </div>
    )
}

export default Homepage;