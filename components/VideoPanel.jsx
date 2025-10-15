"use client";
import { motion } from "framer-motion";
import { useState } from "react";

/**
 * VideoPanel
 * - Muestra un iframe de YouTube con URL dinámica ingresada por el usuario o por props.
 * - Incluye un input para cambiar el video en tiempo real.
 */
export default function VideoPanel({ initialUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ" }) {
  const [url, setUrl] = useState(initialUrl);

  return (
    <motion.div
      className="bg-white text-sena-dark rounded-xl shadow-soft p-4 flex flex-col gap-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="aspect-video w-full overflow-hidden rounded-lg border border-gray-200">
        <iframe
          className="w-full h-full"
          src={url}
          title="YouTube video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>

      <div className="flex gap-2 items-center">
        <input
          type="text"
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sena-green"
          placeholder="Pega aquí una URL de YouTube (embed)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <span className="text-xs text-gray-500">URL dinámica</span>
      </div>
    </motion.div>
  );
}
