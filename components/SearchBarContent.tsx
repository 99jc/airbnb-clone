import React, { ReactNode } from "react";

const SearchBarContent = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return <div className={className}>{children}</div>;
};

export default SearchBarContent;
