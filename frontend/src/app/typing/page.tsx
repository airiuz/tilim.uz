import { Loader } from "@/src/components/Loader";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const Typing = dynamic(() => import("@/src/components/Typing"), {
  loading: () => <Loader />,
});

export default async function TypingPage() {
  return (
    <div className="main__wrapper">
      <Suspense fallback={<Loader />}>
        <Typing />
      </Suspense>
    </div>
  );
}
