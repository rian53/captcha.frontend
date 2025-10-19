import { CodeEditor } from "@/components/shared/CodeEditor";
import {
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Toggle } from "@/components/ui/toggle";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";


export const Secrets = (props) => {
	const [isVisible, setIsVisible] = useState(true);
	const form = useFormContext();

	return (
		<>
			<CardHeader className="flex flex-row w-full items-center justify-between px-0">
				<div>
					<CardTitle className="text-xl">{props.title}</CardTitle>
					<CardDescription>{props.description}</CardDescription>
				</div>

				<Toggle
					aria-label="Toggle bold"
					pressed={isVisible}
					onPressedChange={setIsVisible}
				>
					{isVisible ? (
						<EyeOffIcon className="h-4 w-4 text-muted-foreground" />
					) : (
						<EyeIcon className="h-4 w-4 text-muted-foreground" />
					)}
				</Toggle>
			</CardHeader>
			<CardContent className="w-full space-y-4 p-0">
				<FormField
					control={form.control}
					name={props.name}
					render={({ field }) => (
						<FormItem className="w-full">
							<FormControl>
								<CodeEditor
									style={
										{
											WebkitTextSecurity: isVisible ? "disc" : null,
										}
									}
									language="properties"
									disabled={isVisible}
									lineWrapping
									placeholder={props.placeholder}
									className="h-96 font-mono"
									{...field}
								/>
							</FormControl>

							<FormMessage />
						</FormItem>
					)}
				/>
			</CardContent>
		</>
	);
};
