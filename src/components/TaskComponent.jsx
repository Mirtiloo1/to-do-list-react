import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { X, Check } from "lucide-react";

function TaskComponent({
  tasksModal,
  setOpenTask,
  setSelectedTask,
  removeTask,
}) {
  const [localTasks, setLocalTasks] = useState(tasksModal);

  useEffect(() => {
    setLocalTasks(tasksModal);
  }, [tasksModal]);

  const handleTaskCheck = (taskId) => {
    const updatedTasks = localTasks.map((task) => 
      task.id === taskId ? { ...task, checked: !task.checked } : task
    );
    setLocalTasks(updatedTasks);
  };

  const handleRemoveTask = (taskId) => {
    const updatedTasks = localTasks.filter(task => task.id !== taskId);
    setLocalTasks(updatedTasks);
    removeTask(taskId); // Garante que a remoção acontece corretamente
  };

  return (
    <ul className="w-[28%] max-h-[440px] overflow-y-auto flex flex-col gap-5 py-10 pl-14 pr-6 scrollbar-thin scrollbar-thumb-btn-purple scrollbar-track-purple/30">
      {localTasks.map((task) => (
        <li key={task.id}>
          <div
            onClick={() => {
              setSelectedTask(task);
              setOpenTask(true);
            }}
            className="flex bg-slate-50 rounded-2xl pl-6 h-16 w-full transition-all duration-300 hover:shadow-[3px_6px_1px_rgba(169,126,194,0.6)] hover:scale-[1.01]"
          >
            <div className="flex justify-between items-center w-full">
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  handleTaskCheck(task.id);
                }}
                className={`text-text-purple font-bold text-lg cursor-pointer ${
                  task.checked ? "line-through text-zinc-600" : ""
                }`}
              >
                {task.title}
              </div>
              {task.checked ? (
                <div className="flex h-full relative">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTaskCheck(task.id);
                    }}
                    className="bg-check w-16 pr-4 h-full rounded-2xl flex justify-center items-center relative -mr-6 z-0"
                  >
                    <Check className="text-white" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveTask(task.id);
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
                    handleRemoveTask(task.id);
                  }}
                  className="text-white bg-btn-purple w-9 h-full rounded-2xl flex items-center justify-center hover:bg-btn-purple/90 transition"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

TaskComponent.propTypes = {
  tasksModal: PropTypes.array.isRequired,
  setOpenTask: PropTypes.func.isRequired,
  setSelectedTask: PropTypes.func.isRequired,
  removeTask: PropTypes.func.isRequired,
};

export default TaskComponent;
