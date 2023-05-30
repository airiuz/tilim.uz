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
import useAxios from "@/src/hooks/axios.hook";
import { IUser } from "@/src/constants";
import Skeleton from "react-loading-skeleton";

export const ListUsers = () => {
  // List of users

  const { loading, fetchData, error } = useAxios();

  const [users, setUsers] = useState<IUser[]>([]);
  const [topUsers, setTopUsers] = useState<IUser[]>([]);

  useEffect(() => {
    (async function () {
      const users: IUser[] = await fetchData("/topusers/", "GET");
      if (users) {
        console.log(users.filter((user) => Number(user.t) === 0));
        setUsers(users);
        setTopUsers(users.filter((user) => Number(user.t) === 0));
      }
    })();
  }, []);

  const handleClick = (first: boolean) => {
    setTopUsers(users.filter((user) => Number(first) !== Number(user.t)));
  };

  return (
    <div className={styles.list__users__container}>
      <div className={styles.title}>
        <Image src={cup} alt={"cup"} width={31} height={31} />
        <span>Kuchlilar reytingi</span>
      </div>
      <div className={styles.button}>
        <TranslatorButton
          width="331px"
          animation={false}
          firstChild={<LotinForTranslator />}
          secondChild={<KirilForTranslator />}
          onClick={handleClick}
        />
      </div>
      <div>
        {loading ? (
          <div className={styles.loading__container}>
            <Skeleton width={"100%"} height={"40px"} />
            <Skeleton width={"100%"} height={"40px"} />
            <Skeleton width={"100%"} height={"40px"} />
          </div>
        ) : (
          topUsers.map((user, i) => <ListItem key={i} user={user as any} />)
        )}
      </div>
    </div>
  );
};
