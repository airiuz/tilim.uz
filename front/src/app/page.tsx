import {Translator} from "@/src/components/Translator";
import {Help, HelpButton} from "@/src/components/Help";

export default function Home() {
  return (
    <main>
        <Translator />
        <Help />
        <HelpButton />
    </main>
  )
}
