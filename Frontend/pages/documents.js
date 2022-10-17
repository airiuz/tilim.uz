import Layout from "../components/Layout";
import Upload from "../components/Upload";

function Documents() {
  return (
    <Layout>
      <div className="bg-[#F6F6F7] pt-[30px] pb-16 flex-1">
        <div className="max-w-[1366px] px-4 mx-auto">
          <p className="uppercase text-center text-[28px] mb-8 font-[800] text-primary">
            xujjatlarni oson boshqa tilga o&rsquo;giring
          </p>
          <Upload />
        </div>
      </div>
    </Layout>
  );
}

export default Documents;
