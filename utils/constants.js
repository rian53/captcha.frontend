import {
	Home,
	Wallet,
	HeartIcon,
	BadgeHelpIcon,
	User,
	BanknoteArrowDown,
	HandCoins,	
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
			title: "Retiros",
			url: "/withdraw",
			icon: BanknoteArrowDown ,
		},
		{
			isSingle: true,
			title: "Reembolso",
			url: "/refund",
			icon: HandCoins,
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