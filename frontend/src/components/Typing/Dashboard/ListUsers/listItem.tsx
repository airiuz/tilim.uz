import React from "react";
import styles from "./index.module.css";
import { IUser } from "@/src/constants";

const ListItem = ({ user, place }: { user: IUser; place: number }) => {
  return (
    <div className={styles.list__user__item}>
      <div className={styles.number}>{place + 1}</div>
      <div className={styles.user__information}>
        <div className={styles.name}>{user.fullName}</div>
        <div className={styles.result}>
          <span>{user.wpm} so’z/daq</span>
          <span>{user.accuracy}% aniqlik</span>
        </div>
      </div>
    </div>
  );
};

export default ListItem;
