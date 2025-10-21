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
        
        if (!hasAcceptedTerms) {
          // Se não aceitou os termos, mostra o modal
          setPendingRedirect(targetUrl);
          setShowTermsModal(true);
        } else {
          // Se já aceitou, redireciona diretamente
          router.replace(targetUrl);
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
    
    // Redirecionar para a página pendente
    if (pendingRedirect) {
      router.replace(pendingRedirect);
    }
  }

  function handleCopyEmail() {
    navigator.clipboard.writeText('contato@gcaptchas.online').then(() => {
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
      <Dialog open={showTermsModal} onOpenChange={(open) => !open && setShowTermsModal(false)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader className="space-y-4">
            <div className="flex justify-center">
              <Image 
                src="/img/logo.png" 
                alt="Logo"
                width={120}
                height={120}
                className="object-contain"
              />
            </div>
            <DialogTitle className="text-center text-2xl">
              Términos de uso
            </DialogTitle>
            <DialogDescription className="text-center text-base">
              Para utilizar la aplicación, debes aceptar los términos y condiciones de uso.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Información de contacto destacada */}
            <AlertBlock type="warning">
              <div className="space-y-2">
                <div className="font-normal">Información Importante de Contacto</div>
                <div>
                  <strong>Cualquier duda o problema solo será respondido en el email:</strong>
                  <br />
                  <div className="mt-2">
                    <span 
                      className="font-mono bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-200 font-semibold px-2 py-1 rounded text-sm cursor-pointer hover:bg-orange-200 dark:hover:bg-orange-800/70 transition-colors duration-200 flex items-center gap-2 inline-flex"
                      onClick={handleCopyEmail}
                    >
                      {emailCopied ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                          Copiado
                        </>
                      ) : (
                        'contato@gcaptchas.online'
                      )}
                    </span>
                  </div>
                </div>
                <div>
                  <strong>Ningún otro email acepta respuesta. Casos enviados a otros emails NO serán respondidos.</strong>
                </div>
              </div>
            </AlertBlock>

            <div className="flex items-center space-x-3 p-4">
              <Switch 
                id="terms-switch"
                checked={termsAccepted}
                onCheckedChange={setTermsAccepted}
              />
              <Label 
                htmlFor="terms-switch" 
                className="text-sm text-primary/90 font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
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

            <Button 
              onClick={handleAcceptTerms}
              className="w-full h-12 text-base font-semibold"
              disabled={!termsAccepted}
            >
              ACCEDER A LA APLICACIÓN
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
