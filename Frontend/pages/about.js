import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Layout from "../components/Layout";

export default function Home() {
  return (
    <>
      <Layout>
        <section className=" min-h-screen py-10">
          <div className="max-w-6xl mx-auto ">
            <p className="text-center text-2xl uppercase font-semibold">
              Loyiha haqida
            </p>
            <div className="grid grid-cols-2 space-x-10 mt-5 text-white">
              <div className="border p-8 rounded-xl flex items-center bg-cyan-500  shadow-lg ">
                <p className="text-lg text-center">
                  O‘zbek tilida bexato yozish uchun ishlab chiqilgan ushbu ilova
                  Project Managers kompaniyasi va Milliy mass-mediani qo’llab
                  quvvatlash va rivojlantirish jamoat fondi bilan birgalikda
                  ishlab chiqildi.
                </p>
              </div>
              <div className="flex flex-col space-y-8 text-center text-lg">
                <p className="border p-8 rounded-xl bg-cyan-600 shadow-lg">
                  CYRIL mobil ilovasi, matn.uz veb-sahifasi va dasturchilar
                  uchun maxsus API xizmatlaridan foydalanish mutlaqo bepuldir.
                  Matn.uz - O‘zbek tilida bexato yozishda yordamchingiz!
                </p>
                <p className="border p-8 rounded-xl bg-cyan-700 shadow-lg text-lg">
                  CYRIL - O‘zbek tilida bexato yozishda yordamchingiz!
                </p>
              </div>
            </div>
            <div className="mt-16">
              <p className="text-center text-2xl uppercase font-semibold">
                Loyiha ustida ishlagan odamlar
              </p>
              <div className="mt-5">
                <Swiper
                  slidesPerView={4}
                  spaceBetween={30}
                  slidesPerGroup={1}
                  loop={true}
                  loopFillGroupWithBlank={true}
                  autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                  }}
                  modules={[Autoplay]}
                >
                  <SwiperSlide>
                    <div className="flex flex-col items-center">
                      <img
                        className="h-40 w-40"
                        src="https://cdn-icons-png.flaticon.com/512/147/147144.png"
                      />
                      <p className="text-lg font-semibold">
                        Biyimbetov Azizbek
                      </p>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="flex flex-col items-center">
                      <img
                        className="h-40 w-40"
                        src="https://cdn-icons-png.flaticon.com/512/147/147144.png"
                      />
                      <p className="text-lg font-semibold">
                        Abdumajitov Umirzoq
                      </p>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="flex flex-col items-center">
                      <img
                        className="h-40 w-40"
                        src="https://cdn-icons-png.flaticon.com/512/147/147144.png"
                      />
                      <p className="text-lg font-semibold">Usmonov Ulugbek</p>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="flex flex-col items-center">
                      <img
                        className="h-40 w-40"
                        src="https://cdn-icons-png.flaticon.com/512/147/147144.png"
                      />
                      <p className="text-lg font-semibold">Raximov Yahyohon</p>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="flex flex-col items-center">
                      <img
                        className="h-40 w-40"
                        src="https://cdn-icons-png.flaticon.com/512/147/147144.png"
                      />
                      <p className="text-lg font-semibold">Shoyimov Samandar</p>
                    </div>
                  </SwiperSlide>
                </Swiper>
                `
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
