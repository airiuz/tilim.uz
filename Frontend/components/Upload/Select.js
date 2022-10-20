import { useCallback, useState } from "react";
import { check, selectArrow } from "../utils/icons";

function Select({ stateTranscript }) {
  const [value, setValue] = useState({ text: "Lotin - Кирил", status: 1 });
  const [isVisible, setIsVisible] = useState(false);
  const handleVisible = useCallback(() => {
    setIsVisible(!isVisible);
  }, [isVisible]);
  return (
    <div
      className="text-sm w-full flex justify-between items-center bg-[#F4F7FC] p-1.5 rounded-full relative select-none cursor-pointer"
      onClick={handleVisible}
    >
      <p className="pl-3 font-semibold">{value.text}</p>
      <span>{selectArrow}</span>
      {isVisible ? (
        <div className="absolute shadow-sm inset-x-0 bg-[#F4F7FC] flex flex-col rounded-lg top-full mt-2 overflow-hidden">
          <div
            className="px-3 py-2 flex justify-between items-center cursor-pointer hover:text-primary hover:bg-[#E8EBF2] mt-2"
            onClick={() => {
              stateTranscript(1);
              setValue({ status: 1, text: "Lotin - Кирил" });
              setIsVisible(false);
            }}
          >
            <span>Lotin - Кирил</span>
            {value.text === "Lotin - Кирил" ? check : null}
          </div>
          <div
            className="px-3 py-2 flex justify-between items-center cursor-pointer hover:text-primary hover:bg-[#E8EBF2] mb-2"
            onClick={() => {
              stateTranscript(0);

              setValue({ status: 0, text: "Кирил - Lotin" });
              setIsVisible(false);
            }}
          >
            <span>Кирил - Lotin</span>
            {value.text === "Кирил - Lotin" ? check : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Select;
