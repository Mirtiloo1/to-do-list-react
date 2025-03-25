import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export default function useContentLogic() {
  const [cards, setCards] = useState(() => {
    const savedCards = localStorage.getItem("cards");
    const savedCardOrder = localStorage.getItem("cardOrder");

    if (savedCards && savedCardOrder) {
      const cardsArray = JSON.parse(savedCards);
      const orderArray = JSON.parse(savedCardOrder);

      return orderArray
        .map((id) => cardsArray.find((card) => card.id === id))
        .filter(Boolean);
    }

    return savedCards ? JSON.parse(savedCards) : [];
  });

  const [tasksModal, setTasksModal] = useState(() => {
    const savedTasks = localStorage.getItem("tasksModal");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [tasksCard, setTasksCard] = useState(() => {
    const storedTasks = localStorage.getItem("tasks");
    return storedTasks ? JSON.parse(storedTasks) : {};
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openTask, setOpenTask] = useState(false);
  const [openCard, setOpenCard] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    localStorage.setItem("cards", JSON.stringify(cards));
    localStorage.setItem(
      "cardOrder",
      JSON.stringify(cards.map((card) => card.id))
    );
  }, [cards]);

  useEffect(() => {
    localStorage.setItem("tasksModal", JSON.stringify(tasksModal));
  }, [tasksModal]);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasksCard));
  }, [tasksCard]);

  const addCard = () => {
    const newCard = {
      id: uuidv4(),
      label: `Card ${cards.length + 1}`,
    };
    const updatedCards = [...cards, newCard];
    setCards(updatedCards);
  };

  const updateCardLabel = (oldLabel, newLabel, tasks = null) => {
    if (!newLabel.trim()) return;

    const existingCard = cards.find((card) => card.label === newLabel);

    if (existingCard && existingCard.label !== oldLabel) {
      alert("Já existe um card com este nome!");
      return;
    }

    const updatedCards = cards.map((card) =>
      card.label === oldLabel ? { ...card, label: newLabel } : card
    );
    setCards(updatedCards);

    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || {};

    if (storedTasks[oldLabel]) {
      storedTasks[newLabel] = tasks || [...storedTasks[oldLabel]];
      delete storedTasks[oldLabel];
    }

    localStorage.setItem("tasks", JSON.stringify(storedTasks));
  };

  const addTaskCard = (newTask, cardLabel) => {
    if (!cardLabel) return;

    const taskWithId = { ...newTask, id: uuidv4(), checked: false };

    setTasksCard((prev) => {
      const newTasksCard = { ...prev };
      if (!Array.isArray(newTasksCard[cardLabel])) {
        newTasksCard[cardLabel] = [];
      }
      newTasksCard[cardLabel] = [taskWithId, ...newTasksCard[cardLabel]];
      return newTasksCard;
    });
  };

  const removeTaskCard = (taskId, cardLabel) => {
    setTasksCard((prev) => {
      const newTasksCard = { ...prev };

      if (Array.isArray(newTasksCard[cardLabel])) {
        newTasksCard[cardLabel] = newTasksCard[cardLabel].filter(
          (task) => task.id !== taskId
        );
      }

      return newTasksCard;
    });
  };

  const updateCardOrder = (newOrder) => {
    setCards(newOrder);
  };

  const removeCard = (cardId) => {
    const cardToRemove = cards.find((card) => card.id === cardId);

    if (!cardToRemove) return;

    const updatedCards = cards.filter((card) => card.id !== cardId);
    setCards(updatedCards);

    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || {};
    delete storedTasks[cardToRemove.label];
    localStorage.setItem("tasks", JSON.stringify(storedTasks));
  };

  const addTask = (newTask) => {
    const isDuplicateTask = tasksModal.some(
      (task) => task.title === newTask.title
    );

    if (isDuplicateTask) {
      alert("Já existe uma tarefa com este nome!");
      return;
    }

    const taskWithId = {
      ...newTask,
      id: uuidv4(),
      checked: false,
    };
    setTasksModal([...tasksModal, taskWithId]);
  };

  const removeTask = (taskId) => {
    const updatedTasks = tasksModal.filter((task) => task.id !== taskId);
    setTasksModal(updatedTasks);
  };

  const handleCheck = (selectedTask) => {
    setTasksModal((prevTasks) =>
      prevTasks.map((task) =>
        task.id === selectedTask.id && task.title === selectedTask.title
          ? { ...task, checked: !task.checked }
          : task
      )
    );
  };

  const handleTaskCardCheck = (taskId, cardLabel, isChecked) => {
    setTasksCard((prev) => {
      const newTasksCard = { ...prev };

      if (Array.isArray(newTasksCard[cardLabel])) {
        newTasksCard[cardLabel] = newTasksCard[cardLabel].map((task) =>
          task.id === taskId ? { ...task, checked: isChecked } : task
        );
      }

      return newTasksCard;
    });
  };

  return {
    // Estados
    tasksModal,
    tasksCard,
    isModalOpen,
    openTask,
    openCard,
    selectedTask,
    cards,

    addTask,
    removeTask,
    handleCheck,
    addCard,
    updateCardLabel,
    addTaskCard,
    removeTaskCard,
    setTasksCard,
    setIsModalOpen,
    setOpenTask,
    setOpenCard,
    setSelectedTask,
    setCards,
    removeCard,
    updateCardOrder,
    handleTaskCardCheck,
  };
}
