import { useEffect } from "react";
import useContentLogic from "../hooks/useContentLogic";

import TaskModal from "./TaskModal";
import Task from "./Task";
import Card from "./Card";
import HeaderContent from "./HeaderContent";
import TaskComponent from "./TaskComponent";
import CardContent from "./CardContent";

function Content() {
  const {
    isModalOpen,
    openTask,
    openCard,
    selectedTask,
    cards,
    handleCheck,
    updateCardLabel,
    setIsModalOpen,
    setOpenTask,
    setOpenCard,
    setSelectedTask,
    removeTask,
    addCard,
    tasksModal,
    addTask,
    removeCard,
  } = useContentLogic();

  useEffect(() => {
    if (selectedTask) {
      const updatedTask = tasksModal.find(
        (t) => t.title === selectedTask.title
      );
      if (updatedTask) {
        setSelectedTask(updatedTask);
      }
    }
  }, [tasksModal, selectedTask, setSelectedTask]);

  return (
    <div className="bg-purple w-full h-[600px] rounded-3xl flex flex-col">
      <HeaderContent addCard={addCard} setIsModalOpen={setIsModalOpen} />

      <div className="flex flex-grow w-full">
        <CardContent cards={cards} setOpenCard={setOpenCard} />

        <TaskComponent
          tasksModal={tasksModal}
          setOpenTask={setOpenTask}
          setSelectedTask={setSelectedTask}
          removeTask={removeTask}
        />
      </div>

      {isModalOpen && (
        <TaskModal onClose={() => setIsModalOpen(false)} onAdd={addTask} />
      )}

      {openTask && selectedTask && (
        <Task
          task={{ ...selectedTask, checked: selectedTask.checked ?? false }}
          onClose={() => setOpenTask(false)}
          onCheck={() => handleCheck(tasksModal.indexOf(selectedTask))}
        />
      )}

      {openCard && (
        <Card
        onClose={() => setOpenCard(null)}
        label={typeof openCard === "object" ? openCard.label : openCard}
        card={typeof openCard === "object" ? openCard : cards.find(c => c.label === openCard)}
        onEditLabel={updateCardLabel}
        removeCard={removeCard}
      />
      )}
    </div>
  );
}

export default Content;
