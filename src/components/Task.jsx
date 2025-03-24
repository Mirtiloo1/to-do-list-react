import PropTypes from "prop-types";
import { ArrowLeft, CircleCheck, Circle } from "lucide-react";

const Task = ({ task, onCheck, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-modal p-8 rounded-2xl w-full max-w-2xl">
        <div className="flex justify-center relative p-4 mb-4">
          <button onClick={onClose} className="absolute left-0">
            <ArrowLeft size={40} className="text-btn-purple" />
          </button>
          <button onClick={onCheck} className="absolute right-0">
            {task.checked ? (
              <CircleCheck size={40} className="text-btn-purple" />
            ) : (
              <Circle size={40} className="text-btn-purple" />
            )}
          </button>
          <h1 className="text-3xl text-center px-12 font-bold text-btn-purple truncate max-w-90%">
            {task.title}
          </h1>
        </div>

        {task.description && (
          <p className="p-8 pb-6 pr-2 text-lg font-medium rounded-2xl bg-slate-100">
            {task.description}
          </p>
        )}
      </div>
    </div>
  );
};

Task.propTypes = {
  task: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    checked: PropTypes.bool.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onCheck: PropTypes.func.isRequired,
};

export default Task;
