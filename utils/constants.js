import {
	Home,
	Bell,
	Wallet,
	HeartIcon,
	BadgeHelpIcon,
	User,
	GraduationCap,
	BanknoteArrowDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const MENU = {
	home: [
		{
			isSingle: true,
			title: "Búsquedas",
			url: "/home",
			icon: Home,
		},
		{
			isSingle: true,
			title: "Cartera",
			url: "/wallet",
			icon: Wallet,
		},
		{
			isSingle: true,
			title: "Cursos",
			url: "#",
			icon: GraduationCap,
		},
		{
			isSingle: true,
			title: "Reembolso",
			url: "/refund",
			icon: BanknoteArrowDown,
		},
	],

	settings: [
		{
			isSingle: true,
			title: "Perfil",
			url: `/settings/profile`,
			icon: User,
		}
	],

	help: [
		{
			name: "Ajuda & Suporte",
			url: "https://wa.me/17727107622?text=Olá, preciso de ajuda e suporte",
			icon: BadgeHelpIcon,
		},
		{
			name: "Feedback",
			url: "https://wa.me/17727107622?text=Olá, gostaria de enviar um feedback",
			icon: ({ className }) => (
				<HeartIcon
					className={cn(
						"text-red-500 fill-red-600 animate-heartbeat",
						className,
					)}
				/>
			),
		},
	],
};