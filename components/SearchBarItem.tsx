"use client";
import { ReactNode, RefObject, useEffect, useRef, useState } from "react";
import SearchBarTrigger from "./SearchBarTrigger";
import SearchBarContent from "./SearchBarContent";
import React from "react";
import FormLengthBar from "./FormLengthBar";

interface Props {
  children: ReactNode;
  isInput: boolean;
  prevPos: number;
  smallBarClicked: boolean;
  index: number;
  safeAreaRef?: RefObject<HTMLDivElement | null>;
}

const SearchBarItem = ({
  children,
  isInput,
  prevPos,
  smallBarClicked,
  index,
  safeAreaRef,
}: Props) => {
  const trigger = React.Children.toArray(children).filter(
    (child) =>
      React.isValidElement(child) &&
      (child.type === SearchBarTrigger || child.type === FormLengthBar)
  );
  const content = React.Children.toArray(children).find(
    (child) => React.isValidElement(child) && child.type === SearchBarContent
  );

  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState(0);

  const triggerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (smallBarClicked && index === prevPos) {
      setVisible(true);
    }
  }, [smallBarClicked, index, prevPos]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        contentRef.current?.contains(target) ||
        safeAreaRef?.current?.contains(target)
      ) {
        return;
      }
      setVisible(false);
    };
    if (!visible) {
      document.addEventListener("mousedown", handleClickOutside);
    }
  }, [safeAreaRef, visible]);

  return (
    <>
      <div
        ref={triggerRef}
        onClick={(e) => {
          e.stopPropagation();
          if (isInput) {
            setVisible(true);
          } else {
            if (pos === prevPos) {
              setVisible((prev) => !prev);
            } else {
              setVisible(true);
            }
            setPos(prevPos);
          }
        }}
        className="flex flex-row w-full h-full rounded-full"
      >
        {trigger.map((t) => t)}
      </div>
      {visible && <div ref={contentRef}>{content}</div>}
    </>
  );
};

export default SearchBarItem;
