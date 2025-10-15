export const metadata = {
  title: "SENA Web SQL Shell",
  description: "Práctica interactiva de SQL en el navegador con sql.js",
};

import "../styles/globals.css";
import "xterm/css/xterm.css";

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-sena-dark text-white font-sans min-h-screen">
        {children}
      </body>
    </html>
  );
}
