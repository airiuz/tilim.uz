import Layout from "../components/Layout";
function FF() {
  return (
    <>
      <Layout></Layout>
    </>
  );
}

export default FF;

export async function getServerSideProps({ req }) {
  const device = req.headers["user-agent"].includes("Mobile");

  if (req.headers.host === "m.tilim.uz" && !device) {
    return { redirect: { destination: "https://www.tilim.uz" } };
  }

  return {
    props: {},
  };
}
