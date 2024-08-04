import PersistentDrawerLeft from "src/components/Drawer/Drawer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <PersistentDrawerLeft>{children}</PersistentDrawerLeft>;
}
