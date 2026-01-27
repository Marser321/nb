"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="w-10 h-10" />; // Placeholder to avoid hydration mismatch
    }

    const isDark = theme === "dark";

    return (
        <div className="relative">
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className="w-10 h-10 rounded-full relative overflow-hidden transition-all duration-500 hover:bg-accent/20 border border-transparent hover:border-border"
                aria-label="Toggle Theme"
            >
                <AnimatePresence mode="wait" initial={false}>
                    {isDark ? (
                        <motion.div
                            key="dark"
                            className="absolute inset-0 flex items-center justify-center text-amber-400"
                            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                            animate={{ rotate: 0, opacity: 1, scale: 1 }}
                            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                        >
                            <Moon className="h-5 w-5 fill-current" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="light"
                            className="absolute inset-0 flex items-center justify-center text-orange-500"
                            initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                            animate={{ rotate: 0, opacity: 1, scale: 1 }}
                            exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                        >
                            <Sun className="h-5 w-5 fill-current" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </Button>
        </div>
    );
}
