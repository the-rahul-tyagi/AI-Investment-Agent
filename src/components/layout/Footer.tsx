import Container from "./Container";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 py-10">
      <Container>
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div>
            <h2 className="text-lg font-semibold">
              AI Investment Research Agent
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Built with Next.js • LangGraph • Gemini
            </p>
          </div>

          <p className="text-sm text-slate-400">
            © 2026 Rahul Tyagi
          </p>
        </div>
      </Container>
    </footer>
  );
}