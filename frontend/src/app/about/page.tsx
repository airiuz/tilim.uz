// import { AboutComponent } from "@/src/components/About";

import dynamic from "next/dynamic";

const AboutComponent = dynamic(
  async () => (await import("@/src/components/About")).AboutComponent
);

export default function About() {
  return (
    <div className="main__wrapper fullHeight">
      <AboutComponent />
    </div>
  );
}
