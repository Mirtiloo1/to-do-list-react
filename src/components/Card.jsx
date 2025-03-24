import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { PencilLine, Plus, ArrowLeft } from "lucide-react";
import TaskCreateCard from "./TaskCreateCard";
import useContentLogic from "../hooks/useContentLogic";
import { v4 as uuidv4 } from "uuid";

function Card({ onClose, label, onEditLabel }) {
  const [newLabel, setNewLabel] = useState(label);
  const [inputValue, setInputValue] = useState("");
  const [tasksCard, setTasksCard] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const inputRef = useRef(null);

  useEffect(() => {
    if (label) {
      const storedTasks = JSON.parse(localStorage.getItem("tasks")) || {};

      if (Array.isArray(storedTasks[label])) {
        setTasksCard(storedTasks[label]);
      } else {
        setTasksCard([]);
      }
    }
  }, [label]);

  const removeTaskCard = (index) => {
    setTasksCard((prevTasks) => {
      const updatedTasks = [...prevTasks];
      updatedTasks.splice(index, 1);

      const storedTasks = JSON.parse(localStorage.getItem("tasks")) || {};
      storedTasks[label] = updatedTasks;
      localStorage.setItem("tasks", JSON.stringify(storedTasks));

      return updatedTasks;
    });
  };

  const addTaskCard = (newTask) => {
    if (!newTask.title || newTask.title.trim() === "") return;

    const taskWithId = { ...newTask, id: uuidv4(), checked: false };
    const updatedTasks = [taskWithId, ...tasksCard];
    setTasksCard(updatedTasks);
    setInputValue("");

    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || {};
    storedTasks[label] = updatedTasks;
    localStorage.setItem("tasks", JSON.stringify(storedTasks));
  };

  const handleChange = (e) => {
    setNewLabel(e.target.value);
  };

  const handleFocus = () => {
    setInputValue("");
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
      const storedTasks = JSON.parse(localStorage.getItem("tasks")) || {};
      storedTasks[label] = tasksCard;
      localStorage.setItem("tasks", JSON.stringify(storedTasks));
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
      addTaskCard({ title: inputValue });
    }
  };

  const handleCheck = (index) => {
    const updatedTasks = [...tasksCard];
    updatedTasks[index] = {
      ...updatedTasks[index],
      checked: !updatedTasks[index].checked,
    };
    setTasksCard(updatedTasks);

    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || {};
    storedTasks[label] = updatedTasks;
    localStorage.setItem("tasks", JSON.stringify(storedTasks));
  };

  const getFilteredTasks = () => {
    switch (activeFilter) {
      case "recent":
        return [...tasksCard].slice(0, 5);
      case "pending":
        return tasksCard.filter((task) => !task.checked);
      case "completed":
        return tasksCard.filter((task) => task.checked);
      case "all":
      default:
        return tasksCard;
    }
  };

  const { setSelectedTask } = useContentLogic();

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
              className="flex-shrink-0 absolute right-32 bg-btn-purple h-10 w-10 flex items-center justify-center rounded-full transition-all duration-200 hover:shadow-[3px_6px_1px_rgba(169,126,194,0.6)] hover:scale-[1.01]"
            >
              <PencilLine className="text-white h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-12">
          <div className="flex justify-center items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={handleFocus}
              onKeyDown={handleInputKeyDown}
              placeholder="Digite o nome da tarefa"
              className="w-full h-12 rounded-full p-6 text-md font-medium text-btn-purple -mr-10 "
            />
            <button
              className="text-btn-purple"
              onClick={() =>
                inputValue.trim() && addTaskCard({ title: inputValue })
              }
            >
              <Plus
                size={46}
                className="bg-btn-purple p-2 rounded-full text-white hover:bg-btn-purple/90 transition duration-200 z-10"
              />
            </button>
          </div>

          {/* FILTRO com interatividade */}
          <div className="flex justify-between pt-8 pl-14 pr-14 font-medium text-btn-purple/80">
            <button
              className={`hover:text-btn-purple hover:font-bold transition duration-75 cursor-pointer ${
                activeFilter === "recent" ? "text-btn-purple font-bold" : ""
              }`}
              onClick={() => setActiveFilter("recent")}
            >
              Recentes
            </button>
            <button
              className={`hover:text-btn-purple hover:font-bold transition duration-75 cursor-pointer ${
                activeFilter === "all" ? "text-btn-purple font-bold" : ""
              }`}
              onClick={() => setActiveFilter("all")}
            >
              Todos
            </button>
            <button
              className={`hover:text-btn-purple hover:font-bold transition duration-75 cursor-pointer ${
                activeFilter === "pending" ? "text-btn-purple font-bold" : ""
              }`}
              onClick={() => setActiveFilter("pending")}
            >
              Pendentes
            </button>
            <button
              className={`hover:text-btn-purple hover:font-bold transition duration-75 cursor-pointer ${
                activeFilter === "completed" ? "text-btn-purple font-bold" : ""
              }`}
              onClick={() => setActiveFilter("completed")}
            >
              Completos
            </button>
          </div>
          <div>
            <TaskCreateCard
              tasksCard={filteredTasks}
              setSelectedTask={setSelectedTask}
              removeTaskCard={removeTaskCard}
              handleCheck={handleCheck}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

Card.propTypes = {
  label: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onEditLabel: PropTypes.func.isRequired,
};

export default Card;
