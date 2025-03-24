import PropTypes from "prop-types";
import { useState, useCallback, useEffect, useRef } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { motion, AnimatePresence } from "framer-motion";

const globalStyles = `
  /* Estilos globais para melhorar a aparência durante arrasto */
  * {
    user-select: none;
  }
  .dnd-drag-preview {
    opacity: 1 !important;
    transform: scale(1.05);
  }
`;

const DraggableCard = ({ id, index, moveCard, card, setOpenCard }) => {
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: "CARD",
    item: () => ({ id, index }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "CARD",
    hover: (item, monitor) => {
      if (!ref.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const hoverMiddleX =
        (hoverBoundingRect.right - hoverBoundingRect.left) / 2;

      const clientOffset = monitor.getClientOffset();

      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      const hoverClientX = clientOffset.x - hoverBoundingRect.left;

      const isMovingDown =
        dragIndex < hoverIndex && hoverClientY < hoverMiddleY;
      const isMovingUp = dragIndex > hoverIndex && hoverClientY > hoverMiddleY;
      const isMovingRight =
        dragIndex < hoverIndex && hoverClientX < hoverMiddleX;
      const isMovingLeft =
        dragIndex > hoverIndex && hoverClientX > hoverMiddleX;

      if (isMovingDown || isMovingUp || isMovingRight || isMovingLeft) {
        return;
      }

      moveCard(dragIndex, hoverIndex);

      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  const cardVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
    dragging: {
      scale: 1.08,
      boxShadow: "0px 15px 30px rgba(169, 126, 194, 0.4)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.2,
      },
    },
  };

  const cardContainerStyle = {
    opacity: isDragging ? 1 : 1,
    cursor: "grab",
    pointerEvents: isDragging ? "none" : "auto",
  };

  return (
    <motion.div
      ref={ref}
      layout
      initial="hidden"
      animate={isDragging ? "dragging" : "visible"}
      exit="exit"
      variants={cardVariants}
      className={`w-48 h-36 ${isDragging ? "z-50" : "z-10"}`}
      style={cardContainerStyle}
      whileHover={{ scale: 1.03 }}
      whileTap={{ cursor: "grabbing", scale: 1.05 }}
    >
      <button
        onClick={() => !isDragging && setOpenCard(card)}
        className={`w-full h-full bg-white p-6 flex items-center justify-center text-center text-text-purple text-xl font-bold rounded-3xl transition-transform duration-200 ${
          isDragging
            ? "shadow-[8px_8px_20px_rgba(169,126,194,0.7)]"
            : "hover:shadow-[6px_6px_1px_rgba(169,126,194,0.6)]"
        }`}
      >
        {card.label}
      </button>
    </motion.div>
  );
};

DraggableCard.propTypes = {
  id: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  moveCard: PropTypes.func.isRequired,
  card: PropTypes.object.isRequired,
  setOpenCard: PropTypes.func.isRequired,
};

function CardContent({ setOpenCard, cards: initialCards }) {
  const [cards, setCards] = useState([...initialCards]);

  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.textContent = globalStyles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  useEffect(() => {
    setCards([...initialCards]);
  }, [initialCards]);

  const moveCard = useCallback((dragIndex, hoverIndex) => {
    setCards((prevCards) => {
      const newCards = [...prevCards];
      const draggedCard = newCards[dragIndex];

      newCards.splice(dragIndex, 1);
      newCards.splice(hoverIndex, 0, draggedCard);

      return newCards;
    });
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-[70%] max-h-[440px] overflow-y-auto border-r border-black p-16 flex flex-wrap gap-x-10 gap-y-7 scrollbar-thin scrollbar-thumb-btn-purple scrollbar-track-purple/30">
        <AnimatePresence mode="sync">
          {cards.map((card, index) => (
            <DraggableCard
              key={card.id}
              id={card.id}
              index={index}
              moveCard={moveCard}
              card={card}
              setOpenCard={setOpenCard}
            />
          ))}
        </AnimatePresence>
      </div>
    </DndProvider>
  );
}

CardContent.propTypes = {
  setOpenCard: PropTypes.func.isRequired,
  cards: PropTypes.array.isRequired,
};

export default CardContent;
