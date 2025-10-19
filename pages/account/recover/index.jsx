/* eslint-disable react/no-unescaped-entities */
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { userService } from "services";
import { toast, Toaster } from "sonner";
import { useTheme } from "next-themes";
import Image from "next/image";

export default function Recover() {
  const router = useRouter();
  const { resolvedTheme } = useTheme();

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Digite um e-mail válido")
      .required("E-mail é requerido"),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };

  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;

  async function onSubmit({ email }) {
    return userService
      .recover(email)
      .then(() => {
        toast.success("Um e-mail de recuperação foi enviado para você!");
        setTimeout(() => {
          router.push("/account/login");
        }, 3000);
      })
      .catch((error) => {
        const errorMessage = error.message || error;
        toast.error("Erro ao enviar e-mail de recuperação. Por favor, tente novamente.");
      });
  }

  return (
    <>
      <Toaster position="top-right" richColors theme={resolvedTheme} />
      <div>
        <div className="container relative min-h-svh flex-col items-center justify-center flex lg:max-w-none lg:grid lg:grid-cols-2 lg:px-0 w-full">
          <div className="relative hidden h-full flex-col  p-10 text-primary dark:border-r lg:flex">
            <div className="absolute inset-0 bg-muted"></div>
            <a
              className="relative z-20 flex items-center text-lg font-medium gap-4"
              href="#"
            >
            <Image 
                    src={resolvedTheme === 'dark' ? "/img/logo-por-extenso-v2.png" : "/img/logo-por-extenso.png"} 
                    alt="EscalaPro Logo"
                    className="object-contain group-data-[collapsible=icon]:hidden"
                    width={200}
                    height={200}
                  />

                  {/* Logo para quando a sidebar estiver colapsada - logovault.png */}
                  <Image 
                    src="/img/logovault.png" 
                    alt="EscalaPro Logo"
                    className="object-contain hidden group-data-[collapsible=icon]:block"
                    width={200}
                    height={200}
                  />            </a>
            <div className="relative z-20 mt-auto">
              <blockquote className="space-y-2">
              
              </blockquote>
            </div>
          </div>
          <div className="w-full">
            <div className="flex w-full flex-col justify-center space-y-6 max-w-lg mx-auto">
              <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                  <div className="flex flex-row items-center justify-center gap-2">
                   
                    Recuperar Senha
                  </div>
                </h1>
                <p className="text-sm text-muted-foreground">
                  Digite seu endereço de e-mail abaixo e enviaremos<br />
                  instruções para redefinir sua senha.
                </p>
              </div>
              <div className="p-0">
                <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Endereço de e-mail
                      </label>
                      <input
                        type="email"
                        className="flex h-10 w-full rounded-xl bg-input px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="john.doe@company.com"
                        name="email"
                        id="email"
                        {...register("email")}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                    <button
                      className="items-center justify-center whitespace-nowrap select-none rounded-full transition-all will-change-transform active:hover:scale-[0.98] active:hover:transform text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-[24px] py-[9px] w-full flex gap-2"
                      type="submit"
                      disabled={formState.isSubmitting}
                    >
                      {formState.isSubmitting ? 'Enviando...' : 'Enviar Instruções'}
                    </button>
                  </div>
                </form>

                <div className="flex flex-row justify-center mt-6">
                  <div className="text-sm flex flex-row justify-center gap-2">
                    <a
                      className="hover:underline text-muted-foreground inline-flex items-center"
                      href="/account/login"
                    >
                      <svg
                        className="h-4 w-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M15 19l-7-7 7-7" />
                      </svg>
                      Voltar para o login
                    </a>
                  </div>
                </div>
                
                <div className="p-2"></div>
                <div className="flex w-full justify-between mt-[48px]">
                  <div>
                    <a href="https://escalavault.pro/terms">
                      <p className="text-G030">Termos e condições</p>
                    </a>
                  </div>
                  <div className="flex gap-[12px]">
                    <a href="https://escalavault.pro/privacy">
                      <p className="text-G030">Privacidade</p>
                    </a>
                    <a target="_blank" href="https://escalavault.pro/support" rel="noreferrer">
                      <p className="text-G030">Suporte</p>
                    </a>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}