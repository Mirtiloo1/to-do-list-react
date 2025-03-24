import { useState } from "react";
import PropTypes from "prop-types";
import { ArrowLeft } from "lucide-react";

function TaskModal({ onClose, onAdd }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleAdd = () => {
    if (title.trim() === "") return;
    onAdd({ title, description });
    setTitle("");
    setDescription("");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-modal p-6 rounded-2xl w-full max-w-xl px-12">
        <div className="flex justify-center relative p-4 mb-4">
          <button onClick={onClose} className="absolute left-0">
            <ArrowLeft size={40} className="text-btn-purple" />
          </button>
          <h1 className="text-3xl text-center px-12 font-bold text-btn-purple">
            Criar Tarefa
          </h1>
        </div>

        <input
          type="text"
          placeholder="Título da tarefa"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full  border border-gray-300 rounded-full h-12 p-6 mb-3 focus:outline-none focus:ring-2 focus:ring-btn-purple"
        />
        <textarea
          placeholder="Descrição da tarefa (opcional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-300 rounded-2xl h-64 mt-4 p-6 mb-4 focus:outline-none focus:ring-2 focus:ring-btn-purple scrollbar-thin scrollbar-thumb-btn-purple  scrollbar-track-purple/30"
        />

        <div className="flex justify-center pb-4">
          <button
            onClick={handleAdd}
            className="w-56 bg-btn-purple text-white p-3 rounded-2xl font-medium transition-shadow duration-300 hover:shadow-[6px_6px_1px_rgba(169,126,194,0.6)]"
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}

TaskModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
};

export default TaskModal;
