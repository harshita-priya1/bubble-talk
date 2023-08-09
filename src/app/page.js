"use client";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center h-screen">
      <div className="text-8xl">Bubble Talk!💬</div>
      <button
        className="bg-slate-400 text-black p-5 rounded-xl mt-10 text-lg letsgo-btn"
        onClick={() => (window.location.href = "/login")}
      >
        Lets Go!
      </button>
    </main>
  );
}
