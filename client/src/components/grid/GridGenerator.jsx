import React from "react";

export default function GridGenerator() {
  return (
    <section className="w-full max-w-5xl mx-auto mt-12 px-4">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Grid Layout Generator
      </h2>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Grid Area */}
        <div className="flex-1 bg-gray-900 rounded-xl p-6 shadow-lg min-h-[340px] flex items-center justify-center">
          <div className="grid grid-cols-4 grid-rows-4 gap-2 w-full max-w-md aspect-square">
            {Array.from({ length: 16 }).map((_, i) => (
              <div
                key={i}
                className="bg-gray-800 border border-gray-700 rounded flex items-center justify-center text-gray-400"
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Code Output */}
        <div className="flex-1 bg-gray-900 rounded-xl p-4 shadow">
          <h3 className="font-semibold mb-2">Tailwind Code</h3>
          <pre className="bg-gray-800 rounded p-3 text-xs text-green-400 overflow-x-auto">
{`<div className="grid grid-cols-4 grid-rows-4 gap-2">
  ...
</div>`}
          </pre>
        </div>
      </div>
    </section>
  );
}
