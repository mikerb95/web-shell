"use client";
import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import VideoPanel from "../components/VideoPanel";
import ScriptViewer from "../components/ScriptViewer";
import TerminalSim from "../components/TerminalSim";
import BottomNav from "../components/BottomNav";

export default function Page() {
  // Scripts de ejemplo para practicar
  const scripts = useMemo(() => ([
    {
      title: "Crear tabla Estudiantes",
      code: `CREATE TABLE Estudiantes (
  id INTEGER PRIMARY KEY,
  nombre TEXT NOT NULL,
  programa TEXT,
  edad INTEGER
);`,
    },
    {
      title: "Insertar datos",
      code: `INSERT INTO Estudiantes (id, nombre, programa, edad) VALUES
(1, 'Ana', 'ADSO', 21),
(2, 'Luis', 'Contabilidad', 19),
(3, 'María', 'Cocina', 23);`,
    },
    {
      title: "Consultar todos",
      code: `SELECT * FROM Estudiantes;`,
    },
    {
      title: "Filtro por edad",
      code: `SELECT nombre, programa FROM Estudiantes WHERE edad >= 21;`,
    },
    {
      title: "Actualizar un registro",
      code: `UPDATE Estudiantes SET programa = 'Diseño' WHERE id = 2;\nSELECT * FROM Estudiantes;`,
    },
    {
      title: "Eliminar un registro",
      code: `DELETE FROM Estudiantes WHERE id = 3;\nSELECT * FROM Estudiantes;`,
    },
  ]), []);

  const [index, setIndex] = useState(0);
  const termRef = useRef(null);

  const canPrev = index > 0;
  const canNext = index < scripts.length - 1;

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Script copiado al portapapeles");
    } catch {}
  };

  const runCurrent = () => {
    const sql = scripts[index]?.code ?? '';
    termRef.current?.runExternal(sql);
  };

  return (
    <div className="min-h-screen pb-20">{/* espacio para navbar fija */}
      <header className="py-5">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            SENA Web SQL Shell
          </h1>
          <p className="text-gray-300">Aprende y practica SQL de forma interactiva en el navegador.</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div className="flex flex-col gap-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <VideoPanel />
          <ScriptViewer scripts={scripts} currentIndex={index} onCopy={handleCopy} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <TerminalSim ref={termRef} />
        </motion.div>
      </main>

      <BottomNav
        onPrev={() => setIndex((i) => Math.max(0, i - 1))}
        onNext={() => setIndex((i) => Math.min(scripts.length - 1, i + 1))}
        onRun={runCurrent}
        disabledPrev={!canPrev}
        disabledNext={!canNext}
      />
    </div>
  );
}
