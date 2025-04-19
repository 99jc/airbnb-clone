import React, { ReactNode } from "react";

const SearchBarTrigger = ({
  children,
  className,
  onMouseDown,
  onMouseEnter,
  onMouseLeave,
}: {
  children: ReactNode;
  className?: string;
  onMouseDown?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) => {
  return (
    <div
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={className}
    >
      {children}
    </div>
  );
};

export default SearchBarTrigger;
