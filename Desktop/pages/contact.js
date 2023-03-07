import Link from "next/link";
import Layout from "../components/Layout";
import {
  email,
  facebook,
  github,
  instagram,
  logo,
  phone,
  telegram,
} from "../components/utils/icons";

function Contact() {
  return (
    <>
      <Layout>
        <div className="bg-[#F6F6F7] dark:bg-[#232831] flex-1 grid place-content-center py-[100px]">
          <div className="w-[800px] h-[458px] bg-white dark:text-darkTernary dark:bg-darkSecondary flex items-center justify-between pl-[60px] pr-[69px] rounded-xl">
            <div>
              <div className="space-y-[35px]">
                <p className="text-[#273A5D] dark:text-darkTernary  text-[24px] font-semibold">
                  Biz bilan bog&lsquo;lanish
                </p>
                <Link href={"tel:998335591818"}>
                  <a className="flex items-center space-x-[21px] stroke-[#273A5D] dark:stroke-darkTernary">
                    {phone}
                    <span>+998(33) 559-18-18</span>
                  </a>
                </Link>
                <Link href={"mailto:info@airi.uz"}>
                  <a className="flex items-center space-x-[21px]  stroke-[#273A5D] dark:stroke-darkTernary">
                    {email}
                    <span>info@airi.uz</span>
                  </a>
                </Link>
              </div>
              <div className="mt-[60px] space-y-[40px]">
                <p className="text-[#273A5D] dark:text-darkTernary text-[24px] font-semibold">
                  Ijtimoiy tarmoqlarda kuzating
                </p>
                <div className="flex space-x-8">
                  <Link href={"https://www.facebook.com/ai.uzbekistan"}>
                    <a target={"_blank"} className="fill-darkPrimary">
                      {facebook}
                    </a>
                  </Link>
                  <Link href={"https://www.instagram.com/airi.uz/"}>
                    <a target={"_blank"} className="fill-darkPrimary">
                      {instagram}
                    </a>
                  </Link>
                  <Link href={"https://t.me/tilim_uz"}>
                    <a target={"_blank"} className="fill-darkPrimary">
                      {telegram}
                    </a>
                  </Link>
                  <Link href={"https://github.com/airiuz"}>
                    <a target={"_blank"} className="fill-darkPrimary">
                      {github}
                    </a>
                  </Link>
                </div>
              </div>
            </div>
            <div>
              <img src="/img/logo.png" alt="logo" />
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default Contact;

export async function getServerSideProps({ req }) {
  const device = req.headers["user-agent"].includes("Mobile");

  if (req.headers.host === "www.tilim.uz" && device) {
    return { redirect: { destination: "https://m.tilim.uz/contact/" } };
  }

  return {
    props: {},
  };
}
