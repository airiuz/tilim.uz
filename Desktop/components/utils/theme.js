import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export const Theme = createContext();

export function useTheme() {
  const data = useContext(Theme);

  useEffect(() => {
    const html = document.querySelector("html");
    if (data.mode === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, [data.mode]);
  return data;
}

function ThemeProvider({ children }) {
  const [mode, setMode] = useState(null);
  const data = { mode, setMode };

  const onSelectMode = useCallback((theme) => {
    setMode(theme);
    localStorage.setItem("theme", theme);
  }, []);

  useEffect(() => {
    setMode(localStorage.getItem("theme"));
    // Add listener to update styles
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) =>
        onSelectMode(e.matches ? "dark" : "light")
      );

    // Setup dark/light mode for the first time
    if (!localStorage.getItem("theme")) {
      onSelectMode(
        window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
      );
    }

    // Remove listener
    return () => {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .removeEventListener("change", () => {});
    };
  }, []);
  return <Theme.Provider value={data}>{children}</Theme.Provider>;
}

export default ThemeProvider;
