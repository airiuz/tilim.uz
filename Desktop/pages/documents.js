import Layout from "../components/Layout";
import Upload from "../components/Upload";

function Documents() {
  return (
    <Layout>
      <div className="bg-[#F6F6F7] dark:bg-[#232831] pt-[30px] pb-16 flex-1">
        <div className="max-w-[1366px] px-4 mx-auto">
          <p className="uppercase text-center text-[28px] mb-8 font-[800] text-primary dark:text-darkPrimary">
            hujjatlarni oson o&lsquo;giring
          </p>
          <Upload />
        </div>
      </div>
    </Layout>
  );
}

export default Documents;

export async function getServerSideProps({ req }) {
  const device = req.headers["user-agent"].includes("Mobile");

  if (req.headers.host === "www.tilim.uz" && device) {
    return { redirect: { destination: "https://m.tilim.uz/documents/" } };
  }

  return {
    props: {},
  };
}
