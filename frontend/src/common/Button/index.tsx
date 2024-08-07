"use client";
import styles from "./index.module.css";
import { ArrowIcon } from "@/src/common/Utils/icons";
import { useTextEditorStore } from "@/src/store/translate.store";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

interface ITranslatorButton {
  animation: boolean;
  firstChild: ReactNode;
  secondChild: ReactNode;
  width?: string;
  className?: string;
  onClick?: (first: boolean) => void;
  secondBtnActive?: boolean;
}

export const TranslatorButton = ({
  animation,
  firstChild,
  secondChild,
  width = "401px",
  className,
  onClick,
  secondBtnActive,
}: ITranslatorButton) => {
  const [activeButton, setActiveButton] = useState<{
    first: boolean;
    second: boolean;
  }>({
    first: !animation,
    second: Boolean(secondBtnActive),
  });

  const { changed, setChanged, editorState } = useTextEditorStore();

  const { setConnected } = useTextEditorStore();

  const pathname = usePathname();

  const handleClick = (first: boolean) => {
    if (
      pathname === "/" &&
      !Boolean(editorState.getCurrentContent().getPlainText().trim())
    )
      return;

    setConnected(false);
    setActiveButton((prev) => ({
      first,
      second: !first,
    }));
    if (onClick) onClick(first);
  };

  useEffect(() => {
    if (pathname === "/" && changed) {
      setActiveButton({ first: false, second: false });
      setChanged(false);
    }
  }, [changed, pathname]);

  return (
    <div
      className={`${styles.translator__button__container} ${className}`}
      style={{ width }}
    >
      <div
        onClick={() => handleClick(true)}
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
        onClick={() => handleClick(false)}
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
export const KirilForTranslator = () => <span>Kirill</span>;
export const ArrowForTranslator = () => <span>{ArrowIcon}</span>;

interface IButton {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  [key: string]: any;
}

export const Button = ({
  children,
  className = "",
  onClick,
  ...rest
}: IButton) => {
  return (
    <button
      {...rest}
      onClick={onClick}
      className={`${styles.button} ${className}`}
    >
      {children}
    </button>
  );
};
