"use client";
import { ListUsers } from "@/src/components/Typing/Dashboard/ListUsers";
import styles from "./index.module.css";
import { Dashboard } from "@/src/components/Typing/Dashboard/Information";
import { TranslatorButton } from "@/src/common/Button";
import { useMemo, useState } from "react";

const TypingDashboard = () => {
  const [first, setFirst] = useState(true);

  let desktop = true;

  if (typeof window !== "undefined")
    desktop = useMemo(() => window.innerWidth > 1160, []);

  const handleCLick = (first: boolean) => {
    setFirst(first);
  };

  return (
    <div className={styles.dashboard__container}>
      <TranslatorButton
        animation={first && false}
        firstChild={<span>Tez yozish</span>}
        secondChild={<span>Reyting</span>}
        width="100%"
        className={styles.switch__button}
        onClick={handleCLick}
      />
      {(desktop || first) && <ListUsers />}
      {(desktop || !first) && <Dashboard />}
    </div>
  );
};

export default TypingDashboard;
