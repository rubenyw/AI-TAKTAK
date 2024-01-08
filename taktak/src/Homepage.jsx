import { useState } from 'react';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';

const Homepage = () => {
    const navigate = useNavigate();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [strings, setStrings] = useState(['String 1', 'String 2', 'String 3']);

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    return (
        <div className="grid place-content-center gap-5 h-full w-full bg-black text-white">
            
<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={()=>navigate("/player")}>
                Multiplayer
            </button>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={()=>navigate("/player6")}>
                Multiplayer 6 x 6
            </button>
            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={()=>navigate("/bot")}>
                Vs Bot
            </button>
            
            {/* ... */}
            <button className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded" onClick={openModal}>
                Open Modal
            </button>
            <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-md shadow-lg">
                <h2 className="text-xl font-bold mb-4">Strings in Modal</h2>
                <ul className="list-disc ml-6">
                    {strings.map((str, index) => (
                        <li key={index}>{str}</li>
                    ))}
                </ul>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4" onClick={closeModal}>
                    Close Modal
                </button>
            </Modal>
        </div>
    );
};

export default Homepage;
