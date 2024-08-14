"use client";

import PersistentDrawerLeft from "src/components/Drawer/Drawer";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PersistentDrawerLeft>
      {children} <ProgressBar height="4px" color="white" options={{ showSpinner: false }} shallowRouting />
    </PersistentDrawerLeft>
  );
}
