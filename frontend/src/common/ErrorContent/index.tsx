import styles from "@/src/components/Translator/index.module.css";
// import { Tooltip } from "react-tooltip";
import React from "react";
import nextId from "react-id-generator";

export const ErrorContent = ({ word, id }: { word: string; id: string }) => {
  return (
    <>
      <span className={id} data-tooltip-id={id} style={{ color: "red" }}>
        {word}
      </span>
    </>
  );
};

export const TooltipForErrorContent = ({ id }: { id: string }) => {
  return (
    <></>
    // <Tooltip
    //   isOpen={true}
    //   className={styles.tooltip}
    //   classNameArrow={styles.custom__arrow}
    //   id={id}
    //   place={"bottom"}
    // >
    //   <div className={""}>something</div>
    // </Tooltip>
  );
};
