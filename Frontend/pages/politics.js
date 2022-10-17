import Layout from "../components/Layout";

function Politics() {
  return (
    <>
      <Layout>
        <section className="bg-[#F6F6F7] max-w-[1200px] mx-auto pl-[100px] pr-[170px] py-[50px] my-[30px]">
          <p className="text-[36px] font-semibold">Foydalanuvchi siyosati</p>

          <div className="space-y-[15px]">
            <p className="mt-[20px]">
              <span className="font-semibold text-lg">1. Umumiy qoidalar</span>
              <br /> 1.1.Matn.uz tizimi faoliyati demokratiya, insonparvarlik,
              barcha uchun ochiqligi, umuminsoniy qadriyatlar ustunligi,
              shaxsning erkin rivojlanishi prinsiplariga asoslangan. <br /> 1.2.
              Matn.uz tizimidan foydalanish bepul.
              <br />
            </p>
            <p>
              <span className="font-semibold text-lg">
                2. Matn.uz tizimining asosiy vazifalari
              </span>
              <br /> 2.1. Berilgan matnning imlo xatolari mavjud yoki yo‘qligini
              tekshirish, universal izohli lug‘at, lotin alifbosida keltirilgan
              matnni kirill alifbosiga o‘girib berish (shu o‘rinda kirill
              alifbosidagi matnni lotin alifbosiga o‘girish), matn tahriri.{" "}
              <br />
              2.2. Dasturchilar uchun REST-API xizmati.
            </p>
            <p>
              <span className="font-semibold text-lg">
                3. Foydalanuvchilarning huquq va majburiyatlari
              </span>{" "}
              <br />
              3.1. Tizimdan foydalanish huquqi fuqaroligi, yoshi, ijtimoiy va
              boshqa kelib chiqishidan qat’i nazar, turli hududlarda yashovchi
              barcha aholiga, shu jumladan ishlab chiqarish korxonalari va
              tashkilotlarga beriladi. <br /> 3.2. Foydalanuvchilar quyidagi
              huquqlarga ega: <br /> -Tizim fondidan kerakli so‘zlar haqida
              to‘liq izoh olish; <br />- Tizim tomonidan ko‘rsatiladigan imloviy
              xatolar tekshirish, onlayn tahrirlash va boshqa xizmat turlaridan
              foydalanish;
              <br />- Tizimning kamchiliklarini ko‘rsatish (qayta aloqa bo‘limi)
              hamda izohli lug‘at omborini to‘ldirish;
              <br />
              3.3. Tizimning xizmatlaridan foydalanish mutlaqo bepul va
              ro‘yxatdan o‘tish talab etilmaydi.
              <br />
              3.4. Foydalanuvchilarga cheklanmagan ravishda o‘z materiallarini
              tekshirish imkoniyati beriladi.
              <br />
              Dasturchilarga REST-API xizmati maxsus kelishuv hamda bepul
              ravishda taqdim etiladi.
              <br />
              3.5. Tizimni rivojlantirish bo‘yicha takliflar berish hamda
              hamkorlikka chorlash.
              <br />
              3.6. Foydalanuvchilarni tizimga kiritilayotgan ma’lumotlarga
              (yangi so‘z qo‘shish, so‘zga izoh berish, qayta aloqa xizmatidan
              foydalanish) e’tibor bilan qarashga chorlaymiz.
              <br />
              3.7. Matn.uz tizimiga zarar yetkazgan shaxslar, qonunga binoan
              jinoiy yoki boshqa javobgarlikka tortiladi.
              <br />
              3.8. ARM fondidan hujjatlar va materiallarni yo‘qotgan yoki unga
              qayta tiklab bo‘lmaydigan darajada zarar yetkazgan
              foydalanuvchilar ARM xodimlari tomonidan tan olingan teng qiymatli
              xuddi shunday hujjat va materiallar bilan o‘zgartirishlari (shu
              jumladan, nusxalari bilan) kerak bo‘ladi. Buning imkoni bo‘lmagan
              hollarda ularning qiymati 5 barobar narxda undiriladi. Ko‘p
              miqdorli (bir necha barobar ko‘p miqdordagi to‘lov) amaldagi
              belgilangan hujjatlar asosida yo‘qotilgan va zarar ko‘rgan
              nashrlarning bahosidan kelib chiqqan holda ARM xodimlari yoki jalb
              etilgan mutaxassislar tomonidan aniqlanadi.
              <br />
              3.9. Tizimdan foydalanish qoidalarini buzgan foydalanuvchilar
              ma’lum muddatga rahbariyat tomonidan o‘rnatilgan Tizimdan
              foydalanish huquqidan mahrum etilishi mumkin.
            </p>
            <p>
              <span className="font-semibold text-lg">
                4. Foydalanuvchilarga xizmat ko‘rsatish bo‘yicha Tizimning
                majburiyatlari
              </span>
              <br /> 4.1. Tizimdagi materiallardan qoidalar asosida
              foydalanishni ta’minlash hamda ularni saqlash va hisobot ishlarini
              amalga oshirish, izohli lug‘atni yuritish;
              <br />- foydalanuvchilarga yuqorida ko‘rsatib o‘tilgan turdagi
              xizmatlardan foydalanishlarini ta’minlashi;
              <br />- foydalanuvchilarning talablarini o‘rganish va imkon qadar
              qondirib borish;
              <br />- xizmatlarni mukammallashtirish maqsadida foydalanuvchilar
              bilan ishlashning turli individual va guruhli shaklini qo‘llash;
              <br />- foydalanuvchilarga xizmat ko‘rsatishda yuqori madaniyat
              namunasini ko‘rsatish va kasb mahoratini ta’minlash;
              <br />- kerakli axborotlarni mustaqil ravishda izlashni o‘rgatish
              bo‘yicha ko‘nikmalarni rivojlantirish uchun sharoit yaratish;
              <br />- tizimning ijobiy qiyofasini yaratishga ko‘maklashish, ARM
              tomonidan ko‘rsatiladigan xizmatlarni va fondlarni targ‘ib qilish,
              foydalanuvchilarning talablarini o‘rganish va ularning
              xohishlarini inobatga olgan holda yangidan-yangi xizmat turlarini
              yaratib borish.
            </p>
          </div>
        </section>
      </Layout>
    </>
  );
}

export default Politics;
