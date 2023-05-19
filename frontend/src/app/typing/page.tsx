// import { Help } from "@/src/components/Help";
// import { Typing } from "@/src/components/Typing";
// import { IUser } from "@/src/constants";
import { Loader } from "@/src/components/Loader";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const Typing = dynamic(() => import("@/src/components/Typing"), {
  loading: () => <Loader />,
});

export default async function TypingPage() {
  const a = await fetch("https://jsonplaceholder.typicode.com/todos/1");

  return (
    <div className="main__wrapper">
      <Suspense fallback={<Loader />}>
        <Typing />
      </Suspense>
    </div>
  );
}
