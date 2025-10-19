// components/BottomNav.jsx
import { Home, Wallet, GraduationCap, BanknoteArrowDown, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";

const navItems = [
  {
    title: "Búsquedas",
    url: "/home",
    icon: Home,
  },
  {
    title: "Cartera",
    url: "/wallet",
    icon: Wallet,
  },
  {
    title: "Cursos",
    url: "#",
    icon: GraduationCap,
  },
  {
    title: "Reembolso",
    url: "/refund",
    icon: BanknoteArrowDown,
  },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  const isActive = (url) => {
    return pathname === url || pathname.startsWith(`${url}/`);
  };

  const handleMenuClick = () => {
    setOpenMobile(true);
  };

  return (
    <nav className="md:hidden fixed inset-x-0 bottom-0 z-[100] bg-background border-t">      
      <div className="flex items-center justify-around h-16 px-2 bg-background">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.url);
          
          return (
            <Link
              key={item.url}
              href={item.url}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all duration-200",
                active 
                  ? "text-[#0b57d0] dark:text-[#a8c7fa] scale-105" 
                  : "text-muted-foreground hover:text-foreground hover:scale-105"
              )}
            >
              <div className={cn(
                "relative flex items-center justify-center",
                active && "animate-in fade-in zoom-in duration-200"
              )}>
                <Icon className="h-5 w-5 transition-all" />
                {active && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#0b57d0] dark:bg-[#a8c7fa] rounded-full animate-pulse" />
                )}
              </div>
              <span className={cn(
                "text-xs font-medium transition-all",
                active && "font-semibold"
              )}>
                {item.title}
              </span>
            </Link>
          );
        })}
        
        {/* Botão Menu que abre o sidebar */}
        <button
          onClick={handleMenuClick}
          className="flex flex-col items-center justify-center flex-1 h-full gap-1 text-muted-foreground hover:text-foreground hover:scale-105 transition-all duration-200"
        >
          <Menu className="h-5 w-5" />
          <span className="text-xs font-medium">Menú</span>
        </button>
      </div>

      {/* Safe area para dispositivos com notch/barra inferior */}
      <div className="h-[env(safe-area-inset-bottom)] min-h-[8px] bg-background" />
    </nav>
  );
}

