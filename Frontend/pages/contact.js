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
        <section className="bg-[#ECECEC]  flex-1 relative z-10">
          <div className="flex items-center justify-center absolute inset-0">
            <div className="w-[800px] h-[458px] bg-white flex items-center  justify-between   border pl-[60px] pr-[69px] rounded-xl">
              <div>
                <div className="space-y-[35px]">
                  <p className="text-[#273A5D] text-[24px] font-semibold">
                    Biz bilan bog’lanish
                  </p>
                  <Link href={"tel:+998 9000 96009"}>
                    <a className="flex items-center space-x-[21px]">
                      {phone}
                      <span>+998 9000 96009</span>
                    </a>
                  </Link>
                  <Link href={"email:info@airi.com"}>
                    <a className="flex items-center space-x-[21px]">
                      {email}
                      <span>info@airi.com</span>
                    </a>
                  </Link>
                </div>
                <div className="mt-[60px] space-y-[40px]">
                  <p className="text-[#273A5D] text-[24px] font-semibold">
                    Ijtimoiy tarmoqlarda kuzating
                  </p>
                  <div className="flex space-x-[66px] pl-6">
                    <Link href={"#"}>
                      <a>{facebook}</a>
                    </Link>
                    <Link href={"#"}>
                      <a>{instagram}</a>
                    </Link>
                    <Link href={"#"}>
                      <a>{telegram}</a>
                    </Link>
                    <Link href={"#"}>
                      <a>{github}</a>
                    </Link>
                  </div>
                </div>
              </div>
              <div>
                <img src="/img/logo.png" alt="logo" />
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}

export default Contact;
