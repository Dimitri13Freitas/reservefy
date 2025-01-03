const Colors = {
  primary: { main: "#00C6CF", light: "#CCF4F5", dark: null },
  opacityPrymary: (e: number) => {
    return `rgba(0, 198, 207, ${e})`;
  },
  secundary: { main: "#2c2c2c", light: "#737373", dark: null },
  white: {
    main: "#ffffff",
    light: "#f7f7f7",
    dark: "#f3f3f3",
  },
  black: {
    opacity: (e: number) => {
      return `rgba(0, 0, 0, ${e})`;
    },
  },
  red: "#FF3535",
  debug: {
    red: "red",
    green: "green",
  },
};

export default Colors;
