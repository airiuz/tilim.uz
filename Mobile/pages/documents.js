import Layout from "../components/Layout";
import Upload from "../components/Upload";

function Documents() {
  return (
    <Layout>
      <div className="container mx-auto flex flex-col flex-1 px-4">
        <Upload />
      </div>
    </Layout>
  );
}

export default Documents;

export async function getServerSideProps({ req }) {
  const device = req.headers["user-agent"].includes("Mobile");

  if (req.headers.host === "m.tilim.uz" && !device) {
    return { redirect: { destination: "https://www.tilim.uz/documents/" } };
  }

  return {
    props: {},
  };
}
