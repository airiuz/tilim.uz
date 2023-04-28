import { Help } from "@/src/components/Help";
import { Typing } from "@/src/components/Typing";
import { IUser } from "@/src/constants";

export default async function TypingPage() {
  return (
    <div className="main__wrapper">
      <Typing />
    </div>
  );
}
