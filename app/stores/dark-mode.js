import { atom, selector } from "recoil";

const darkModeValue = atom({
  key: "darkModeValue",
  default: typeof window !== "undefined" ? localStorage.getItem("darkMode") === "true" : false,
});

const darkMode = selector({
  key: "darkMode",
  get: ({ get }) => {
    if (typeof window !== "undefined") {
      if (localStorage.getItem("darkMode") === null) {
        localStorage.setItem("darkMode", false);
      }
    }

    return get(darkModeValue);
  },
});

export { darkModeValue, darkMode };
