import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Layout from "../components/Layout";
import { designDev, developer } from "../components/utils/icons";

export default function Home() {
  return (
    <>
      <Layout>
        <div className="bg-[#ECECEC]/40 flex-1 py-[30px] px-4 relative">
          <div className="absolute inset-x-0 inset-y-[30px] bg_about -z-10"></div>
          <div className="max-w-[936px] mx-auto">
            <p className="text-[#273A5D] text-[48px] font-bold">
              Loyiha haqida
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
                Loyiha ishtirokchilari
              </p>
              <div className="grid gap-8 grid-cols-3 mt-[20px] ">
                <div className="flex items-center space-x-3">
                  {designDev}
                  <div className="font-medium">
                    <p>Ism familiya</p>
                    <p className="text-sm text-[#828696]">Ro’li</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {designDev}
                  <div className="font-medium">
                    <p>Ism familiya</p>
                    <p className="text-sm text-[#828696]">Ro’li</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {developer}
                  <div className="font-medium">
                    <p>Ism familiya</p>
                    <p className="text-sm text-[#828696]">Ro’li</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {developer}
                  <div className="font-medium">
                    <p>Ism familiya</p>
                    <p className="text-sm text-[#828696]">Ro’li</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {developer}
                  <div className="font-medium">
                    <p>Ism familiya</p>
                    <p className="text-sm text-[#828696]">Ro’li</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {developer}
                  <div className="font-medium">
                    <p>Ism familiya</p>
                    <p className="text-sm text-[#828696]">Ro’li</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {developer}
                  <div className="font-medium">
                    <p>Ism familiya</p>
                    <p className="text-sm text-[#828696]">Ro’li</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {developer}
                  <div className="font-medium">
                    <p>Ism familiya</p>
                    <p className="text-sm text-[#828696]">Ro’li</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {developer}
                  <div className="font-medium">
                    <p>Ism familiya</p>
                    <p className="text-sm text-[#828696]">Ro’li</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {developer}
                  <div className="font-medium">
                    <p>Ism familiya</p>
                    <p className="text-sm text-[#828696]">Ro’li</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {developer}
                  <div className="font-medium">
                    <p>Ism familiya</p>
                    <p className="text-sm text-[#828696]">Ro’li</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {developer}
                  <div className="font-medium">
                    <p>Ism familiya</p>
                    <p className="text-sm text-[#828696]">Ro’li</p>
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
