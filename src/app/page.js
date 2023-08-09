"use client";

export default function Home() {
  return (
    <main className="bg-bgd flex min-h-screen flex-col items-center justify-center h-screen">
      <div className="text-8xl text-btn">Bubble Talk!💬</div>
      <button
        className="bg-btn text-white p-5 rounded-xl mt-10 text-lg letsgo-btn hover:bg-btnh hover:text-eled"
        onClick={() => (window.location.href = "/login")}
      >
        Lets Go!
      </button>
    </main>
  );
}
