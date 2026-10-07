import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2F7D6D",
    },
    secondary: {
      main: "#F28C7A",
    },
    background: {
      default: "#F7FAF9",
      paper: "#FFFFFF",
    },
  },

  typography: {
    fontFamily: "Inter, Arial, sans-serif",
  },

  shape: {
    borderRadius: 12,
  },
});

export default theme;