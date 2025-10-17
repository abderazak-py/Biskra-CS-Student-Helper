
import "./globals.css";
import ReactQueryProvider from "../../util/reactQueryProvider";



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      >

      <ReactQueryProvider>
          {children}
      </ReactQueryProvider>


      </body>
    </html>
  );
}
