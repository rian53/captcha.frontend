import { cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
	"inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
	{
		variants: {
			variant: {
				default:
					"border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
				secondary:
					"border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
				destructive:
					"border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
				red: "border-red-500/20 bg-red-500/10 text-red-500 select-none items-center whitespace-nowrap",
				yellow:
					"border-yellow-500/20 bg-yellow-500/10 text-yellow-500 select-none items-center whitespace-nowrap",
				orange:
					"border-orange-500/20 bg-orange-500/10 text-orange-500 select-none items-center whitespace-nowrap",
				google:
					"border-[#0b57d0]/20 bg-[#0b57d0] text-white hover:bg-[#0b57d0]/90 dark:bg-[#a8c7fa] dark:text-[#062e6f] dark:hover:bg-[#9ab8eb] select-none items-center whitespace-nowrap",

				gold:
					"border-transparent bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-[#AA771C] font-bold shadow-lg select-none items-center whitespace-nowrap",
				green:
					"border-green-500/20 bg-green-500/10 text-green-500 select-none items-center whitespace-nowrap",
                				blue: 
				    "border-blue-500/20 bg-blue-500/10 text-blue-500 select-none items-center whitespace-nowrap",
				pink:
					"border-pink-500/20 bg-pink-500/10 text-pink-500 select-none items-center whitespace-nowrap",
				purple:
					"border-purple-500/20 bg-purple-500/10 text-purple-500 select-none items-center whitespace-nowrap",
				blank:
					"border-transparent dark:bg-white/15 bg-black/15 text-foreground select-none items-center whitespace-nowrap",
				outline: "text-foreground",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

function Badge({ className, variant, ...props }) {
	return (
		<div className={cn(badgeVariants({ variant }), className)} {...props} />
	);
}

export { Badge, badgeVariants };
