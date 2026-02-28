export const metadata = {
  title: "Hout-Shop CMS — Sanity Studio",
  description: "Content management for Hout-Shop",
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, height: "100vh" }}>
        {children}
      </body>
    </html>
  );
}
