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
    hover: (item) => {
      if (!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

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
      className={`w-full sm:w-52 h-44 transition-transform duration-200 ${isDragging ? "z-50" : "z-10"} pb-7`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ cursor: "grabbing", scale: 1.05 }}
    >
      <button
        onClick={() => !isDragging && setOpenCard(card)}
        className="w-48 h-full bg-white flex items-center justify-center text-center text-text-purple text-lg sm:text-xl font-bold rounded-3xl transition-all duration-300 hover:shadow-[3px_6px_1px_rgba(169,126,194,0.6)] hover:scale-[1.01]"
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

function CardContent({ setOpenCard, cards: initialCards, updateCardOrder }) {
  const [cards, setCards] = useState([...initialCards]);

  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.textContent = globalStyles;
    document.head.appendChild(styleElement);
    return () => document.head.removeChild(styleElement);
  }, []);

  useEffect(() => {
    setCards((prevCards) => {
      const hasChanged = JSON.stringify(prevCards) !== JSON.stringify(initialCards);
      return hasChanged ? [...initialCards] : prevCards;
    });
  }, [initialCards]);

  const moveCard = useCallback((dragIndex, hoverIndex) => {
    setCards((prev) => {
      const newCards = [...prev];
      const [draggedCard] = newCards.splice(dragIndex, 1);
      newCards.splice(hoverIndex, 0, draggedCard);
      updateCardOrder(newCards);
      return newCards;
    });
  }, [updateCardOrder]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-[70%] max-h-[479px] box-border scrollbar-thin scrollbar-thumb-btn-purple scrollbar-track-purple/30 overflow-y-auto flex border-r-[0.5px] py-14 pl-12 border-btn-purple">
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-4 gap-y-8 ls:grid-cols-5 w-full">
          <AnimatePresence mode="sync">
            {cards.map((card, index) => (
              <DraggableCard key={card.id} id={card.id} index={index} moveCard={moveCard} card={card} setOpenCard={setOpenCard} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </DndProvider>
  );
}

CardContent.propTypes = {
  setOpenCard: PropTypes.func.isRequired,
  cards: PropTypes.array.isRequired,
  updateCardOrder: PropTypes.func.isRequired,
};

export default CardContent;
