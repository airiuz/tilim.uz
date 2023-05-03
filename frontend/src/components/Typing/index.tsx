"use client";
import { TypingTime } from "@/src/components/Typing/TypingInTime";
import { TypingDashboard } from "@/src/components/Typing/Dashboard";
import styles from "./index.module.css";
import { useTypingStore } from "@/src/store/typing.store";
import { IUser } from "@/src/constants";
import { useEffect } from "react";

export const Typing = () => {
  const { show } = useTypingStore();

  return (
    <section className={styles.section}>
      {show ? <TypingTime /> : <TypingDashboard />}
    </section>
  );
};
