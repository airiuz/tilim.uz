"use client";

import styles from "./index.module.css";
import { useTypingStore } from "@/src/store/typing.store";
import dynamic from "next/dynamic";
import { Loader } from "../Loader";

const TypingTime = dynamic(
  () => import("@/src/components/Typing/TypingInTime"),
  {
    loading: () => <Loader />,
  }
);

const TypingDashboard = dynamic(
  () => import("@/src/components/Typing/Dashboard"),
  {
    loading: () => <Loader />,
  }
);

const Typing = () => {
  const { show } = useTypingStore();

  return (
    <section className={styles.section}>
      {show ? <TypingTime /> : <TypingDashboard />}
    </section>
  );
};

export default Typing;
