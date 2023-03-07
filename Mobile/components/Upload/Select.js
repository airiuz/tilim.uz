import { useCallback, useState } from "react";
import { check, selectArrow, selectArrowDark } from "../utils/icons";

function Select({ stateTranscript }) {
  const [value, setValue] = useState({ text: "Lotin - Кирилл", status: 1 });
  const [isVisible, setIsVisible] = useState(false);
  const handleVisible = useCallback(() => {
    setIsVisible(!isVisible);
  }, [isVisible]);
  return (
    <div
      className="text-sm w-full flex justify-between items-center border-primary dark:border-darkPrimary border bg-[#F4F7FC] dark:bg-[#232831] p-1.5 rounded-full relative select-none cursor-pointer"
      onClick={handleVisible}
    >
      <p className="pl-3 font-semibold dark:text-darkTernary">{value.text}</p>
      <span className="dark:hidden">{selectArrow}</span>
      <span className="hidden dark:block">{selectArrowDark}</span>
      {isVisible ? (
        <div className="absolute border-primary dark:border-darkPrimary border shadow-sm inset-x-0 bg-[#F4F7FC] dark:bg-[#232831] dark:text-darkTernary flex flex-col rounded-lg top-full mt-2 overflow-hidden">
          <div
            className="cursor-pointer mt-2 group"
            onClick={() => {
              stateTranscript(1);
              setValue({ status: 1, text: "Lotin - Кирилл" });
              setIsVisible(false);
            }}
          >
            <div className="flex justify-between items-center px-3 py-2 mx-2 rounded">
              <span
                className={`${
                  value.text === "Lotin - Кирилл"
                    ? "text-primary dark:text-darkPrimary"
                    : null
                }`}
              >
                Lotin - Кирилл
              </span>
              {value.text === "Lotin - Кирилл" ? (
                <span className="stroke-primary dark:stroke-darkPrimary">
                  {check}
                </span>
              ) : null}
            </div>
          </div>
          <div
            className="cursor-pointer mb-2 group"
            onClick={() => {
              stateTranscript(0);

              setValue({ status: 0, text: "Кирилл - Lotin" });
              setIsVisible(false);
            }}
          >
            <div className="flex justify-between items-center px-3 py-2 mx-2 rounded">
              <span
                className={`${
                  value.text === "Кирилл - Lotin"
                    ? "text-primary dark:text-darkPrimary"
                    : null
                }`}
              >
                Кирилл - Lotin
              </span>
              {value.text === "Кирилл - Lotin" ? (
                <span className="stroke-primary dark:stroke-darkPrimary">
                  {check}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Select;
