// import { Translator } from "@/src/components/Translator";
// import { HelpButton } from "@/src/components/Help";

import dynamic from "next/dynamic";
import { Loader } from "../components/Loader";
import React, { Suspense } from "react";

const Translator = dynamic(() => import("../components/Translator"));

// const HelpButton = dynamic(async () => await import("@/src/components/Help"));

export default async function Home() {
  return (
    <main className="main__wrapper">
      <Translator />
      {/* <HelpButton /> */}
    </main>
  );
}
