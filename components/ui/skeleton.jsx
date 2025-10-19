import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

function Skeleton({
	className,
	...props
}) {
	const { resolvedTheme } = useTheme();
	
	const shimmerColor = 
		resolvedTheme === "dark" 
			? "rgba(255, 255, 255, 0.05)" 
			: "rgba(255, 255, 255, 0.8)";
	
	return (
		<div
			className={cn("relative rounded-md bg-muted overflow-hidden", className)}
			{...props}
		>
			<div className="skeleton-shine absolute inset-0" />
			
			<style jsx>{`
				.skeleton-shine {
					animation: shine 1.2s linear infinite;
					background: linear-gradient(
						90deg,
						transparent 0%,
						${shimmerColor} 50%,
						transparent 100%
					);
					transform: translateX(-100%);
				}
				
				@keyframes shine {
					to {
						transform: translateX(100%);
					}
				}
			`}</style>
		</div>
	);
}

export { Skeleton };
