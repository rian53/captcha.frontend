import React from "react";
import { IMaskInput } from "react-imask";
import { Controller, useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";

const PhoneInput = React.forwardRef(
	({ className, errorMessage, name, value, onChange, onBlur, ...props }, ref) => {
		// Tentar obter o contexto do formulário, se disponível
		let formContext = null;
		try {
			formContext = useFormContext();
		} catch {
			// Se não estiver dentro de um FormProvider, formContext será null
		}

		// Função para limpar o telefone (remover caracteres especiais)
		const cleanPhone = (phoneValue) => {
			if (!phoneValue) return "";
			return phoneValue.replace(/\D/g, "");
		};

		// Função para validar telefone brasileiro
		const validatePhone = (phoneValue) => {
			if (!phoneValue || phoneValue.trim() === "" || phoneValue === "+55 ") {
				return "Telefone é obrigatório";
			}
			
			const cleaned = cleanPhone(phoneValue);
			
			// Telefone brasileiro: 55 + DDD (2 dígitos) + número (8 ou 9 dígitos)
			// Total: 12 ou 13 dígitos (55 + 2 + 8/9)
			if (cleaned.length < 12) {
				return "Telefone deve ter pelo menos 10 dígitos + DDD";
			}
			if (cleaned.length > 13) {
				return "Telefone deve ter no máximo 11 dígitos + DDD";
			}
			if (!cleaned.startsWith("55")) {
				return "Código do país deve ser +55";
			}
			return null;
		};

		// Função para garantir formato +55 no início
		const ensureBrazilianFormat = (inputValue) => {
			if (!inputValue) return "+55 ";
			
			const cleaned = cleanPhone(inputValue);
			
			// Se não tem números suficientes, retorna apenas +55
			if (cleaned.length === 0) return "+55 ";
			
			// Se não começa com 55, adiciona
			if (!cleaned.startsWith("55")) {
				return `+55 ${inputValue.replace(/^\+?55?\s?/, "")}`;
			}
			
			// Se já está no formato correto, mantém
			if (inputValue.startsWith("+55")) {
				return inputValue;
			}
			
			// Adiciona +55 se necessário
			return `+55 ${inputValue.replace(/^\+?55\s?/, "")}`;
		};

		// Configurações da máscara para react-imask
		const maskOptions = {
			mask: "+55 (00) 00000-0000",
			definitions: {
				'0': /[0-9]/
			},
			placeholder: "+55 (11) 99999-9999",
			lazy: true
		};

		// Se estiver dentro de um FormProvider, usa Controller
		if (formContext && name) {
			const { control, formState: { errors } } = formContext;
			
			return (
				<Controller
					name={name}
					control={control}
					rules={{
						validate: validatePhone
					}}
					render={({ field: { onChange: fieldOnChange, onBlur: fieldOnBlur, value: fieldValue, name: fieldName } }) => (
						<>
							<IMaskInput
								{...maskOptions}
								value={fieldValue || ""}
								onAccept={(value, mask) => {
									let newValue = value;
									
									// Se o usuário deletou tudo, garantir que tenha pelo menos +55
									if (!newValue || newValue.length < 4) {
										newValue = "+55 ";
									}
									// Se não começa com +55, corrigir
									else if (!newValue.startsWith("+55")) {
										newValue = ensureBrazilianFormat(newValue);
									}
									
									fieldOnChange(newValue);
								}}
								onBlur={(e) => {
									// Garantir formato correto ao perder foco
									const formattedValue = ensureBrazilianFormat(e.target.value);
									fieldOnChange(formattedValue);
									fieldOnBlur(e);
								}}
								onFocus={(e) => {
									// Se estiver vazio, adicionar +55 ao focar
									if (!e.target.value) {
										fieldOnChange("+55 ");
									}
								}}
								inputRef={ref}
								name={fieldName}
								type="tel"
								className={cn(
									"flex h-10 w-full rounded-md bg-input px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border disabled:cursor-not-allowed disabled:opacity-50",
									className,
								)}
								{...props}
							/>
							{(errors[name] || errorMessage) && (
								<span className="text-sm text-red-600 text-secondary-foreground">
									{errors[name]?.message || errorMessage}
								</span>
							)}
						</>
					)}
				/>
			);
		}

		// Se não estiver dentro de FormProvider, funciona como input controlado normal
		return (
			<>
				<IMaskInput
					{...maskOptions}
					value={value || ""}
					onAccept={(value, mask) => {
						let newValue = value;
						
						// Se o usuário deletou tudo, garantir que tenha pelo menos +55
						if (!newValue || newValue.length < 4) {
							newValue = "+55 ";
						}
						// Se não começa com +55, corrigir
						else if (!newValue.startsWith("+55")) {
							newValue = ensureBrazilianFormat(newValue);
						}
						
						// Criar evento sintético com o valor formatado
						const syntheticEvent = {
							target: {
								name: name,
								value: newValue,
							},
						};
						
						onChange?.(syntheticEvent);
					}}
					onBlur={(e) => {
						// Garantir formato correto ao perder foco
						const formattedValue = ensureBrazilianFormat(e.target.value);
						
						const syntheticEvent = {
							...e,
							target: {
								...e.target,
								name: name || e.target.name,
								value: formattedValue,
							},
						};
						
						onChange?.(syntheticEvent);
						onBlur?.(e);
					}}
					onFocus={(e) => {
						// Se estiver vazio, adicionar +55 ao focar
						if (!e.target.value) {
							const syntheticEvent = {
								target: {
									name: name,
									value: "+55 ",
								},
							};
							onChange?.(syntheticEvent);
						}
					}}
					inputRef={ref}
					name={name}
					type="tel"
					className={cn(
						"flex h-10 w-full rounded-md bg-input px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border disabled:cursor-not-allowed disabled:opacity-50",
						className,
					)}
					{...props}
				/>
				{errorMessage && (
					<span className="text-sm text-red-600 text-secondary-foreground">
						{errorMessage}
					</span>
				)}
			</>
		);
	},
);

PhoneInput.displayName = "PhoneInput";

export { PhoneInput }; 