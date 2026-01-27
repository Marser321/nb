import Image from "next/image";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen w-full flex bg-background text-foreground transition-colors duration-500">
            {/* Sector Imagen (Desktop) - Izquierda */}
            <div className="hidden lg:relative lg:block lg:w-1/2 overflow-hidden bg-muted/10 dark:bg-zinc-900 border-r border-border/50 dark:border-white/5">
                {/* Imagen de fondo */}
                <Image
                    src="https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=1974&auto=format&fit=crop"
                    alt="Interior Barbería NB"
                    fill
                    className="object-cover opacity-80 dark:opacity-60 dark:mix-blend-overlay transition-all duration-700 hover:scale-105"
                    priority
                    sizes="50vw"
                />

                {/* Degradados y Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/50 to-transparent dark:from-black dark:via-black/50 dark:to-transparent z-10" />
                <div className="absolute inset-0 bg-noise opacity-10 dark:opacity-20 z-10 mix-blend-overlay" />

                {/* Contenido en Imagen */}
                <div className="absolute bottom-0 left-0 right-0 p-12 text-foreground dark:text-white z-20">
                    <h2 className="text-4xl font-bold mb-4 tracking-tight drop-shadow-md">
                        Tu Estilo, <br />
                        <span className="text-primary text-glow">Nuestra Pasión.</span>
                    </h2>
                    <blockquote className="text-lg text-muted-foreground dark:text-zinc-300 italic border-l-2 border-primary pl-4 max-w-md font-medium">
                        &quot;La excelencia en el cuidado personal comienza aquí.&quot;
                    </blockquote>
                </div>
            </div>

            {/* Sector Formulario - Derecha */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative overflow-hidden">
                {/* Ambient Lights (Spotlights) - Cleaner in light mode */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 dark:bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 dark:bg-primary/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                {/* Noise Texture */}
                <div className="absolute inset-0 bg-noise opacity-30 mix-blend-overlay z-0 pointer-events-none" />

                <div className="w-full max-w-md relative z-10">
                    {children}
                </div>
            </div>
        </div>
    );
}
