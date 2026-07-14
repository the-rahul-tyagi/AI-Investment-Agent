export default function GradientBackground() {
  return (
    <>
      <div className="absolute left-20 top-20 h-72 w-72 rounded-full bg-emerald-500/10 blur-[120px]" />

      <div className="absolute right-20 top-80 h-80 w-80 rounded-full bg-cyan-500/10 blur-[140px]" />

      <div className="absolute bottom-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-[160px]" />
    </>
  );
}