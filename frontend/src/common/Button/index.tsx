"use client";
import styles from "./index.module.css";
import { ArrowIcon } from "@/src/common/Utils/icons";
import { ReactNode, useState } from "react";

interface ITranslatorButton {
  animation: boolean;
  firstChild: ReactNode;
  secondChild: ReactNode;
  width?: string;
  className?: string;
}

export const TranslatorButton = ({
  animation,
  firstChild,
  secondChild,
  width = "401px",
  className,
}: ITranslatorButton) => {
  const [activeButton, setActiveButton] = useState<{
    first: boolean;
    second: boolean;
  }>({
    first: !animation,
    second: false,
  });
  return (
    <div
      className={`${styles.translator__button__container} ${className}`}
      style={{ width }}
    >
      <div
        className={`${
          !(activeButton.first || activeButton.second)
            ? styles.animation
            : activeButton.first
            ? styles.active
            : ""
        }`}
      >
        {firstChild}
      </div>
      <div
        className={`${
          !(activeButton.first || activeButton.second)
            ? styles.animation
            : activeButton.second
            ? styles.active
            : ""
        }`}
      >
        {secondChild}
      </div>
    </div>
  );
};

export const LotinForTranslator = () => <span>Lotin</span>;
export const KirilForTranslator = () => <span>Kiril</span>;
export const ArrowForTranslator = () => <span>{ArrowIcon}</span>;

interface IButton {
  children: ReactNode;
  className?: string;
}

export const Button = ({ children, className = "" }: IButton) => {
  return (
    <button className={`${styles.button} ${className}`}>{children}</button>
  );
};
