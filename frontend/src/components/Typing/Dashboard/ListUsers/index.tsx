import ListItem from "@/src/components/Typing/Dashboard/ListUsers/listItem";
import styles from "./index.module.css";
import Image from "next/image";
import {
  KirilForTranslator,
  LotinForTranslator,
  TranslatorButton,
} from "@/src/common/Button";
import cup from "../../../../assets/images/img.png";
import { useEffect, useState } from "react";
import { IUser } from "@/src/constants";
import { useTypingHook } from "@/src/hooks/typing.hook";
import { useTypingStore } from "@/src/store/typing.store";

export const ListUsers = () => {
  // List of users

  const { getTopUsers } = useTypingHook({ content: "" });

  const { users, language, setLanguage } = useTypingStore();
  const handleClick = (first: boolean) => {
    setLanguage(Number(!first));
  };
  useEffect(() => {
    getTopUsers();
  }, []);

  return (
    <div className={styles.list__users__container}>
      <div className={styles.title}>
        <Image src={cup} alt={"cup"} width={31} height={31} />
        <span>Kuchlilar reytingi</span>
      </div>
      <div className={styles.button}>
        <TranslatorButton
          width="331px"
          animation={Boolean(language)}
          firstChild={<LotinForTranslator />}
          secondBtnActive={Boolean(language)}
          key={language}
          secondChild={<KirilForTranslator />}
          onClick={handleClick}
        />
      </div>
      <div className={styles.list__users}>
        {users
          .filter((user) => language === Number(!Number(user.type)))
          .map((user, i) => {
            if (i < 21)
              return <ListItem key={i} user={user as any} place={i} />;
          })}
      </div>
    </div>
  );
};
