"use client";
import {useShowStore} from "@/src/components/Typing/index.store";
import {TypingTime} from "@/src/components/Typing/TypingInTime";
import {TypingDashboard} from "@/src/components/Typing/Dashboard";

export const Typing = () => {
    const {show} = useShowStore()

    if(show)
        return <TypingTime />
    return <TypingDashboard />
}