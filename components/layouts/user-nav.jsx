import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CircleUserRoundIcon,
  ChevronsUpDown,
  HeadsetIcon,
  LogOutIcon,
} from "lucide-react";
import { useRouter } from "next/router";
import { ThemeSwitcher } from "../ui/themeSwitcher";
import { SidebarMenuButton } from "../ui/sidebar";
import { userService } from "services";
import { useState } from "react";

export const UserNav = () => {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // Obter dados do usuário diretamente do userService
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage
              src={userData?.user?.image || "/img/google.png"}
              alt={userData?.user?.image || ""}
            />
            <AvatarFallback className="rounded-lg">CN</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">
              {userData?.client?.name || userData?.user?.name || userData?.agent?.name}
            </span>
            <span className="truncate text-xs">
              {userData?.client?.email || userData?.user?.email || userData?.agent?.email || "Usuario"}
            </span>
          </div>
          <ChevronsUpDown className="ml-auto h-4 w-4" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-[260px] rounded-lg group-data-[collapsible=icon]:ml-10"
        side="bottom"
        align="start"
        sideOffset={4}
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
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <div className="flex items-center justify-between px-2 py-1.5">


          <DropdownMenuItem
            className="cursor-pointer -ml-2 flex items-center text-red-500"
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
          <DropdownMenuItem
            className="cursor-pointer flex items-center border rounded-lg"
            onClick={() => window.open("mailto:contato@gcaptchas.online?subject=Soporte - Consulta", "_blank")}
          >
            <HeadsetIcon className="mr-2 h-4 w-4" />
            Contáctanos
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
