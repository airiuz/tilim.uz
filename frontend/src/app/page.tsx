import React from "react";
import { HelpButton } from "../components/Help";
import Translator from "../components/Translator";
import ErrorBoundary from "../components/ErrorHandler";

export default async function Home() {
  return (
    <main className="main__wrapper">
      <Translator />
      <HelpButton />
    </main>
  );
}
