import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export const StatusTooltip = ({ status, className }) => {
	return (
		<TooltipProvider delayDuration={0}>
			<Tooltip>
				<TooltipTrigger>
					{status === "idle" && (
						<div
							className={cn(
								"size-3.5 rounded-full bg-muted-foreground dark:bg-card",
								className
							)}
						/>
					)}
					{status === "error" && (
						<div
							className={cn("size-3.5 rounded-full bg-destructive", className)}
						/>
					)}
					{status === "done" && (
						<div
							className={cn("size-3.5 rounded-full bg-green-500", className)}
						/>
					)}
					{status === "running" && (
						<div
							className={cn("size-3.5 rounded-full bg-yellow-500", className)}
						/>
					)}
				</TooltipTrigger>
				<TooltipContent align="center">
					<span>
						{status === "idle" && "Idle"}
						{status === "error" && "Error"}
						{status === "done" && "Done"}
						{status === "running" && "Running"}
					</span>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};
