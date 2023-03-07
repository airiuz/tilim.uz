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
        <div className="bg-[#F6F6F7] dark:bg-[#232831] flex-1 grid ">
          <div className="flex flex-col justify-between  w-full pl-[60px] pr-[69px] rounded-xl mt-[41px]">
            <div>
              <div className="flex flex-col space-y-[20px]">
                <p className="text-[#273A5D] dark:text-[#8BADB8]  text-[24px] font-semibold">
                  Biz bilan bog&lsquo;lanish
                </p>
                <Link href={"tel:998335591818"}>
                  <div className="flex items-center space-x-[17px] stroke-[#273A5D] dark:stroke-darkTernary">
                    {phone}
                    <span className="dark:text-[#DBDBDB]">
                      +998(33) 559-18-18
                    </span>
                  </div>
                </Link>
                <Link href={"mailto:info@airi.uz"}>
                  <div className="flex items-center space-x-[17px]  stroke-[#273A5D] dark:stroke-darkTernary">
                    {email}
                    <span className="dark:text-[#DBDBDB]">info@airi.uz</span>
                  </div>
                </Link>
              </div>
              <div className="mt-[60px] space-y-[20px]">
                <p className="text-[#273A5D] dark:text-[#8BADB8] text-[17px] font-semibold">
                  Ijtimoiy tarmoqlarda kuzating
                </p>
                <div className="flex space-x-8">
                  <Link href={"https://www.facebook.com/ai.uzbekistan"}>
                    <div
                      target={"_blank"}
                      className="fill-darkPrimary dark:fill-darkPrimary"
                    >
                      {facebook}
                    </div>
                  </Link>
                  <Link href={"https://www.instagram.com/airi.uz/"}>
                    <div
                      target={"_blank"}
                      className="fill-darkPrimary dark:fill-darkPrimary"
                    >
                      {instagram}
                    </div>
                  </Link>
                  <Link href={"https://t.me/tilim_uz"}>
                    <div
                      target={"_blank"}
                      className="fill-darkPrimary dark:fill-darkPrimary"
                    >
                      {telegram}
                    </div>
                  </Link>
                  <Link href={"https://github.com/airiuz"}>
                    <div
                      target={"_blank"}
                      className="fill-darkPrimary dark:fill-darkPrimary"
                    >
                      {github}
                    </div>
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-[7px]">
              <p className="text-[#828696] dark:text-darkTernary text-[12px] max-w-[200px] ">
                Copyright © 2022 AIRI Group Co., Ltd. All rights reserved.
              </p>
              <p className="text-[7px] text-[#828696] dark:text-darkTernary ">
                Protected by reCAPTCHA - Privacy Policy and Terms of Service
              </p>
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

  if (req.headers.host === "m.tilim.uz" && !device) {
    return { redirect: { destination: "https://www.tilim.uz/contact/" } };
  }

  return {
    props: {},
  };
}
