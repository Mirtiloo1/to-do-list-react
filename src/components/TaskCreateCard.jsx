import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { X, Check } from "lucide-react";

function TaskCreateCard({ tasksCard = [], setSelectedTask, removeTaskCard, handleCheck }) {
  const [checkedTasks, setCheckedTasks] = useState({});

  useEffect(() => {
    if (!Array.isArray(tasksCard)) return;

    const initialChecked = {};
    tasksCard.forEach((task) => {
      if (task.checked) {
        initialChecked[task.id] = true;
      }
    });
    setCheckedTasks(initialChecked);
  }, [tasksCard]);

  const toggleTaskCheck = (e, taskId) => {
    e.stopPropagation();

    setCheckedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));

    if (handleCheck) {
      const realIndex = tasksCard.findIndex((task) => task.id === taskId);
      if (realIndex !== -1) {
        handleCheck(realIndex);
      }
    }
  };

  if (!Array.isArray(tasksCard) || tasksCard.length === 0) {
    return <div className="text-center py-10 text-btn-purple/70">Nenhuma tarefa encontrada para este filtro</div>;
  }

  return (
    <div className="mt-4">
      <ul className="w-full max-h-[440px] overflow-y-auto flex flex-col gap-5 py-10 pl-1 pr-1 scrollbar-thin scrollbar-thumb-btn-purple scrollbar-track-purple/30">
        {tasksCard.map((task) => {
          const isChecked = checkedTasks[task.id] || task.checked || false;

          return (
            <li key={task.id}>
              <div
                onClick={(e) => toggleTaskCheck(e, task.id)}
                className="flex bg-slate-50 rounded-2xl pl-6 h-16 w-full transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer"
              >
                <div className="flex justify-between items-center w-full">
                  <p
                    className={`text-text-purple font-bold text-lg ${isChecked ? "line-through text-zinc-600" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTask(task);
                    }}
                  >
                    {task.title}
                  </p>

                  <div className="flex h-full relative">
                    <button
                      className={`w-16 h-full rounded-2xl flex justify-center items-center transition ${
                        isChecked ? "bg-check text-white" : "bg-btn-purple text-white hover:bg-btn-purple/90"
                      }`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {isChecked ? <Check /> : <X size={20} />}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const realIndex = tasksCard.findIndex((t) => t.id === task.id);
                        if (realIndex !== -1) {
                          removeTaskCard(realIndex);
                        }
                      }}
                      className="w-9 h-full bg-btn-purple text-white rounded-2xl flex items-center justify-center hover:bg-btn-purple/90 transition"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

TaskCreateCard.propTypes = {
  tasksCard: PropTypes.array.isRequired,
  setSelectedTask: PropTypes.func.isRequired,
  removeTaskCard: PropTypes.func.isRequired,
  handleCheck: PropTypes.func.isRequired,
};

export default TaskCreateCard;
