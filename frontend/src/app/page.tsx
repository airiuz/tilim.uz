// import { Translator } from "@/src/components/Translator";
// import { HelpButton } from "@/src/components/Help";

import dynamic from "next/dynamic";
import { Loader } from "../components/Loader";
import React, { Suspense } from "react";
import { HelpButton } from "../components/Help";

const Translator = dynamic(() => import("../components/Translator"), {
  loading: () => <Loader />,
});

// const HelpButton = dynamic(async () => await import("@/src/components/Help"));

export default async function Home() {
  const a = await fetch("https://jsonplaceholder.typicode.com/todos/1");
  return (
    <main className="main__wrapper">
      <Translator />
      <HelpButton />
    </main>
  );
}
