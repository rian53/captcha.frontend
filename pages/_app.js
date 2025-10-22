// pages/_app.js
import Head from "next/head";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { userService, walletService } from "services";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/providers/theme-provider";
import Layout from "@/components/Layout";
import RefundModal from "@/components/wallet/RefundModal";
import { Onest } from "next/font/google";
import "@/styles/globals.css";
import "@/styles/dkp.css";
import "@/styles/virtuoso-stable.css";
import { useTheme } from "next-themes";

const ThemedToaster = () => {
  const { resolvedTheme } = useTheme();
  return (
    <Toaster
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      richColors
      position="top-right"
    />
  );
};

const onest = Onest({
  subsets: ["latin"],
  variable: "--font-onest",
});

// Rotas públicas que não precisam de autenticação
const PUBLIC_PATHS = [
  "/",
  "/account/login",
  "/account/recover",
  "/account/recover/[id]",
  "/terms",

];

export default function App({ Component, pageProps }) {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundChecked, setRefundChecked] = useState(false);

  const isPublicPath = PUBLIC_PATHS.includes(router.pathname);

  // Função simplificada para verificar redirecionamentos
  const checkRedirects = useCallback((currentUser, pathname) => {
    // Sem usuário em rota privada -> login
    if (!currentUser && !isPublicPath) {
      return { 
        shouldRedirect: true, 
        redirect: { pathname: "/account/login", query: { returnUrl: router.asPath } }
      };
    }

    return { shouldRedirect: false };
  }, [isPublicPath, router.asPath]);

  // Função de processamento de usuário (única)
  const processUser = useCallback((currentUser) => {
    setUser(currentUser);
    
    const { shouldRedirect, redirect } = checkRedirects(currentUser, router.pathname);
    
    if (shouldRedirect) {
      setAuthorized(false);
      if (typeof redirect === 'string') {
        router.replace(redirect);
      } else {
        router.replace(redirect);
      }
      return;
    }
    
    setAuthorized(true);
  }, [checkRedirects, router]);

  // Effect único para subscription do usuário
  useEffect(() => {
    const subscription = userService.user.subscribe((currentUser) => {
      processUser(currentUser);
      setLoading(false);
      
      // Verifica se precisa mostrar modal de refund
      if (currentUser && !refundChecked && !isPublicPath) {
        checkRefundStatus();
      }
    });

    return () => subscription.unsubscribe();
  }, [processUser, refundChecked, isPublicPath]);

  // Verifica se o usuário precisa ver o modal de refund
  const checkRefundStatus = async () => {
    try {
      const { hasRefund } = await walletService.checkRefund();
      if (!hasRefund) {
        setShowRefundModal(true);
      }
      setRefundChecked(true);
    } catch (error) {
      console.error("Error checking refund status:", error);
      setRefundChecked(true);
    }
  };

  const handleRefundSuccess = () => {
    setRefundChecked(true);
    setShowRefundModal(false);
    // Redireciona para a página de refund
    router.push('/refund');
  };

  // Effect simplificado para mudanças de rota sem desmontar o layout (evita flicker)
  useEffect(() => {
    const handleRouteChangeComplete = () => {
      const currentUser = userService.userValue;
      processUser(currentUser);
    };

    router.events.on("routeChangeComplete", handleRouteChangeComplete);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
    };
  }, [processUser, router.events]);

  const shouldShowLayout = user && !isPublicPath && authorized;

  return (
    <>
      <ThemeProvider>
          <Head>
            <title>Captcha</title>
          </Head>
          <ThemedToaster />
          <div className={`${onest.className} flex h-full w-full flex-col`}>
            {loading ? (
              null
            ) : isPublicPath ? (
              <Component {...pageProps} />
            ) : shouldShowLayout ? (
              <Layout component={Component}>
                <Component {...pageProps} />
              </Layout>
            ) : null}
          </div>

          {/* Refund Modal */}
          {user && !isPublicPath && (
            <RefundModal
              isOpen={showRefundModal}
              onClose={() => setShowRefundModal(false)}
              onSuccess={handleRefundSuccess}
            />
          )}
      </ThemeProvider>
    </>
  );
}
