import { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { X, Check } from "lucide-react";

function TaskCreateCard({
  tasksCard = [],
  setSelectedTask,
  removeTaskCard,
  handleTaskCardCheck,
  handleCheck,
}) {
  const [checkedTasks, setCheckedTasks] = useState(() => {
    const savedCheckedTasks = localStorage.getItem("checkedTasks");
    return savedCheckedTasks ? JSON.parse(savedCheckedTasks) : {};
  });

  const initialCheckedTasks = useMemo(() => {
    if (!Array.isArray(tasksCard)) return {};

    const initialChecked = {};
    tasksCard.forEach((task) => {
      if (task.checked) {
        initialChecked[task.id] = true;
      }
    });

    return initialChecked;
  }, [tasksCard]);

  useEffect(() => {
    localStorage.setItem("checkedTasks", JSON.stringify(checkedTasks));
  }, [checkedTasks]);

  useEffect(() => {
    localStorage.setItem("checkedTasks", JSON.stringify(initialCheckedTasks));
    setCheckedTasks(initialCheckedTasks);
  }, [initialCheckedTasks]);

  if (!Array.isArray(tasksCard) || tasksCard.length === 0) {
    return (
      <div className="text-center py-10 text-btn-purple/70">
        Nenhuma tarefa encontrada para este filtro
      </div>
    );
  }

  const handleCheckClick = (task) => {
    if (handleCheck) {
      handleCheck(task.id);
    }

    const newCheckedState = !checkedTasks[task.id];

    const updatedCheckedTasks = {
      ...checkedTasks,
      [task.id]: newCheckedState,
    };

    setCheckedTasks(updatedCheckedTasks);

    handleTaskCardCheck(task.id, task.cardLabel, newCheckedState);
  };

  return (
    <div className="mt-4">
      <ul className="w-full max-h-[440px] overflow-y-auto flex flex-col gap-5 py-10 pl-1 pr-1 scrollbar-thin scrollbar-thumb-btn-purple scrollbar-track-purple/30">
        {tasksCard.map((task) => {
          const isChecked = task.checked;

          return (
            <li key={task.id}>
              <div
                className="flex bg-slate-50 rounded-2xl pl-6 h-16 w-full transition-all duration-300 hover:shadow-lg hover:scale-[1.01] cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedTask(task);
                  handleCheckClick(task);
                }}
              >
                <div className="flex justify-between items-center w-full">
                  <p
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className={`text-text-purple font-bold text-lg cursor-pointer ${
                      isChecked ? "line-through text-zinc-600" : ""
                    }`}
                  >
                    {task.title}
                  </p>

                  {isChecked ? (
                    <div className="flex h-full relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCheckClick(task);
                        }}
                        className="bg-check w-16 pr-4 h-full rounded-2xl flex justify-center items-center relative -mr-6 z-0"
                      >
                        <Check className="text-white" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeTaskCard(task.id);
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
                        removeTaskCard(task.id);
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
    </div>
  );
}

TaskCreateCard.propTypes = {
  tasksCard: PropTypes.array.isRequired,
  setSelectedTask: PropTypes.func.isRequired,
  removeTaskCard: PropTypes.func.isRequired,
  handleTaskCardCheck: PropTypes.func.isRequired,
  handleCheck: PropTypes.func,
};

export default TaskCreateCard;
