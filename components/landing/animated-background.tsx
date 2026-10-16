/**
 * Background animé avec grille et effet aurora / lueur — partagé entre la landing et les pages d'auth.
 */
export function AnimatedBackground() {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
            {/* Fond de base sombre */}
            <div className="absolute inset-0 bg-[oklch(0.10_0.006_228.8)]" />

            {/* Grille de points subtile */}
            <div
                className="absolute inset-0 opacity-[0.18]"
                style={{
                    backgroundImage: `radial-gradient(circle, oklch(0.6 0.02 240) 1px, transparent 1px)`,
                    backgroundSize: "32px 32px",
                }}
            />
 
            {/* Aurora 1 – Indigo / Bleu */}
            <div
                className="absolute -top-40 -left-60 w-[700px] h-[700px] rounded-full"
                style={{
                    background:
                        "radial-gradient(ellipse at center, oklch(0.55 0.18 258 / 0.22) 0%, transparent 70%)",
                    filter: "blur(60px)",
                    animation: "aurora-1 18s ease-in-out infinite alternate",
                }}
            />

            {/* Aurora 2 – Violet / Purple */}
            <div
                className="absolute top-1/3 -right-40 w-[600px] h-[600px] rounded-full"
                style={{
                    background:
                        "radial-gradient(ellipse at center, oklch(0.50 0.20 295 / 0.20) 0%, transparent 70%)",
                    filter: "blur(80px)",
                    animation: "aurora-2 22s ease-in-out infinite alternate",
                }}
            />

            {/* Aurora 3 – Teal bas */}
            <div
                className="absolute bottom-0 left-1/4 w-[500px] h-[400px] rounded-full"
                style={{
                    background:
                        "radial-gradient(ellipse at center, oklch(0.65 0.14 190 / 0.14) 0%, transparent 70%)",
                    filter: "blur(70px)",
                    animation: "aurora-3 26s ease-in-out infinite alternate",
                }}
            />

            {/* Vignette sur les bords */}
            <div
                className="absolute inset-0"
                style={{
                    background:
                        "radial-gradient(ellipse 120% 80% at 50% 50%, transparent 40%, oklch(0.10 0.006 228.8 / 0.9) 100%)",
                }}
            />
        </div>
    );
}

export default AnimatedBackground;
