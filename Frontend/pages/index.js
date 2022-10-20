import Layout from "../components/Layout";
import TextEditor from "../components/text";

export default function Home() {
  return (
    <Layout>
      <div className="border-b max-w-[1366px] w-full mx-auto flex-1">
        <TextEditor />
      </div>
    </Layout>
  );
}
