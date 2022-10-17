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
        <section>
          <div className="flex items-center justify-center absolute inset-0 -z-20">
            <img src="/img/aboutbg.png" alt="logo" />
          </div>

          <div className="z-10 max-w-[936px] mx-auto">
            <p className="text-[#273A5D] text-[48px] font-bold">
              Loyixa haqida
            </p>
            <p className="mt-[20px]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Id nibh
              cras amet suspendisse venenatis. Suspendisse ut pulvinar auctor
              ante. Non ullamcorper mus viverra tellus ut morbi amet imperdiet.
              Nisi dictum fermentum ut sagittis, massa egestas. Integer
              consequat, egestas massa vitae cursus. Nulla blandit id in
              pellentesque neque consequat consequat. Tristique diam massa
              purus, ac in sem in. Laoreet malesuada nunc, platea porta massa et
              orci. Massa, viverra amet massa sagittis volutpat leo elementum
              non a. Orci, enim nisl, pharetra cras sollicitudin vestibulum
              libero, pellentesque eu. Velit nunc, id vel, porttitor sit
              consectetur fringilla odio suspendisse. Egestas in nibh euismod
              vitae vel bibendum. Viverra sed non in massa, felis imperdiet
              purus. Integer eu ornare orci, porttitor tellus.
            </p>
            <div className="mt-[40px]">
              <p className="text-[#273A5D] text-[36px] font-bold">
                Loyixaga xissa qo’shganlar
              </p>
              <div className="grid grid-cols-3 mt-[20px] ">
                <div className="space-y-5">
                  <div>
                    <p>Ism familiya</p>
                    <p>Ro’li</p>
                  </div>
                  <div>
                    <p>Ism familiya</p>
                    <p>Ro’li</p>
                  </div>
                  <div>
                    <p>Ism familiya</p>
                    <p>Ro’li</p>
                  </div>
                </div>
                <div className="space-y-5">
                  <div>
                    <p>Ism familiya</p>
                    <p>Ro’li</p>
                  </div>
                  <div>
                    <p>Ism familiya</p>
                    <p>Ro’li</p>
                  </div>
                  <div>
                    <p>Ism familiya</p>
                    <p>Ro’li</p>
                  </div>
                </div>
                <div className="space-y-5">
                  <div>
                    <p>Ism familiya</p>
                    <p>Ro’li</p>
                  </div>
                  <div>
                    <p>Ism familiya</p>
                    <p>Ro’li</p>
                  </div>
                  <div>
                    <p>Ism familiya</p>
                    <p>Ro’li</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
