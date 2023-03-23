import styles from './index.module.css';
import {Button} from "@/src/common/Button";
import {BackIcon, GroupIcon, ReIcon} from "@/src/common/Utils/icons";
import {Card} from "@/src/common/Card";

export const Result = () => {
    return (
        <div className={styles.container}>
            <Button className={styles.back}>
                <span>{BackIcon}</span>
                <span>Orqaga qaytish</span>
            </Button>
            <div className={styles.card}>
                <div className={styles.title}>
                    Toshbaqadan sal tezroq
                </div>
                <div className={styles.result}>
                    <span>{GroupIcon}</span>
                    <span>1022- o’rindasiz </span>
                </div>
                <div className={styles.card__wrapper}>
                    <Card className={''}>
                        <span>3216</span>
                        <span>belgilar/daqiqa</span>
                    </Card>
                    <Card className={''}>
                        <span>3216</span>
                        <span>so'zlar/daqiqa</span>
                    </Card>
                    <Card className={''}>
                        <span>3216</span>
                        <span>%/aniqlik</span>
                    </Card>
                </div>
                <Button className={''}>
                    <span>Qayta urinish</span>
                    <span>{ReIcon}</span>
                </Button>

            </div>
        </div>
    )
}
