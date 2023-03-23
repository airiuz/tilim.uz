import { ListUsers } from "@/src/components/Typing/Dashboard/ListUsers";
import styles from "./index.module.css";
import { Dashboard } from "@/src/components/Typing/Dashboard/Information";
import { TranslatorButton } from "@/src/common/Button";
import { useMemo, useState } from "react";

export const TypingDashboard = () => {
  const [first, setFirst] = useState(false);

  const desktop = useMemo(
    () => typeof window !== undefined && window.innerWidth > 1160,
    []
  );

  return (
    <div className={styles.dashboard__container}>
      <TranslatorButton
        animation={false}
        firstChild={<>Tez yozish</>}
        secondChild={<>Reyting</>}
        width="100%"
        className={styles.switch__button}
      />
      {(desktop || first) && <ListUsers />}
      {(desktop || !first) && <Dashboard />}
    </div>
  );
};
