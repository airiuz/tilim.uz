// import { Help } from "@/src/components/Help";
// import { Typing } from "@/src/components/Typing";
// import { IUser } from "@/src/constants";
import { Loader } from "@/src/components/Loader";
import dynamic from "next/dynamic";

const Typing = dynamic(() => import("@/src/components/Typing"), {
  loading: () => <Loader />,
});

export default async function TypingPage() {
  return (
    <div className="main__wrapper">
      <Typing />
    </div>
  );
}
