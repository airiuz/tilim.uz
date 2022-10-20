import React, { useState } from "react";
import { nusxa_icon } from "../components/utils/icons";

function Paa() {
  const [btn, setBtn] = useState(false);
  return (
    <div className="h-screen flex justify-center items-center">
      <button
        onClick={() => {
          setBtn(!btn);
          setTimeout(() => {
            setBtn(false);
          }, 2000);
        }}
      >
        Paa
      </button>
      <div className="flex justify-end ">
        <div
          className={`flex space-x-[10px] text-white overflow-hidden bg-[#3474DF] h-[56px] py-[14px] items-center rounded-[4px] ease-linear duration-300 ${
            btn ? "  w-[196px] px-[30px]" : "w-[0px] "
          }`}
        >
          <div
            className={`relative ${
              btn
                ? "top-0  transition-all duration-1000"
                : "-top-20  transition-all duration-500"
            }`}
          >
            Nusxa olindi
          </div>
          <div
            className={`relative  ${
              btn
                ? "top-0 transition-all duration-1000"
                : "-top-20 transition-all duration-500"
            }`}
          >
            {nusxa_icon}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Paa;
