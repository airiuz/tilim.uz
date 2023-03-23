import styles from "./index.module.css"
import {FirstSection} from "@/src/components/Typing/TypingInTime/FirstSection";
import {Keyboard} from "@/src/components/Typing/TypingInTime/Keyboard";
import {useShowStore} from "@/src/components/Typing/index.store";
import {Result} from "@/src/components/Typing/TypingInTime/Result";

export const TypingTime = () => {
    const {passed} = useShowStore()

    if(passed)
        return <Result />

    return (
        <div className={styles.container}>
            <FirstSection />
            <Keyboard />
        </div>
    )
}