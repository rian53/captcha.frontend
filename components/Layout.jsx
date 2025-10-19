// components/Layout.jsx
import React from "react";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import SidebarLayout from "@/components/Sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { MENU } from "@/utils/constants";
import { Separator } from "@/components/ui/separator";
import BottomNav from "@/components/BottomNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CircleUserRoundIcon, LogOutIcon, HeadsetIcon } from "lucide-react";
import { useRouter } from "next/router";
import { userService } from "services";
import { ThemeSwitcher } from "@/components/ui/themeSwitcher";
import { useState } from "react";
function isActiveRoute(itemUrl, pathname) {
  const normalizedItemUrl = itemUrl?.replace("/projects", "/project");
  const normalizedPathname = pathname?.replace("/projects", "/project");
  if (!normalizedPathname) return false;
  return (
    normalizedPathname === normalizedItemUrl ||
    normalizedPathname.startsWith(`${normalizedItemUrl}/`)
  );
}

function findActiveNavItem(pathname) {
  const allItems = [...MENU.home, ...MENU.settings];
  for (const item of allItems) {
    if (item.isSingle !== false) {
      if (isActiveRoute(item.url, pathname)) return item;
    } else {
      const foundSub = item.items.find((sub) =>
        isActiveRoute(sub.url, pathname)
      );
      if (foundSub) return foundSub;
    }
  }
  return null;
}

export default function Layout({ children, component }) {
  const pathname = usePathname();
  const activeItem = findActiveNavItem(pathname);
  const isMobile = useIsMobile();
  const { resolvedTheme } = useTheme();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const userData = userService?.userValue;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await userService.logout();
    } catch (error) {
      console.error('Erro durante logout:', error);
      setIsLoggingOut(false);
    }
  };

  return (
    <SidebarLayout>
      <main className="relative flex min-h-svh overflow-auto  max-w-7xl mx-auto w-full flex-col bg-background peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow">
        <div className={`flex flex-col w-full gap-4 px-4 ${isMobile ? 'pt-0 pb-24' : 'pt-2 pb-2'}`}>
        
          {/* Header Mobile */}
          {isMobile && (
            <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b rounded-xl bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 -mx-4">
              <Link href="/home" className="flex items-center">
                <img 
                  src={resolvedTheme === 'dark' ? "/img/logo-white.png" : "/img/logo-black.png"} 
                  alt="Logo"
                  className="h-8 w-auto object-contain"
                />
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-full focus:outline-none hover:opacity-90 transition-opacity duration-200">
                    <div className="relative w-9 h-9 flex items-center justify-center">
                      {/* SVG da borda colorida do Google */}
                      <svg 
                        className="absolute inset-0 w-full h-full transition-transform duration-200" 
                        focusable="false" 
                        viewBox="0 0 40 40" 
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ opacity: 1 }}
                      >
                        <path d="M4.02,28.27C2.73,25.8,2,22.98,2,20c0-2.87,0.68-5.59,1.88-8l-1.72-1.04C0.78,13.67,0,16.75,0,20c0,3.31,0.8,6.43,2.23,9.18L4.02,28.27z" fill="#F6AD01"></path>
                        <path d="M32.15,33.27C28.95,36.21,24.68,38,20,38c-6.95,0-12.98-3.95-15.99-9.73l-1.79,0.91C5.55,35.61,12.26,40,20,40c5.2,0,9.93-1.98,13.48-5.23L32.15,33.27z" fill="#249A41"></path>
                        <path d="M33.49,34.77C37.49,31.12,40,25.85,40,20c0-5.86-2.52-11.13-6.54-14.79l-1.37,1.46C35.72,9.97,38,14.72,38,20c0,5.25-2.26,9.98-5.85,13.27L33.49,34.77z" fill="#3174F1"></path>
                        <path d="M20,2c4.65,0,8.89,1.77,12.09,4.67l1.37-1.46C29.91,1.97,25.19,0,20,0l0,0C12.21,0,5.46,4.46,2.16,10.96L3.88,12C6.83,6.08,12.95,2,20,2" fill="#E92D18"></path>
                      </svg>
                      {/* Avatar centralizado sobre o SVG */}
                      <Avatar className="relative h-12 w-12 border-2 border-background z-10">
                        <AvatarImage
                          src={userData?.user?.image || "/img/user-default.svg"}
                          alt={userData?.user?.name || "User"}
                        />
                        <AvatarFallback>
                          {userData?.client?.name?.charAt(0) || userData?.user?.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  className="w-64 rounded-lg"
                  align="end"
                  sideOffset={8}
                >
                  <div className="flex items-center justify-between px-2 py-1.5">
                    <DropdownMenuLabel className="flex flex-col min-w-0 flex-1">
                      <span className="truncate font-semibold max-w-[200px]">
                        {userData?.client?.name || userData?.user?.name || userData?.agent?.name || "Usuario"}
                      </span>
                      <span className="truncate text-xs font-normal text-muted-foreground max-w-[200px]">
                        {userData?.client?.email || userData?.user?.email || userData?.agent?.email || "Usuario"}
                      </span>
                    </DropdownMenuLabel>
                    <ThemeSwitcher />
                  </div>

                  <DropdownMenuSeparator />

                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      className="cursor-pointer flex items-center"
                      onClick={() => router.push(`/settings/profile`)}
                    >
                      <CircleUserRoundIcon className="mr-2 h-4 w-4" />
                      Perfil
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem
                      className="cursor-pointer flex items-center"
                      onClick={() => window.open("mailto:contato@gcaptchas.online?subject=Soporte - Consulta", "_blank")}
                    >
                      <HeadsetIcon className="mr-2 h-4 w-4" />
                      Contáctanos
                    </DropdownMenuItem>
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    className="cursor-pointer flex items-center text-red-500"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                  >
                    {isLoggingOut ? (
                      <>
                        <LogOutIcon className="mr-2 h-4 w-4 animate-spin" />
                        Saliendo...
                      </>
                    ) : (
                      <>
                        <LogOutIcon className="mr-2 h-4 w-4" />
                        Salir
                      </>
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </header>
          )}

          {/* Header Desktop */}
          {!isMobile && (
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
              <div className="flex items-center justify-between w-full px-4">
                <div className="flex items-center gap-2">
                  <SidebarTrigger className="-ml-1" />
                  <Separator orientation="vertical" className="mr-2 h-4" />
                  <nav aria-label="breadcrumb">
                    <ol className="flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5">
                      <li className="items-center gap-1.5 block">
                        <Link
                          className="transition-colors hover:text-foreground flex items-center gap-1.5"
                          href={activeItem?.url || "/"}
                        >
                         
                        </Link>
                      </li>
                      {pathname !== activeItem?.url && (
                        <>
                          <li
                            role="presentation"
                            aria-hidden="true"
                            className="[&>svg]:w-3.5 [&>svg]:h-3.5 block"
                          >
                            <ChevronRight />
                          </li>
                          <li className="text-foreground capitalize">
                            {component?.layoutName || pathname?.split("/").pop()}
                          </li>
                        </>
                      )}
                    </ol>
                  </nav>
                </div>
                
                {/* Avatar Dropdown Desktop */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 rounded-full focus:outline-none hover:opacity-90 transition-opacity duration-200">
                      <div className="relative w-9 h-9 flex items-center justify-center">
                        {/* SVG da borda colorida do Google */}
                        <svg 
                          className="absolute inset-0 w-full h-full transition-transform duration-200" 
                          focusable="false" 
                          viewBox="0 0 40 40" 
                          xmlns="http://www.w3.org/2000/svg"
                          style={{ opacity: 1 }}
                        >
                          <path d="M4.02,28.27C2.73,25.8,2,22.98,2,20c0-2.87,0.68-5.59,1.88-8l-1.72-1.04C0.78,13.67,0,16.75,0,20c0,3.31,0.8,6.43,2.23,9.18L4.02,28.27z" fill="#F6AD01"></path>
                          <path d="M32.15,33.27C28.95,36.21,24.68,38,20,38c-6.95,0-12.98-3.95-15.99-9.73l-1.79,0.91C5.55,35.61,12.26,40,20,40c5.2,0,9.93-1.98,13.48-5.23L32.15,33.27z" fill="#249A41"></path>
                          <path d="M33.49,34.77C37.49,31.12,40,25.85,40,20c0-5.86-2.52-11.13-6.54-14.79l-1.37,1.46C35.72,9.97,38,14.72,38,20c0,5.25-2.26,9.98-5.85,13.27L33.49,34.77z" fill="#3174F1"></path>
                          <path d="M20,2c4.65,0,8.89,1.77,12.09,4.67l1.37-1.46C29.91,1.97,25.19,0,20,0l0,0C12.21,0,5.46,4.46,2.16,10.96L3.88,12C6.83,6.08,12.95,2,20,2" fill="#E92D18"></path>
                        </svg>
                        {/* Avatar centralizado sobre o SVG */}
                        <Avatar className="relative h-12 w-12 border-2 border-background z-10">
                          <AvatarImage
                            src={userData?.user?.image || "/img/user-default.svg"}
                            alt={userData?.user?.name || "User"}
                          />
                        <AvatarFallback>
                          {userData?.client?.name?.charAt(0) || userData?.user?.name?.charAt(0) || "U"}
                        </AvatarFallback>
                        </Avatar>
                      </div>
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    className="w-64 rounded-lg"
                    align="end"
                    sideOffset={8}
                  >
                    <div className="flex items-center justify-between px-2 py-1.5">
                      <DropdownMenuLabel className="flex flex-col min-w-0 flex-1">
                        <span className="truncate font-semibold max-w-[200px]">
                          {userData?.client?.name || userData?.user?.name || userData?.agent?.name || "Usuario"}
                        </span>
                        <span className="truncate text-xs font-normal text-muted-foreground max-w-[200px]">
                          {userData?.client?.email || userData?.user?.email || userData?.agent?.email || "Usuario"}
                        </span>
                      </DropdownMenuLabel>
                      <ThemeSwitcher />
                    </div>

                    <DropdownMenuSeparator />

                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        className="cursor-pointer flex items-center"
                        onClick={() => router.push(`/settings/profile`)}
                      >
                        <CircleUserRoundIcon className="mr-2 h-4 w-4" />
                        Perfil
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem
                        className="cursor-pointer flex items-center"
                        onClick={() => window.open("mailto:contato@gcaptchas.online?subject=Soporte - Consulta", "_blank")}
                      >
                        <HeadsetIcon className="mr-2 h-4 w-4" />
                        Contáctanos
                      </DropdownMenuItem>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      className="cursor-pointer flex items-center text-red-500"
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                    >
                      {isLoggingOut ? (
                        <>
                          <LogOutIcon className="mr-2 h-4 w-4 animate-spin" />
                          Saliendo...
                        </>
                      ) : (
                        <>
                          <LogOutIcon className="mr-2 h-4 w-4" />
                          Salir
                        </>
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </header>
          )}

          {/* Conteúdo principal */}
          <div className="w-full">
            {children}
          </div>
        </div>

        {/* Bottom Navigation - apenas no mobile */}
        {isMobile && <BottomNav />}
      </main>
    </SidebarLayout>
  );
}
