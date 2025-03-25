import { Plus } from "lucide-react";
import PropTypes from "prop-types";

function HeaderContent({ addCard, setIsModalOpen }) {
  return (
    <div className="flex border-b border-black w-full">
      <div className="w-[70%] text-center text-3xl font-bold p-10 border-r border-black flex items-center justify-between">
        <span className="w-full text-center text-btn-purple">Cards</span>
        <button onClick={addCard} className="text-btn-purple">
          <Plus
            size={40}
            className="bg-btn-purple p-1 rounded-full text-white hover:brightness-125 transition duration-200"
          />
        </button>
      </div>
      <div className="w-[30%] font-bold text-3xl px-10 flex items-center justify-between">
        <span className="w-full text-center text-btn-purple">Tarefas</span>
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-btn-purple"
        >
          <Plus
            size={40}
            className="bg-btn-purple p-1 rounded-full text-white hover:brightness-125 transition duration-200"
          />
        </button>
      </div>
    </div>
  );
}

HeaderContent.propTypes = {
  addCard: PropTypes.func.isRequired,
  setIsModalOpen: PropTypes.func.isRequired,
};

export default HeaderContent;
