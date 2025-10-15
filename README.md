# SENA Web SQL Shell

App educativa (Next.js + Tailwind + Framer Motion + sql.js + xterm) para practicar SQL simulando una shell MySQL en el navegador, lista para desplegar en Vercel.

## Tecnologías
- Next.js (App Router)
- TailwindCSS
- Framer Motion
- sql.js (SQLite en WebAssembly) para ejecutar SQL en memoria
- xterm.js (terminal en el navegador)

## Desarrollo local

```bash
npm install
npm run dev
```

Abre http://localhost:3000

## Despliegue en Vercel
- Sube este repo a GitHub
- Importa el repositorio en Vercel
- Framework: Next.js (build y output por defecto)

## Notas técnicas
- sql.js carga su WASM desde CDN (`https://sql.js.org/dist/sql-wasm.wasm`) para simplificar el deploy en Vercel
- La base de datos está en memoria y se reinicia al recargar
- Comandos soportados: cualquier SQL válido para SQLite (CREATE, INSERT, SELECT, UPDATE, DELETE, etc.)
- Comando extra: `clear` para limpiar la terminal

## Estructura
```
/app
  layout.jsx
  page.jsx
/components
  BottomNav.jsx
  ScriptViewer.jsx
  TerminalSim.jsx
  VideoPanel.jsx
/styles
  globals.css
```

## Créditos de diseño
- Colores institucionales del SENA: verde `#009739`, gris oscuro `#1b1b1b`, acentos en naranja `#f57c00`.

