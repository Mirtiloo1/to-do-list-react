import PropTypes from "prop-types";
import { useState, useCallback, useEffect, useRef } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { motion, AnimatePresence } from "framer-motion";

const globalStyles = `
  * { user-select: none; }
  .dnd-drag-preview { opacity: 1 !important; transform: scale(1.05); }
`;

const DraggableCard = ({ id, index, moveCard, card, setOpenCard }) => {
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: "CARD",
    item: { id, index },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  const [, drop] = useDrop({
    accept: "CARD",
    hover: (item, monitor) => {
      if (!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      const { top, bottom, left, right } = ref.current.getBoundingClientRect();
      const hoverMiddleY = (bottom - top) / 2;
      const hoverMiddleX = (right - left) / 2;
      const { x, y } = monitor.getClientOffset();

      if (
        (dragIndex < hoverIndex && y < hoverMiddleY) ||
        (dragIndex > hoverIndex && y > hoverMiddleY) ||
        (dragIndex < hoverIndex && x < hoverMiddleX) ||
        (dragIndex > hoverIndex && x > hoverMiddleX)
      ) {
        return;
      }

      moveCard(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isDragging ? { scale: 1.08, boxShadow: "0px 15px 30px rgba(169, 126, 194, 0.4)" } : { opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={`w-48 h-36 transition-transform duration-200 ${isDragging ? "z-50" : "z-10"}`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ cursor: "grabbing", scale: 1.05 }}
    >
      <button
        onClick={() => !isDragging && setOpenCard(card)}
        className="w-full h-full bg-white p-6 flex items-center justify-center text-center text-text-purple text-xl font-bold rounded-3xl transition-transform shadow-md hover:shadow-lg"
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
    return () => document.head.removeChild(styleElement);
  }, []);

  useEffect(() => setCards([...initialCards]), [initialCards]);

  const moveCard = useCallback((dragIndex, hoverIndex) => {
    setCards((prev) => {
      const newCards = [...prev];
      const [draggedCard] = newCards.splice(dragIndex, 1);
      newCards.splice(hoverIndex, 0, draggedCard);
      return newCards;
    });
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-[70%] max-h-[440px] overflow-y-auto p-16 flex flex-wrap gap-5">
        <AnimatePresence mode="sync">
          {cards.map((card, index) => (
            <DraggableCard key={card.id} id={card.id} index={index} moveCard={moveCard} card={card} setOpenCard={setOpenCard} />
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
