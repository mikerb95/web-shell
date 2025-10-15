"use client";
import { motion, AnimatePresence } from "framer-motion";

/**
 * ScriptViewer
 * - Muestra el script actual con título y botón de copiar
 * - Cambia suavemente entre scripts con Framer Motion
 */
export default function ScriptViewer({ scripts, currentIndex, onCopy }) {
  const script = scripts[currentIndex] ?? { title: "Sin script", code: "-- No hay script disponible" };

  return (
    <motion.div
      className="bg-white text-sena-dark rounded-xl shadow-soft p-4 flex flex-col gap-3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">{script.title}</h3>
        <button
          className="px-3 py-1 rounded-md bg-sena-green text-white text-sm hover:opacity-90"
          onClick={() => onCopy?.(script.code)}
        >
          Copiar
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.pre
          key={currentIndex}
          className="bg-gray-100 rounded-lg p-3 overflow-auto text-sm border border-gray-200"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          transition={{ duration: 0.25 }}
        >
{script.code}
        </motion.pre>
      </AnimatePresence>

      <p className="text-xs text-gray-500">Tip: Usa el botón Ejecutar para enviar este SQL a la terminal.</p>
    </motion.div>
  );
}
