import dynamic from "next/dynamic";
import { Loader } from "../components/Loader";
import React from "react";
import { HelpButton } from "../components/Help";

const Translator = dynamic(() => import("../components/Translator"), {
  loading: () => <Loader />,
});

export default async function Home() {
  return (
    <main className="main__wrapper">
      <Translator />
      <HelpButton />
    </main>
  );
}
