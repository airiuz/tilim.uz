import React, { useState, ReactNode } from "react";
import "./index.css";
interface TooltipProps {
  content: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  children: ReactNode;
  open: boolean;
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  position = "top",
  children,
  open,
  className,
}) => {
  const getPositionStyle = () => {
    switch (position) {
      case "top":
        return { bottom: "130%", left: "50%", transform: "translateX(-50%)" };
      case "bottom":
        return { top: "130%", left: "50%", transform: "translateX(-50%)" };
      case "left":
        return { top: "50%", right: "130%", transform: "translateY(-50%)" };
      case "right":
        return { top: "50%", left: "130%", transform: "translateY(-50%)" };
      default:
        return {};
    }
  };

  return (
    <div className="tooltip-container">
      {children}
      {open && (
        <div
          className={`tooltip ${position} ${className}`}
          style={getPositionStyle()}
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
