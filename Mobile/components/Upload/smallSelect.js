import { useState } from "react";
import { check, lineDown, lineUp } from "../utils/icons";

function SmallSelect() {
  const [value, setValue] = useState({ name: "Lotin" });
  const [type, setType] = useState(false);
  return (
    <>
      <div className="mb-[28px]">
        <div
          onClick={() => setType(!type)}
          className="bg-[#F6F6F7] py-[12px] pl-[20px] rounded-3xl mt-[40px] mb-1  cursor-pointer font-semibold"
        >
          <p className="select-none">{value.name}</p>
          <div className="absolute top-1 right-1 py-[15.5px] px-[12px] bg-[#D3DAFD] rounded-full">
            {type ? <span> {lineUp}</span> : <span>{lineDown}</span>}
          </div>
        </div>
        {type && (
          <div className="flex flex-col rounded-2xl">
            <button
              onClick={() => {
                setValue({ name: "Lotin" });
                setType(false);
              }}
              className="bg-[#F6F6F7] py-[15px] px-[15px] rounded-t-2xl flex items-center justify-between hover:text-[#3474DF] select-none"
            >
              Lotin
              {value.name === "Lotin" ? check : " "}
            </button>
            <button
              onClick={() => {
                setValue({ name: "Kirill" });
                setType(false);
              }}
              className="bg-[#F6F6F7] py-[15px] rounded-b-2xl px-[15px]   flex items-center justify-between hover:text-[#3474DF] select-none"
            >
              Kirill
              {value.name === "Kirill" ? check : " "}
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default SmallSelect;
