import { atom, selector } from "recoil";

const colorSchemeValue = atom({
  key: "colorSchemeValue",
  default: typeof window !== "undefined" 
    ? (localStorage.getItem("colorScheme") === null
        ? "default"
        : localStorage.getItem("colorScheme"))
    : "default",
});

const colorScheme = selector({
  key: "colorScheme",
  get: ({ get }) => {
    if (typeof window !== "undefined") {
      if (localStorage.getItem("colorScheme") === null) {
        localStorage.setItem("colorScheme", "default");
      }
    }

    return get(colorSchemeValue);
  },
});

export { colorSchemeValue, colorScheme };
