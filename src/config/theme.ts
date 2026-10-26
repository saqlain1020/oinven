"use client";
import { Roboto } from "next/font/google";
import { createTheme } from "@mui/material/styles";
import { Inter } from "next/font/google";

declare module "@mui/material/Divider" {
  interface DividerPropsVariantOverrides {
    light: true;
  }
}

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});
export const inter = Inter({ subsets: ["latin"] });
// Prime Tech palette: copper / bronze / brown
export const brandColors = {
  copper: "#C8864E",
  bronze: "#CD7F32",
  darkBrown: "#3B2416",
  espresso: "#1C140F",
  paper: "#2A1E17",
};
const themeColor = brandColors.copper;
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: themeColor,
      contrastText: brandColors.espresso,
    },
    secondary: {
      main: brandColors.bronze,
      contrastText: brandColors.espresso,
    },
    text: {
      primary: "#F2E6DA",
      secondary: "#BFA995",
    },
    background: {
      default: brandColors.espresso,
      paper: brandColors.paper,
    },
    divider: "rgba(200, 134, 78, 0.24)",
  },
  typography: {
    fontFamily: inter.style.fontFamily,
  },
  components: {
    MuiContainer: {
      defaultProps: {
        maxWidth: "xl",
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: `linear-gradient(90deg, ${brandColors.darkBrown} 0%, #8C5A32 55%, ${brandColors.copper} 100%)`,
          color: "#F2E6DA",
        },
      },
    },
    MuiAccordion: {
      defaultProps: {
        slotProps: {
          transition: {
            unmountOnExit: true,
          },
        },
      },
    },
    MuiDivider: {
      variants: [
        {
          props: {
            variant: "light",
          },
          style: {
            borderColor: "rgb(210,210,210)",
          },
        },
      ],
    },
  },
});

export default theme;
