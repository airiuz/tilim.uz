import React from 'react';
import styles from './index.module.css'

const ListItem = () => {
    return (
        <div className={styles.list__user__item}>
            <div className={styles.number}>
                1
            </div>
            <div className={styles.user__information}>
                <div className={styles.name}>
                    Eshonov Fakhriyor
                </div>
                <div className={styles.result}>
                    <span>1534 so’z/daq</span>
                    <span>1534 belgi/daq</span>
                    <span>100% aniqlik</span>
                </div>
            </div>
        </div>
    );
};

export default ListItem;