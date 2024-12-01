// utils/useHorizontalScroll.js
import { useRef } from "react";

export const useHorizontalScroll = () => {
  const scrollRef = useRef(null);
  const pos = useRef({
    left: 0,
    x: 0,
    isScrolling: false,
  });

  const onMouseDown = (e) => {
    pos.current.isScrolling = true;
    pos.current.left = scrollRef.current.scrollLeft;
    pos.current.x = e.clientX;
  };

  const onMouseLeave = () => {
    pos.current.isScrolling = false;
  };

  const onMouseUp = () => {
    pos.current.isScrolling = false;
  };

  const onMouseMove = (e) => {
    if (!pos.current.isScrolling) return;
    e.preventDefault();
    const dx = e.clientX - pos.current.x;
    scrollRef.current.scrollLeft = pos.current.left - dx;
  };

  return { scrollRef, onMouseDown, onMouseLeave, onMouseUp, onMouseMove };
};

export default useHorizontalScroll;
