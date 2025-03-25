import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { PencilLine, Plus, ArrowLeft, Trash2 } from "lucide-react";
import TaskCreateCard from "./TaskCreateCard";
import useContentLogic from "../hooks/useContentLogic";
import { v4 as uuidv4 } from "uuid";

function Card({ onClose, label, onEditLabel, removeCard, card }) {
  const [newLabel, setNewLabel] = useState(label);
  const [inputValue, setInputValue] = useState("");
  const [tasksCard, setTasksCard] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const inputRef = useRef(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  useEffect(() => {
    if (label) {
      const storedTasks = JSON.parse(localStorage.getItem("tasks")) || {};
      setTasksCard(storedTasks[label] || []);
    }
  }, [label]);

  const updateLocalStorage = (updatedTasks) => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || {};
    storedTasks[label] = updatedTasks;
    localStorage.setItem("tasks", JSON.stringify(storedTasks));
  };

  const handleRemoveCard = () => {
    setIsConfirmModalOpen(true);
  };

  const confirmRemoveCard = () => {
    removeCard(card.id);
    onClose();
  };

  const cancelRemoveCard = () => {
    setIsConfirmModalOpen(false);
  };

  const removeTaskCard = (taskId) => {
    setTasksCard((prevTasks) => {
      const updatedTasks = prevTasks.filter((task) => task.id !== taskId);
      updateLocalStorage(updatedTasks);
      return updatedTasks;
    });
  };

  const addTaskCard = (taskName) => {
    if (!taskName.trim()) return;

    const newTask = {
      id: uuidv4(),
      title: taskName,
      checked: false,
      cardLabel: label,
    };
    setTasksCard((prevTasks) => {
      const updatedTasks = [...prevTasks, newTask];
      updateLocalStorage(updatedTasks);
      return updatedTasks;
    });
    setInputValue("");
  };

  const handleChange = (e) => {
    setNewLabel(e.target.value);
  };

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleClose = () => {
    if (newLabel !== label && newLabel.trim() !== "") {
      onEditLabel(label, newLabel, tasksCard);
    } else {
      updateLocalStorage(tasksCard);
    }
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setIsEditing(false);
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      addTaskCard(inputValue);
    }
  };

  const handleCheck = (taskId) => {
    setTasksCard((prevTasks) => {
      const updatedTasks = prevTasks.map((task) =>
        task.id === taskId ? { ...task, checked: !task.checked } : task
      );
      updateLocalStorage(updatedTasks);
      return updatedTasks;
    });
  };

  const getFilteredTasks = () => {
    switch (activeFilter) {
      case "recent":
        return [...tasksCard].slice(-5);
      case "pending":
        return tasksCard.filter((task) => !task.checked);
      case "completed":
        return tasksCard.filter((task) => task.checked);
      default:
        return tasksCard;
    }
  };

  const { setSelectedTask, handleTaskCardCheck } = useContentLogic();

  const filteredTasks = getFilteredTasks();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-modal p-8 rounded-2xl w-full max-w-2xl">
        <div className="flex justify-center relative p-4 mb-4">
          <button
            onClick={handleClose}
            className="text-btn-purple absolute left-0"
          >
            <ArrowLeft size={40} />
          </button>

          <div className="flex items-center gap-2">
            {!isEditing ? (
              <h1 className="text-3xl font-bold text-center text-btn-purple flex-1">
                {newLabel}
              </h1>
            ) : (
              <input
                type="text"
                value={newLabel}
                className="text-3xl font-bold text-center bg-transparent border-none outline-none text-btn-purple flex-1"
                maxLength={12}
                ref={inputRef}
                onBlur={handleBlur}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                autoFocus
              />
            )}
            <button
              onClick={handleClick}
              className="absolute right-32 bg-btn-purple h-10 w-10 flex items-center justify-center rounded-full transition-all duration-300 hover:shadow-[3px_6px_1px_rgba(169,126,194,0.6)] hover:scale-[1.01]"
            >
              <PencilLine className="text-white h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-12 pb-4">
          <div className="flex justify-center items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder="Digite o nome da tarefa"
              className="w-full h-12 rounded-full p-6 text-md font-medium text-btn-purple  relative -mr-10 z-0 focus:outline-none focus:outline-none focus:ring-2 focus:ring-btn-purple"
            />
            <button
              onClick={() => addTaskCard(inputValue)}
              className="text-btn-purple z-10"
            >
              <Plus
                size={46}
                className="bg-btn-purple p-2 rounded-full text-white hover:brightness-125"
              />
            </button>
          </div>

          {/* FILTRO */}
          <div className="flex gap-8 items-center justify-center pt-8 font-medium text-btn-purple/80">
            {["recent", "all", "pending", "completed"].map((filter) => (
              <button
                key={filter}
                className={`hover:text-btn-purple transition cursor-pointer ${
                  activeFilter === filter ? "text-btn-purple font-bold" : ""
                }`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter === "recent"
                  ? "Recentes"
                  : filter === "all"
                  ? "Todos"
                  : filter === "pending"
                  ? "Pendentes"
                  : "Completos"}
              </button>
            ))}
          </div>

          <TaskCreateCard
            tasksCard={filteredTasks}
            setSelectedTask={setSelectedTask}
            handleTaskCardCheck={handleTaskCardCheck}
            handleCheck={handleCheck}
            removeTaskCard={removeTaskCard}
          />
          <div className="flex justify-center items-center pt-8">
            <button
              onClick={handleRemoveCard}
              className="bg-btn-purple w-[30%] h-12 rounded-2xl text-white hover:brightness-125"
            >
              Excluir Card
            </button>
          </div>

          {isConfirmModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
              <div className="bg-white p-8 rounded-2xl w-full max-w-md text-center">
                <Trash2 size={64} className="text-btn-purple mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-4 text-btn-purple">
                  Tem certeza que deseja excluir este card?
                </h2>
                <p className="text-gray-600 mb-6">
                  Todos os dados relacionados a este card serão permanentemente
                  removidos.
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={cancelRemoveCard}
                    className="border-btn-purple text-btn-purple w-[40%] h-12 rounded-2xl hover:bg-check hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={confirmRemoveCard}
                    className="bg-btn-purple w-[40%] h-12 rounded-2xl text-white hover:brightness-125"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

Card.propTypes = {
  label: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onEditLabel: PropTypes.func.isRequired,
  removeCard: PropTypes.func.isRequired,
  card: PropTypes.object.isRequired,
};

export default Card;
