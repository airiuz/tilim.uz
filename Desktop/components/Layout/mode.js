import { useCallback } from "react";
import { useTheme } from "../utils/theme";
import { darkMode, lightMode } from "../utils/icons";

function Mode() {
  const { mode, setMode } = useTheme();
  const changeMode = useCallback(() => {
    setMode(mode === "dark" ? "light" : "dark");
    localStorage.setItem("theme", mode === "dark" ? "light" : "dark");
  }, [mode]);

  return (
    <div
      className={`rounded-full cursor-pointer flex items-center bg-gradient-to-r w-[52px] h-[32px] select-none ${
        mode === "dark"
          ? "from-[#38404D] to-[#2A303A]"
          : "from-[#7DD1E4] to-[#3474DF]"
      }`}
      onClick={changeMode}
    >
      <div
        className={`w-7 h-7 flex items-center justify-center transition-all duration-500 bg-white rounded-full mx-[2px] ${
          mode === "dark" ? "translate-x-5" : "transate-x-0"
        }`}
      >
        {mode === "dark" ? darkMode : lightMode}
      </div>
    </div>
  );
}

export default Mode;
