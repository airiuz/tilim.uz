import { Translator } from "@/src/components/Translator";
import { Help, HelpButton } from "@/src/components/Help";

export default async function Home() {
  return (
    <main className="main__wrapper">
      <Translator />
      <HelpButton />
    </main>
  );
}
