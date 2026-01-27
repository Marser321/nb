"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Scissors, Phone, ArrowRight, Loader2, KeyRound, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { ROUTES } from "@/lib/constants";
import { Separator } from "@/components/ui/separator";

export default function LoginPage() {
    // Estado del flujo: 'EMAIL' (legacy) | 'PHONE_INPUT' | 'OTP_INPUT'
    // Por defecto arrancamos con 'PHONE_INPUT' tras la migración
    const [step, setStep] = useState<'PHONE_INPUT' | 'OTP_INPUT'>('PHONE_INPUT');
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleSendOtp = async (e: React.FormEvent | React.MouseEvent, channel: 'sms' | 'whatsapp' = 'sms') => {
        e.preventDefault();

        if (!phone) {
            toast.error("Ingresá tu número de celular");
            return;
        }

        // Validación básica de formato (Uruguay: 9 digits usually, allow international too)
        // Eliminamos espacios y guiones para limpiar
        const cleanPhone = phone.replace(/[\s-]/g, '');
        if (cleanPhone.length < 8) {
            toast.error("El número parece muy corto");
            return;
        }

        setIsLoading(true);

        const { error } = await supabase.auth.signInWithOtp({
            phone: cleanPhone,
            options: {
                channel: channel,
            },
        });

        if (error) {
            console.error(error);
            toast.error("Error al enviar el código: " + error.message);
            setIsLoading(false);
            return;
        }

        const appName = channel === 'whatsapp' ? 'WhatsApp' : 'SMS';
        toast.success(`¡Código enviado por ${appName}!`);
        setStep('OTP_INPUT');
        setIsLoading(false);
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!otp || otp.length < 6) {
            toast.error("El código debe tener 6 dígitos");
            return;
        }

        setIsLoading(true);

        const { error } = await supabase.auth.verifyOtp({
            phone: phone.replace(/[\s-]/g, ''),
            token: otp,
            type: 'sms',
        });

        if (error) {
            console.error(error);
            toast.error("Código incorrecto o expirado");
            setIsLoading(false);
            return;
        }

        toast.success("¡Bienvenido!");
        router.push(ROUTES.HOME);
        router.refresh();
    };

    return (
        <Card className="border-border/50 bg-white dark:bg-card/50 shadow-2xl dark:shadow-none backdrop-blur w-full max-w-md mx-auto transition-all duration-300">
            <CardHeader className="text-center">
                <Link href="/" className="flex items-center justify-center gap-2 mb-4">
                    <Scissors className="h-8 w-8 text-primary" />
                    <span className="text-2xl font-bold">
                        NB <span className="text-primary">Barber</span>
                    </span>
                </Link>
                <CardTitle className="text-2xl">
                    {step === 'PHONE_INPUT' ? 'Ingresar con Celular' : 'Verificar Código'}
                </CardTitle>
                <CardDescription>
                    {step === 'PHONE_INPUT'
                        ? 'Te enviaremos un código por SMS o WhatsApp'
                        : `Ingresá el código enviado a ${phone}`
                    }
                </CardDescription>
            </CardHeader>

            <CardContent>
                {step === 'PHONE_INPUT' ? (
                    <form onSubmit={handleSendOtp} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="phone">Número de Celular</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="+598 99 123 456"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="pl-10 text-lg tracking-wide"
                                    disabled={isLoading}
                                    autoFocus
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Incluí el código de país (ej: +598 para Uruguay).
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full flex gap-2 border-green-500/20 hover:bg-green-500/10 hover:text-green-500"
                                onClick={(e) => handleSendOtp(e, 'whatsapp')}
                                disabled={isLoading}
                            >
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageSquare className="h-4 w-4" />}
                                WhatsApp
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full flex gap-2"
                                onClick={(e) => handleSendOtp(e, 'sms')}
                                disabled={isLoading}
                            >
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Phone className="h-4 w-4" />}
                                SMS
                            </Button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="otp">Código de Verificación</Label>
                            <div className="relative">
                                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="otp"
                                    type="text"
                                    placeholder="123456"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="pl-10 text-center text-2xl tracking-[0.5em] font-mono"
                                    maxLength={6}
                                    disabled={isLoading}
                                    autoFocus
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Verificando...
                                </>
                            ) : (
                                <>
                                    Ingresar
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </Button>

                        <Button
                            type="button"
                            variant="ghost"
                            className="w-full text-sm"
                            onClick={() => setStep('PHONE_INPUT')}
                            disabled={isLoading}
                        >
                            Cambiar número
                        </Button>
                    </form>
                )}

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">Admin</span>
                        </div>
                    </div>
                    <div className="mt-4 text-center">
                        <Link href={ROUTES.ADMIN_LOGIN} className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            ¿Sos staff? Ingresá acá
                        </Link>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
