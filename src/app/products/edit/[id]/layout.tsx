"use client";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
export default function Layout({ children }: { children: React.ReactNode }) {
  return <LocalizationProvider dateAdapter={AdapterMoment}>{children}</LocalizationProvider>;
}
