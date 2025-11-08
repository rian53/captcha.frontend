import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { userService } from "services";
import { toast, Toaster } from "sonner";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Image from "next/image";
import { AlertBlock } from "@/components/shared/alert-block";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { CheckCircle } from "lucide-react";

export default Login;

function Login() {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [loginError, setLoginError] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [warningAccepted, setWarningAccepted] = useState(false);
  const [pendingRedirect, setPendingRedirect] = useState(null);
  const [emailCopied, setEmailCopied] = useState(false);
  const [prefilledEmail, setPrefilledEmail] = useState('');

  // Verificar se há erro de sessão expirada na URL e capturar email da URL
  useEffect(() => {
    if (router.query.error === 'session_expired') {
      toast.error('Sua sessão de pagamento expirou ou já foi utilizada. Faça login para continuar.');
    }
    
    // Capturar email da URL se existir
    if (router.query.email) {
      setPrefilledEmail(router.query.email);
    }
  }, [router.query.error, router.query.email]);

  const validationSchema = Yup.object().shape({
    email: Yup.string().required("E-mail é requerido"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, handleSubmit, formState, setValue } = useForm(formOptions);
  const { errors } = formState;

  // Atualizar o valor do formulário quando o email for preenchido automaticamente
  useEffect(() => {
    if (prefilledEmail) {
      setValue('email', prefilledEmail);
    }
  }, [prefilledEmail, setValue]);

  // Resetar o estado de aceitação do aviso sempre que o modal abrir
  useEffect(() => {
    if (showWarningModal) {
      setWarningAccepted(false);
    }
  }, [showWarningModal]);

  // Resetar o estado de aceitação dos termos sempre que o modal abrir
  useEffect(() => {
    if (showTermsModal) {
      setTermsAccepted(false);
    }
  }, [showTermsModal]);

  function onSubmit({ email }) {
    setLoginError(false);
    return userService
      .loginWithEmail(email)
      .then(() => {
        const userData = userService.userValue;
        
        // Verificar se já aceitou os termos
        const hasAcceptedTerms = localStorage.getItem('termsAccepted');
        
        // Se tem returnUrl na query, usa ela
        const returnUrl = router.query.returnUrl;
        const targetUrl = returnUrl || '/home';
        
        // Salvar o redirect pendente
        setPendingRedirect(targetUrl);
        
        if (!hasAcceptedTerms) {
          // Se não aceitou os termos, mostra o modal de termos primeiro
          setShowTermsModal(true);
        } else {
          // Se já aceitou os termos, mostra DIRETAMENTE o modal de aviso (SEMPRE obrigatório)
          setShowWarningModal(true);
        }
      })
      .catch((error) => {
        setLoginError(true);
      });
  }

  function handleAcceptTerms() {
    if (!termsAccepted) {
      toast.error('Debes aceptar los términos de uso para continuar');
      return;
    }
    
    // Salvar no localStorage que aceitou os termos
    localStorage.setItem('termsAccepted', 'true');
    setShowTermsModal(false);
    
    // Mostrar o modal de aviso importante
    setShowWarningModal(true);
  }

  function handleAcceptWarning() {
    if (!warningAccepted) {
      toast.error('Debes confirmar que has leído el aviso importante');
      return;
    }
    
    setShowWarningModal(false);
    
    // Redirecionar para a página pendente
    if (pendingRedirect) {
      router.replace(pendingRedirect);
    }
  }

  function handleCopyEmail() {
    navigator.clipboard.writeText('contacto@gcaptchas.site').then(() => {
      setEmailCopied(true);
      toast.success('Email copiado al portapapeles');
      setTimeout(() => {
        setEmailCopied(false);
      }, 2000);
    }).catch(() => {
      toast.error('No se pudo copiar el email');
    });
  }

  return (
    <>
      <Toaster position="top-right" richColors theme={resolvedTheme} />
      <div className="relative w-full min-h-screen flex items-start justify-center overflow-hidden pt-32">
        {/* Formulário centralizado */}
        <div className="w-full max-w-lg px-4 z-10">
          <div className="flex flex-col space-y-6">
            <div className="flex flex-col space-y-4 text-center">
              <div className="flex flex-row items-center justify-center gap-2">
                <Image 
                  src={resolvedTheme === 'dark' ? "/img/logo-white.png" : "/img/logo-black.png"} 
                  alt="EscalaPro Logo"
                  className="object-contain"
                  width={200}
                  height={200}
                />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">
                ¡Bienvenido!
              </h1>
              <p className="text-md text-muted-foreground">
                Accede al área de miembros con tu correo electrónico
              </p>
            </div>
            <div className="p-0">
              <form className="grid gap-6" onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-4">
                  {loginError && (
                    <AlertBlock type="error">
                      Verifica que el correo electrónico de compra sea el mismo que estás intentando usar para iniciar sesión
                    </AlertBlock>
                  )}
                  
                  {prefilledEmail && (
                    <AlertBlock type="info">
                      <div className="flex items-center gap-2">
                       
                        <span>Correo electrónico autocompletado: <strong>{prefilledEmail}</strong></span>
                      </div>
                    </AlertBlock>
                  )}
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Tu correo electrónico
                    </label>
                    <input
                      className="flex h-12 w-full rounded-xl bg-input px-4 py-2 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="tu@correo.com"
                      name="email"
                      type="email"
                      id="email"
                      {...register("email")}
                    />
                  </div>

                  <Button
                    className="h-12 w-full rounded-xl"
                    type="submit"
                  >
                    Entrar
                  </Button>
                </div>
              </form>
              
              {/* Termos de uso centralizado */}
              <div className="flex w-full justify-center mt-6">
                <p className="text-sm text-muted-foreground text-center">
                  Al utilizar la aplicación, aceptas nuestra{" "}
                  <a 
                    href="/terms" 
                    onClick={(e) => { e.preventDefault(); router.push('/terms'); }}
                    className="hover:underline cursor-pointer text-foreground font-medium"
                  >
                    Términos de uso
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Términos de Uso */}
      <Dialog open={showTermsModal} onOpenChange={() => {}}>
        <DialogContent className="max-w-[95vw] sm:max-w-[500px] max-h-[95vh] overflow-y-auto p-4 sm:p-6" onInteractOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
          <DialogHeader className="space-y-2 sm:space-y-4">
            <div className="flex justify-center">
              <Image 
                src="/img/logo.png" 
                alt="Logo"
                width={100}
                height={100}
                className="object-contain sm:w-[120px] sm:h-[120px]"
              />
            </div>
            <DialogTitle className="text-center text-xl sm:text-2xl">
              Términos de uso
            </DialogTitle>
            <DialogDescription className="text-center text-sm sm:text-base px-2">
              Para utilizar la aplicación, debes aceptar los términos y condiciones de uso.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 sm:space-y-6 py-2 sm:py-4">
            {/* Información de contacto destacada */}
            <AlertBlock type="warning">
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="font-normal text-sm sm:text-base">Información Importante de Contacto</div>
                <div>
                  <strong className="text-xs sm:text-sm">Cualquier duda o problema solo será respondido en el email:</strong>
                  <br />
                  <div className="mt-2">
                    <span 
                      className="font-mono bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-200 font-semibold px-2 py-1 rounded text-xs sm:text-sm cursor-pointer hover:bg-orange-200 dark:hover:bg-orange-800/70 transition-colors duration-200 flex items-center gap-2 inline-flex break-all"
                      onClick={handleCopyEmail}
                    >
                      {emailCopied ? (
                        <>
                          <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                          Copiado
                        </>
                      ) : (
                        'contacto@gcaptchas.site'
                      )}
                    </span>
                  </div>
                </div>
                <div>
                  <strong className="text-xs sm:text-sm">Ningún otro email acepta respuesta. Casos enviados a otros emails NO serán respondidos.</strong>
                </div>
              </div>
            </AlertBlock>

            {/* Aviso sobre contracargos */}
            <AlertBlock type="error">
              <div className="space-y-2 sm:space-y-3">
                <div className="font-semibold text-sm sm:text-base">🚨 NUNCA hagas esto:</div>
                <div className="space-y-1 text-xs sm:text-sm">
                  <div>❌ NO llames a tu banco pidiendo "devolución" o "cancelación del cargo"</div>
                  <div>❌ NO reportes la compra como "no reconocida"</div>
                  <div>❌ NO contactes directamente a tu tarjeta de crédito</div>
                </div>
                <div className="font-semibold text-sm sm:text-base mt-2 sm:mt-3">¿Por qué?</div>
                <div className="text-xs sm:text-sm">
                  Porque si pides la "devolución bancaria" (algunos le dicen "contracargo" o "disputar el cobro"):
                </div>
                <div className="space-y-1 text-xs sm:text-sm">
                  <div>💳 Tu banco puede BLOQUEAR tu tarjeta</div>
                  <div>📉 Afecta tu historial crediticio</div>
                  <div>⚠️ Pierdes la confianza del banco para futuras compras</div>
                  <div>🔒 El banco puede marcar tu cuenta como "riesgosa"</div>
                  <div>❌ Además, perderás el acceso al producto de inmediato</div>
                </div>
              </div>
            </AlertBlock>

            <div className="flex items-start space-x-2 sm:space-x-3 p-3 sm:p-4">
              <Switch 
                id="terms-switch"
                checked={termsAccepted}
                onCheckedChange={setTermsAccepted}
                className="mt-0.5 flex-shrink-0"
              />
              <Label 
                htmlFor="terms-switch" 
                className="text-xs sm:text-sm text-primary/90 font-normal leading-relaxed peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                Declaro que he leído y acepto las{" "}
                <a 
                  href="/terms" 
                  target="_blank"
                  className="text-blue-500 hover:underline font-semibold"
                  onClick={(e) => e.stopPropagation()}
                >
                  Condiciones de Uso
                </a>
                {" "}de la aplicación.
              </Label>
            </div>

            <div className="px-0 sm:px-2">
              <Button 
                onClick={handleAcceptTerms}
                className="w-full h-11 sm:h-12 text-sm sm:text-base font-semibold"
                disabled={!termsAccepted}
              >
                ACCEDER A LA APLICACIÓN
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Aviso Importante - Sempre exibido após login */}
      <Dialog open={showWarningModal} onOpenChange={() => {}}>
        <DialogContent className="max-w-[95vw] sm:max-w-[600px] max-h-[95vh] overflow-y-auto p-4 sm:p-6" onInteractOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
          <DialogHeader className="space-y-2 sm:space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <span className="text-4xl sm:text-5xl">🚨</span>
              </div>
            </div>
            <DialogTitle className="text-center text-xl sm:text-2xl font-bold text-red-600 dark:text-red-400">
              ¡AVISO MUY IMPORTANTE!
            </DialogTitle>
            <DialogDescription className="text-center text-sm sm:text-base px-2">
              Lee atentamente esta información para evitar problemas con tu cuenta y tu banco
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 sm:space-y-6 py-2 sm:py-4">
            {/* Aviso principal sobre contracargos */}
            <div className="bg-red-50 dark:bg-red-950/30 border-2 border-red-300 dark:border-red-700 rounded-lg p-3 sm:p-5 space-y-3 sm:space-y-5">
              <div className="space-y-3 sm:space-y-4 text-center">
                <div className="font-bold text-base sm:text-lg text-red-700 dark:text-red-300 flex items-center justify-center gap-2">
                  <span className="text-xl sm:text-2xl">🚨</span>
                  <span>NUNCA hagas esto:</span>
                </div>
                <div className="space-y-2 sm:space-y-3 text-left px-1 sm:px-2">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="text-red-600 dark:text-red-400 font-bold text-base sm:text-lg flex-shrink-0">❌</span>
                    <span className="text-xs sm:text-sm leading-relaxed">NO llames a tu banco pidiendo "devolución" o "cancelación del cargo"</span>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="text-red-600 dark:text-red-400 font-bold text-base sm:text-lg flex-shrink-0">❌</span>
                    <span className="text-xs sm:text-sm leading-relaxed">NO reportes la compra como "no reconocida"</span>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="text-red-600 dark:text-red-400 font-bold text-base sm:text-lg flex-shrink-0">❌</span>
                    <span className="text-xs sm:text-sm leading-relaxed">NO contactes directamente a tu tarjeta de crédito</span>
                  </div>
                </div>
              </div>

              <div className="border-t-2 border-red-300 dark:border-red-700 pt-3 sm:pt-5 space-y-3 sm:space-y-4">
                <div className="font-bold text-sm sm:text-base text-red-700 dark:text-red-300 text-center">¿Por qué?</div>
                <div className="text-xs sm:text-sm text-center px-1 sm:px-2 leading-relaxed">
                  Porque si pides la "devolución bancaria" (algunos le dicen "contracargo" o "disputar el cobro"):
                </div>
                <div className="space-y-2 sm:space-y-3 px-1 sm:px-2">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="text-lg sm:text-xl flex-shrink-0">💳</span>
                    <span className="text-xs sm:text-sm leading-relaxed"><strong>Tu banco puede BLOQUEAR tu tarjeta</strong></span>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="text-lg sm:text-xl flex-shrink-0">📉</span>
                    <span className="text-xs sm:text-sm leading-relaxed"><strong>Afecta tu historial crediticio</strong></span>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="text-lg sm:text-xl flex-shrink-0">⚠️</span>
                    <span className="text-xs sm:text-sm leading-relaxed"><strong>Pierdes la confianza del banco para futuras compras</strong></span>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="text-lg sm:text-xl flex-shrink-0">🔒</span>
                    <span className="text-xs sm:text-sm leading-relaxed"><strong>El banco puede marcar tu cuenta como "riesgosa"</strong></span>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="text-lg sm:text-xl flex-shrink-0">❌</span>
                    <span className="text-xs sm:text-sm leading-relaxed"><strong>Además, perderás el acceso al producto de inmediato</strong></span>
                  </div>
                </div>
              </div>

              <div className="bg-green-100 dark:bg-green-950/50 border-2 border-green-400 dark:border-green-700 rounded-lg p-3 sm:p-4">
                <div className="text-center space-y-2">
                  <div className="font-bold text-sm sm:text-base text-green-800 dark:text-green-300 flex items-center justify-center gap-2 flex-wrap">
                    <span className="text-lg sm:text-xl">✅</span>
                    <span>¿Necesitas ayuda o reembolso?</span>
                  </div>
                  <div className="text-xs sm:text-sm text-green-900 dark:text-green-200 leading-relaxed">
                    Contacta SOLO a través del email oficial:
                    <br />
                    <strong className="font-mono text-sm sm:text-base break-all">contacto@gcaptchas.site</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-2 sm:space-x-3 p-3 sm:p-4 bg-muted/50 rounded-lg">
              <Switch 
                id="warning-switch"
                checked={warningAccepted}
                onCheckedChange={setWarningAccepted}
                className="mt-0.5 flex-shrink-0"
              />
              <Label 
                htmlFor="warning-switch" 
                className="text-xs sm:text-sm font-medium leading-relaxed cursor-pointer text-left"
              >
                Confirmo que he leído y entendido este aviso importante. Entiendo que debo contactar únicamente al email oficial para cualquier problema o solicitud de reembolso.
              </Label>
            </div>

            <div className="px-0 sm:px-2">
              <Button 
                onClick={handleAcceptWarning}
                className="w-full h-11 sm:h-12 text-sm sm:text-base font-semibold"
                disabled={!warningAccepted}
              >
                HE LEÍDO Y ENTENDIDO - CONTINUAR
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
