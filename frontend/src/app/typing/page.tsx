// import { Help } from "@/src/components/Help";
// import { Typing } from "@/src/components/Typing";
// import { IUser } from "@/src/constants";
import dynamic from "next/dynamic";

const Typing = dynamic(() => import("@/src/components/Typing"));

export default async function TypingPage() {
  return (
    <div className="main__wrapper">
      <Typing />
    </div>
  );
}
