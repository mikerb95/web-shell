"use client";
import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import initSqlJs from "sql.js";

/**
 * TerminalSim
 * - Terminal estilo MySQL que ejecuta SQL en el navegador usando sql.js
 * - Expone una función imperative handle `runExternal(sql)` para ejecutar desde fuera
 */
const TerminalSim = forwardRef(function TerminalSim({ onReady }, ref) {
  const containerRef = useRef(null);
  const termRef = useRef(null);
  const dbRef = useRef(null);
  const fitAddonRef = useRef(null);
  const [ready, setReady] = useState(false);

  // Buffer para la línea actual
  const lineBufferRef = useRef("");
  const PROMPT = "mysql> ";

  useImperativeHandle(ref, () => ({
    async runExternal(sql) {
      if (!ready) return;
      // Mostrar como si el usuario lo hubiera escrito
      termRef.current?.write(`\r\n${PROMPT}${sql}\r\n`);
      await runSQL(sql);
      printPrompt();
    }
  }), [ready]);

  useEffect(() => {
    let term;
    const setup = async () => {
      // Inicializa terminal
      term = new Terminal({
        cursorBlink: true,
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        theme: {
          background: '#000000',
          foreground: '#00ff72',
          cursor: '#00ff72'
        }
      });
      const fit = new FitAddon();
      fitAddonRef.current = fit;
      term.loadAddon(fit);
      term.open(containerRef.current);
      termRef.current = term;
      fit.fit();

      // Inicializa sql.js (usa el WASM hospedado por CDN si Vercel no lo empaqueta)
      const SQL = await initSqlJs({
        // Nota: sql.js buscará el archivo wasm en esta URL
        locateFile: (file) => `https://sql.js.org/dist/${file}`
      });
      dbRef.current = new SQL.Database();

      writeWelcome();
      setReady(true);
      onReady?.();

      term.onKey(({ key, domEvent }) => {
        const printable = !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;
        if (domEvent.key === 'Enter') {
          const cmd = lineBufferRef.current.trim();
          term.write("\r\n");
          handleCommand(cmd);
          lineBufferRef.current = "";
          printPrompt();
        } else if (domEvent.key === 'Backspace') {
          if (lineBufferRef.current.length > 0) {
            // Borra último carácter del buffer y la terminal
            lineBufferRef.current = lineBufferRef.current.slice(0, -1);
            term.write("\b \b");
          }
        } else if (printable && key) {
          lineBufferRef.current += key;
          term.write(key);
        }
      });

      const resize = () => {
        try { fit.fit(); } catch { /* noop */ }
      };
      window.addEventListener('resize', resize);
    };

    setup();

    return () => {
      // remove resize listener with the same reference
      try { window.removeEventListener('resize', resize); } catch {}
      try { term?.dispose(); } catch {}
      try { dbRef.current?.close(); } catch {}
    };
  }, []);

  function printPrompt() {
    termRef.current?.write(`\r\n${PROMPT}`);
  }

  function writeWelcome() {
    const msg = [
      "Bienvenido a la Shell MySQL educativa (simulada)",
      "Escribe comandos SQL. Ej: CREATE TABLE, INSERT, SELECT...",
      "Nota: La base de datos está en memoria (sql.js)",
      "",
    ].join("\r\n");
    termRef.current?.write(msg);
    printPrompt();
  }

  function print(text) {
    termRef.current?.write(text.replace(/\n/g, "\r\n"));
  }

  async function handleCommand(cmd) {
    if (!cmd) return;
    // Comando especial: clear
    if (cmd.toLowerCase() === 'clear') {
      termRef.current?.clear();
      writeWelcome();
      return;
    }
    await runSQL(cmd);
  }

  async function runSQL(sql) {
    try {
      // Permite múltiples sentencias separadas por ;
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(Boolean);

      for (const stmt of statements) {
        const result = dbRef.current.exec(stmt); // devuelve un array de resultados
        if (!result || result.length === 0) {
          print("OK\r\n");
        } else {
          for (const r of result) {
            renderResultTable(r);
          }
        }
      }
    } catch (e) {
      print(`Error: comando inválido\r\n`);
    }
  }

  function renderResultTable(res) {
    const { columns, values } = res; // values: array de filas
    // Render simple como tabla ASCII
    const colWidths = columns.map((c, i) => Math.max(c.length, ...values.map(v => String(v[i] ?? '').length)));
    const sep = '+' + colWidths.map(w => '-'.repeat(w + 2)).join('+') + '+\r\n';

    let out = sep;
    out += '|' + columns.map((c, i) => ' ' + c.padEnd(colWidths[i]) + ' ').join('|') + '|\r\n';
    out += sep;
    for (const row of values) {
      out += '|' + columns.map((_, i) => ' ' + String(row[i] ?? '').padEnd(colWidths[i]) + ' ').join('|') + '|\r\n';
    }
    out += sep;
    print(out);
  }

  return (
    <div className="bg-black rounded-xl shadow-soft p-2 border border-gray-700 h-full">
      <div ref={containerRef} className="h-[420px] md:h-[600px] w-full" />
      {!ready && (
        <div className="text-center text-sm text-gray-300 py-2">Cargando terminal y base de datos...</div>
      )}
    </div>
  );
});

export default TerminalSim;
