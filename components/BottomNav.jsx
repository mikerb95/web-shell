"use client";

/**
 * BottomNav
 * - Barra inferior fija con botones Anterior / Ejecutar / Siguiente
 */
export default function BottomNav({ onPrev, onNext, onRun, disabledPrev, disabledNext }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-sena-green text-white">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <button
          className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-md disabled:opacity-50"
          onClick={onPrev}
          disabled={disabledPrev}
        >
          ⏮️ Anterior
        </button>

        <button
          className="bg-white text-sena-dark font-semibold hover:opacity-90 px-5 py-2 rounded-md shadow"
          onClick={onRun}
        >
          ▶️ Ejecutar script actual
        </button>

        <button
          className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-md disabled:opacity-50"
          onClick={onNext}
          disabled={disabledNext}
        >
          ⏭️ Siguiente
        </button>
      </div>
    </nav>
  );
}
