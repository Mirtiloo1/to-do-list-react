import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { X, Check } from "lucide-react";

function TaskCreateCard({
  tasksCard = [],
  setSelectedTask,
  removeTaskCard,
  handleCheck,
}) {
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

  const toggleTaskCheck = (e, index, taskId) => {
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

  if (!Array.isArray(tasksCard)) return null;

  return (
    <div className="mt-4">
      {tasksCard.length === 0 ? (
        <div className="text-center py-10 text-btn-purple/70">
          Nenhuma tarefa encontrada para este filtro
        </div>
      ) : (
        <ul className="w-[100%] max-h-[440px] overflow-y-auto flex flex-col gap-5 py-10 pl-1 pr-1 scrollbar-thin scrollbar-thumb-btn-purple scrollbar-track-purple/30">
          {tasksCard.map((task, index) => {
            const isChecked = checkedTasks[task.id] || task.checked || false;

            return (
              <li key={task.id}>
                <div
                  onClick={(e) => {
                    toggleTaskCheck(e, index, task.id);
                  }}
                  className="flex bg-slate-50 rounded-2xl pl-6 h-16 w-full transition-all duration-300 hover:shadow-[3px_6px_1px_rgba(169,126,194,0.6)] hover:scale-[1.01] cursor-pointer"
                >
                  <div className="flex justify-between items-center w-full">
                    <p
                      className={`text-text-purple font-bold text-lg ${
                        isChecked ? "line-through text-zinc-600" : ""
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTask(task);
                      }}
                    >
                      {task.title}
                    </p>
                    {isChecked ? (
                      <div className="flex h-full relative">
                        <button
                          className="bg-check w-16 pr-4 h-full rounded-2xl flex justify-center items-center relative -mr-6 z-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Check className="text-white" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const realIndex = tasksCard.findIndex(
                              (t) => t.id === task.id
                            );
                            if (realIndex !== -1) {
                              removeTaskCard(realIndex);
                            }
                          }}
                          className="text-white bg-btn-purple w-9 h-full rounded-2xl flex items-center justify-center z-10"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const realIndex = tasksCard.findIndex(
                            (t) => t.id === task.id
                          );
                          if (realIndex !== -1) {
                            removeTaskCard(realIndex);
                          }
                        }}
                        className="text-white bg-btn-purple w-9 h-full rounded-2xl flex items-center justify-center hover:bg-btn-purple/90 transition"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
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
