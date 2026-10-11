import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",

    primary: {
      main: "#2F7D6D",
      light: "#A8D5C5",
      dark: "#205D51",
      contrastText: "#FFFFFF",
    },

    secondary: {
      main: "#F28C7A",
      light: "#FBE3DE",
      dark: "#C85D4F",
      contrastText: "#24332F",
    },

    background: {
      default: "#F7FAF9",
      paper: "#FFFFFF",
    },

    text: {
      primary: "#223532",
      secondary: "#60746D",
    },

    divider: "#E3EBE7",

    success: {
      main: "#32856B",
    },

    warning: {
      main: "#C88736",
    },

    error: {
      main: "#D45D62",
    },

    info: {
      main: "#4085A3",
    },
  },

  typography: {
    fontFamily:
      '"Inter", "Segoe UI", Roboto, Arial, sans-serif',

    h1: {
      fontWeight: 800,
      letterSpacing: "-0.035em",
      lineHeight: 1.15,
    },

    h2: {
      fontWeight: 800,
      letterSpacing: "-0.03em",
      lineHeight: 1.2,
    },

    h3: {
      fontWeight: 750,
      letterSpacing: "-0.025em",
    },

    h4: {
      fontWeight: 750,
      letterSpacing: "-0.025em",
    },

    h5: {
      fontWeight: 700,
      letterSpacing: "-0.015em",
    },

    h6: {
      fontWeight: 700,
    },

    body1: {
      lineHeight: 1.7,
    },

    body2: {
      lineHeight: 1.65,
    },

    button: {
      fontWeight: 700,
      textTransform: "none",
    },
  },

  shape: {
    borderRadius: 14,
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#F7FAF9",
          color: "#223532",
          WebkitFontSmoothing: "antialiased",
        },

        "::selection": {
          backgroundColor: "#A8D5C5",
          color: "#205D51",
        },
      },
    },

    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },

      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 700,
          borderRadius: 11,
          minHeight: 40,
          padding: "8px 18px",
          transition:
            "background-color 0.2s ease, box-shadow 0.2s ease",
        },

        containedPrimary: {
          boxShadow:
            "0 4px 12px rgba(47, 125, 109, 0.16)",

          "&:hover": {
            boxShadow:
              "0 6px 18px rgba(47, 125, 109, 0.23)",
          },
        },

        outlinedPrimary: {
          borderColor: "#A8D5C5",

          "&:hover": {
            borderColor: "#2F7D6D",
            backgroundColor:
              "rgba(47, 125, 109, 0.04)",
          },
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          border: "1px solid #E3EBE7",
          boxShadow:
            "0 6px 24px rgba(30, 75, 61, 0.05)",
          backgroundImage: "none",
        },
      },
    },

    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 24,

          "&:last-child": {
            paddingBottom: 24,
          },
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: "#FFFFFF",

          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#DBE6E1",
          },

          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#A8D5C5",
          },

          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderWidth: 2,
          },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 9,
          fontWeight: 650,
        },
      },
    },

    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          alignItems: "center",
        },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
        },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 8,
          fontSize: "0.8rem",
        },
      },
    },
  },
});

export default theme;