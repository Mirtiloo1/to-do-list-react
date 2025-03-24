import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export default function useContentLogic() {
  /** ====================== ESTADOS ====================== **/
  
  // Estado dos cards
  const [cards, setCards] = useState(() => {
    const savedCards = localStorage.getItem("cards");
    return savedCards ? JSON.parse(savedCards) : [];
  });

  // Estado das tarefas dentro do modal
  const [tasksModal, setTasksModal] = useState(() => {
    const savedTasks = localStorage.getItem("tasksModal");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  // Estado para armazenar as tarefas dos cards
  const [tasksCard, setTasksCard] = useState(() => {
    const storedTasks = localStorage.getItem("tasks");
    return storedTasks ? JSON.parse(storedTasks) : {};
  });

  // Estado do modal principal e do modal de tarefas
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openTask, setOpenTask] = useState(false);
  const [openCard, setOpenCard] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  /** ====================== EFEITOS ====================== **/

  // Salvar cards no localStorage sempre que houver mudanças
  useEffect(() => {
    localStorage.setItem("cards", JSON.stringify(cards));
  }, [cards]);

  // Salvar as tarefas no localStorage sempre que `tasksModal` mudar
  useEffect(() => {
    localStorage.setItem("tasksModal", JSON.stringify(tasksModal));
  }, [tasksModal]);

  // Salvar as tarefas dos cards no localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasksCard));
  }, [tasksCard]);

  /** ====================== FUNÇÕES ====================== **/

  // Adicionar um novo card
  const addCard = () => {
    const newCard = {
      id: uuidv4(),
      label: `Card ${cards.length + 1}`,
    };
    setCards([...cards, newCard]);
  };

  // Atualizar o label de um card
  const updateCardLabel = (oldLabel, newLabel, tasks = null) => {
    if (!newLabel.trim()) return; // Evita nomes vazios
  
    // Atualiza os cards no estado usando o label para identificação
    const updatedCards = cards.map((card) =>
      card.label === oldLabel ? { ...card, label: newLabel } : card
    );
    setCards(updatedCards);
  
    // Atualiza as tarefas no localStorage
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || {};
    
    // Transfere as tarefas do card antigo para o novo label
    if (storedTasks[oldLabel]) {
      // Se recebemos tasks como parâmetro, usa esses
      storedTasks[newLabel] = tasks || storedTasks[oldLabel];
      delete storedTasks[oldLabel];
    }
    
    // Salva no localStorage
    localStorage.setItem("tasks", JSON.stringify(storedTasks));
  };

  // Adicionar uma nova tarefa ao card
  const addTaskCard = (newTask, cardLabel) => {
    if (!cardLabel) return;
    
    const taskWithId = { ...newTask, id: uuidv4(), checked: false };
    
    setTasksCard(prev => {
      const newTasksCard = { ...prev };
      if (!Array.isArray(newTasksCard[cardLabel])) {
        newTasksCard[cardLabel] = [];
      }
      newTasksCard[cardLabel] = [taskWithId, ...newTasksCard[cardLabel]];
      return newTasksCard;
    });
  };

  // Remover uma tarefa de um card
  const removeTaskCard = (index, cardLabel) => {
    if (!cardLabel) return;
    
    setTasksCard(prev => {
      const newTasksCard = { ...prev };
      if (Array.isArray(newTasksCard[cardLabel])) {
        newTasksCard[cardLabel] = newTasksCard[cardLabel].filter((_, i) => i !== index);
      }
      return newTasksCard;
    });
  };

  // Em useContentLogic.js
  const removeCard = (cardId) => {
    // Encontrar o card pelo ID
    const cardToRemove = cards.find(card => card.id === cardId);
    
    if (!cardToRemove) return;

    // Remover o card dos cards salvos
    const updatedCards = cards.filter(card => card.id !== cardId);
    setCards(updatedCards);

    // Remover as tarefas associadas a este card no localStorage
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || {};
    delete storedTasks[cardToRemove.label];
    localStorage.setItem("tasks", JSON.stringify(storedTasks));
  };

  // Adicionar uma nova tarefa ao modal principal
  const addTask = (newTask) => {
    const taskWithId = { ...newTask, id: uuidv4() };
    setTasksModal([...tasksModal, taskWithId]);
  };

  // Remover uma tarefa pelo índice
  const removeTask = (index) => {
    const updatedTasks = tasksModal.filter((_, i) => i !== index);
    setTasksModal(updatedTasks);
  };

  // Alternar estado de `checked` de uma tarefa
  const handleCheck = (index) => {
    setTasksModal((prevTasks) =>
      prevTasks.map((task, i) =>
        i === index ? { ...task, checked: !task.checked } : task
      )
    );
  };

  /** ====================== RETORNO ====================== **/

  return {
    // Estados
    tasksModal,
    tasksCard,
    isModalOpen,
    openTask,
    openCard,
    selectedTask,
    cards,

    // Funções 
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
  };
}