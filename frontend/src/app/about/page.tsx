import { AboutComponent } from "@/src/components/About";

export default async function About() {
  const a = await fetch("https://jsonplaceholder.typicode.com/todos/1");

  return (
    <div className="main__wrapper fullHeight">
      <AboutComponent />
    </div>
  );
}
