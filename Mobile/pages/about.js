import Layout from "../components/Layout";
import { designDev, developer } from "../components/utils/icons";

export default function Home() {
  return (
    <>
      <Layout>
        <div className="bg_about dark:bg-none flex-1 flex flex-col">
          <div className="dark:bg-[#232831] pb-24 flex-1 pt-[30px] px-4">
            <div className="max-w-[936px] mx-auto">
              <p className="text-[#273A5D] dark:text-[#8BADB8] text-[20px] font-bold">
                Loyiha haqida
              </p>
              <p className="mt-[14px] dark:text-darkTernary">
                Ushbu loyiha O&lsquo;zbek tilini rivojlantirish uchun ishlab
                chiqilgan. Loyiha Raqamli texnologiyalar va sun’iy intellektni
                rivojlantirish ilmiy tadqiqot institutining yosh dasturchilar
                jamoasi tomonidan ishlab chiqildi. Tilim.uzdan hamma istalgan
                joyda, istalgan vaqtda - <strong>oson</strong> va{" "}
                <strong>mutlaqo bepul</strong> foydalanishi mumkin.
                <br />
                Loyihada Lotin-Kirill va Kirill-Lotin o&lsquo;girish tizimi,
                sun’iy intellekt texnologiyasi asosida matndagi xatolarni
                aniqlash va matnning ma’nosiga qarab keyingi so&lsquo;zlarni
                aniqlash tizimi va matnli ma’lumotlarni ovozli xabarga va ovozli
                xabarni matnli ma’lumotga aylantirish tizimi joriy qilingan.
              </p>
              <div className="mt-[40px] dark:text-darkTernary">
                <p className="text-[#273A5D] dark:text-[#8BADB8] text-[20px] font-bold">
                  Loyiha ishtirokchilari
                </p>
                <div className="flex flex-col gap-8  mt-[20px] ">
                  <div className="flex items-center space-x-3">
                    {developer}
                    <div className="font-medium">
                      <p>Biyimbetov Azizbek</p>
                      <p className="text-sm text-[#828696]">Loyiha asoschisi</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {developer}
                    <div className="font-medium">
                      <p>To&lsquo;lqinov Foziljon</p>
                      <p className="text-sm text-[#828696]">
                        MO&lsquo; dasturchisi
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {developer}
                    <div className="font-medium">
                      <p>Zohidov Shaxboz</p>
                      <p className="text-sm text-[#828696]">
                        MO&lsquo; dasturchisi
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {developer}
                    <div className="font-medium">
                      <p>Xakulov Azim</p>
                      <p className="text-sm text-[#828696]">
                        Loyiha boshqaruvchisi
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {developer}
                    <div className="font-medium">
                      <p>Rahimov Yahyoxon</p>
                      <p className="text-sm text-[#828696]">Python dasturchi</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {developer}
                    <div className="font-medium">
                      <p>Mamadaliyev Shahriyor</p>
                      <p className="text-sm text-[#828696]">Veb dasturchi</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {developer}
                    <div className="font-medium">
                      <p>Jabborov Abduraxim</p>
                      <p className="text-sm text-[#828696]">
                        CHO&lsquo; dasturchisi
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {developer}
                    <div className="font-medium">
                      <p>Oripov G&lsquo;iyos</p>
                      <p className="text-sm text-[#828696]">
                        Tizim dasturchisi
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {developer}
                    <div className="font-medium">
                      <p>Jabborov Kamoladdin</p>
                      <p className="text-sm text-[#828696]">
                        CHO&lsquo; dasturchisi
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {developer}
                    <div className="font-medium">
                      <p>Abdumajitov Umirzoq</p>
                      <p className="text-sm text-[#828696]">Veb dasturchi</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {developer}
                    <div className="font-medium">
                      <p>Usmonov Ulug&lsquo;bek</p>
                      <p className="text-sm text-[#828696]">Veb dasturchi</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {developer}
                    <div className="font-medium">
                      <p>Shoyimov Samandar</p>
                      <p className="text-sm text-[#828696]">
                        Tizim dasturchisi
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {developer}
                    <div className="font-medium">
                      <p>Jo&lsquo;rabekov Sherzod</p>
                      <p className="text-sm text-[#828696]">
                        Android dasturchi
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {designDev}
                    <div className="font-medium">
                      <p>Mirjamol Bekhzod</p>
                      <p className="text-sm text-[#828696]">Veb dizayner</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {designDev}
                    <div className="font-medium">
                      <p>Abduvaliyev Jasur</p>
                      <p className="text-sm text-[#828696]">Grafik dizayner</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export async function getServerSideProps({ req }) {
  const device = req.headers["user-agent"].includes("Mobile");

  if (req.headers.host === "m.tilim.uz" && !device) {
    return { redirect: { destination: "https://www.tilim.uz/about/" } };
  }

  return {
    props: {},
  };
}
