//apps/front/components/Sidebar.jsx
import { ChevronRight } from "lucide-react";
import { MENU } from "@/utils/constants";
import { usePathname } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { useTheme } from "next-themes";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SIDEBAR_COOKIE_NAME,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { UserNav } from "../components/layouts/user-nav";


function isActiveRoute(opts) {
  const normalizedItemUrl = opts.itemUrl?.replace("/projects", "/project");
  const normalizedPathname = opts.pathname?.replace("/projects", "/project");

  if (!normalizedPathname) return false;

  if (normalizedPathname === normalizedItemUrl) return true;

  if (normalizedPathname.startsWith(normalizedItemUrl)) {
    const nextChar = normalizedPathname.charAt(normalizedItemUrl.length);
    return nextChar === "/";
  }

  return false;
}

function findActiveNavItem(navItems, pathname) {
  const found = navItems.find((item) =>
    item.isSingle !== false
      ? isActiveRoute({ itemUrl: item.url, pathname })
      : item.items.some((item) =>
          isActiveRoute({ itemUrl: item.url, pathname })
        )
  );

  if (found?.isSingle !== false) {
    return found;
  }

  return found?.items.find((item) =>
    isActiveRoute({ itemUrl: item.url, pathname })
  );
}

// Função para ler o cookie de forma síncrona e segura
function getSidebarStateFromCookie() {
  if (typeof document === 'undefined') return true; // Server-side default
  
  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${SIDEBAR_COOKIE_NAME}=`))
    ?.split("=")[1];
  
  const shouldOpen = cookieValue === undefined ? true : cookieValue === "true";
  console.log('📖 Reading cookie:', cookieValue, '→ shouldOpen:', shouldOpen); // Debug temporário
  
  return shouldOpen;
}

export default function SidebarLayout({ children }) {
  // Estado controlado da sidebar que sincroniza com o cookie
  const [sidebarOpen, setSidebarOpen] = useState(getSidebarStateFromCookie);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Função para salvar no cookie quando o estado mudar
  const handleSidebarChange = useCallback((open) => {
    console.log('🔧 Sidebar state changing to:', open); // Debug temporário
    setSidebarOpen(open);
    document.cookie = `${SIDEBAR_COOKIE_NAME}=${open}; path=/; max-age=${60 * 60 * 24 * 7}`;
    console.log('🍪 Cookie saved. Current cookies:', document.cookie); // Debug temporário
  }, []);
  
  // Hook do tema
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    // Marca como carregado - o estado já foi lido de forma síncrona
    setIsLoaded(true);
    
    // Adiciona classe para indicar que a hidratação foi concluída
    // Isso permite que as transições CSS sejam ativadas apenas após o carregamento
    const timer = setTimeout(() => {
      document.body.classList.add('hydrated');
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const pathname = usePathname();

  // Aguarda o carregamento inicial
  // Mantém a estrutura do layout mesmo durante carregamento para evitar layout shifts
  if (!isLoaded) {
    return (
      <div className="group/sidebar-wrapper flex min-h-svh has-[[data-variant=inset]]:bg-sidebar">
        {/* Placeholder da sidebar que mantém o estado correto do cookie */}
        <div className="hidden md:block">
          <div 
            className="duration-200 relative h-svh bg-transparent transition-[width] ease-out"
            style={{ 
              width: sidebarOpen ? "19.5rem" : "3rem" 
            }}
          />
        </div>
        <div className="flex-1 bg-background">
          <div className="w-full h-screen bg-background" />
        </div>
      </div>
    );
  }

  // Usa o menu direto sem filtragem de permissões
  const menuHome = MENU.home || [];
  const menuSettings = MENU.settings || [];

  const activeItem = findActiveNavItem(
    [...menuHome, ...menuSettings],
    pathname
  );

  return (
    <SidebarProvider
      open={sidebarOpen}
      onOpenChange={handleSidebarChange}
      style={{
        "--sidebar-width": "19.5rem",
        "--sidebar-width-mobile": "19.5rem",
      }}
      className={isLoaded ? "loaded" : ""}
    >
      <Sidebar collapsible="icon" variant="floating">
        <SidebarHeader>
          <button
            data-sidebar="menu-button"
            data-size="lg"
            data-active="false"
            className="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-none ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-12 text-sm group-data-[collapsible=icon]:!p-0 items-center justify-center"
          >
            <a
              className="flex items-center gap-2 p-1 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground group-data-[collapsible=icon]/35 rounded-lg"
              href="/home"
            >
              <div
                className="flex items-center justify-start rounded-lg transition-all
                w-40 h-40 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8"
                >
                  {/* Logo para quando a sidebar NÃO estiver colapsada */}
                  <img 
                    src={resolvedTheme === 'dark' ? "/img/logo-white.png" : "/img/logo-black.png"} 
                    alt="EscalaPro Logo"
                    className="h-auto w-auto max-h-full max-w-full object-contain -ml-12 object-right group-data-[collapsible=icon]:hidden"
                  />

                  {/* Logo para quando a sidebar estiver colapsada - logovault.png */}
                  <img 
                    src="/img/logo.png" 
                    alt="EscalaPro Logo"
                    className="h-9 w-9 object-contain hidden group-data-[collapsible=icon]:block"
                  />
                </div>
            </a>
          </button>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
           
            <SidebarMenu>
              {menuHome.map((item) => {
                const isSingle = item.isSingle !== false;
                const isActive = isSingle
                  ? isActiveRoute({ itemUrl: item.url, pathname })
                  : item.items.some((item) =>
                      isActiveRoute({ itemUrl: item.url, pathname })
                    );

                return (
                  <Collapsible
                    key={item.title}
                    asChild
                    defaultOpen={isActive}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      {isSingle ? (
                        <SidebarMenuButton
                          asChild
                          tooltip={item.title}
                          className={cn(isActive && "bg-border")}
                        >
                          <Link
                            href={item.url}
                            className="flex w-full items-center gap-2"
                          >
                            {item.icon && (
                              <item.icon
                                className={cn(isActive && "text-primary")}
                              />
                            )}
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      ) : (
                        <>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton
                              tooltip={item.title}
                              isActive={isActive}
                            >
                              {item.icon && <item.icon />}

                              <span>{item.title}</span>
                              {item.items?.length && (
                                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                              )}
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {item.items?.map((subItem) => (
                                <SidebarMenuSubItem key={subItem.title}>
                                  <SidebarMenuSubButton
                                    asChild
                                    className={cn(isActive && "bg-border")}
                                  >
                                    <Link
                                      href={subItem.url}
                                      className="flex w-full items-center"
                                    >
                                      {subItem.icon && (
                                        <span className="mr-2">
                                          <subItem.icon
                                            className={cn(
                                              "h-4 w-4 text-muted-foreground",
                                              isActive && "text-primary"
                                            )}
                                          />
                                        </span>
                                      )}
                                      <span>{subItem.title}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </>
                      )}
                    </SidebarMenuItem>
                  </Collapsible>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Configurações</SidebarGroupLabel>
            <SidebarMenu className="gap-1">
              {menuSettings.map((item) => {
                const isSingle = item.isSingle !== false;
                const isActive = isSingle
                  ? isActiveRoute({ itemUrl: item.url, pathname })
                  : item.items.some((item) =>
                      isActiveRoute({ itemUrl: item.url, pathname })
                    );

                return (
                  <Collapsible
                    key={item.title}
                    asChild
                    defaultOpen={isActive}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      {isSingle ? (
                        <SidebarMenuButton
                          asChild
                          tooltip={item.title}
                          className={cn(isActive && "bg-border")}
                        >
                          <Link
                            href={item.url}
                            className="flex w-full items-center gap-2"
                          >
                            {item.icon && (
                              <item.icon
                                className={cn(isActive && "text-primary")}
                              />
                            )}
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      ) : (
                        <>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton
                              tooltip={item.title}
                              isActive={isActive}
                            >
                              {item.icon && <item.icon />}

                              <span>{item.title}</span>
                              {item.items?.length && (
                                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                              )}
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {item.items?.map((subItem) => (
                                <SidebarMenuSubItem key={subItem.title}>
                                  <SidebarMenuSubButton
                                    asChild
                                    className={cn(isActive && "bg-border")}
                                  >
                                    <Link
                                      href={subItem.url}
                                      className="flex w-full items-center"
                                    >
                                      {subItem.icon && (
                                        <span className="mr-2">
                                          <subItem.icon
                                            className={cn(
                                              "h-4 w-4 text-muted-foreground",
                                              isActive && "text-primary"
                                            )}
                                          />
                                        </span>
                                      )}
                                      <span>{subItem.title}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </>
                      )}
                    </SidebarMenuItem>
                  </Collapsible>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu className="flex flex-col gap-2">
            <SidebarMenuItem className="group">
              <UserNav />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      {children}
    </SidebarProvider>
  );
}