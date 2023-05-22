import { FileTranslator } from "@/src/components/FileTranslator";

export default async function Document() {
  const a = await fetch("https://jsonplaceholder.typicode.com/todos/1");

  return (
    <div className="main__wrapper">
      <FileTranslator />
    </div>
  );
}
