import React from "react";
import styles from "./index.module.css";
import { IUser } from "@/src/constants";

const ListItem = ({ user }: { user: IUser }) => {
  return (
    <div className={styles.list__user__item}>
      <div className={styles.number}>{user.place}</div>
      <div className={styles.user__information}>
        <div className={styles.name}>{user.name}</div>
        <div className={styles.result}>
          <span>{user.wpm} so’z/daq</span>
          <span>{user.percent}% aniqlik</span>
        </div>
      </div>
    </div>
  );
};

export default ListItem;
