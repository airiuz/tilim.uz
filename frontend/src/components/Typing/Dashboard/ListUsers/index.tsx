import ListItem from "@/src/components/Typing/Dashboard/ListUsers/listItem";
import styles from "./index.module.css";
import Image from "next/image";
import {
  KirilForTranslator,
  LotinForTranslator,
  TranslatorButton,
} from "@/src/common/Button";
import cup from "../../../../assets/images/img.png";

export const ListUsers = () => {
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
        />
      </div>
      <div>
        <ListItem />
        <ListItem />
        <ListItem />
        <ListItem />
      </div>
    </div>
  );
};
