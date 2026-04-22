export const metadata = {
  title: "Horse Feeding Instruction Helper",
  description: "Starter app for four horses with fixed weights.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
