import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";

export default function DatePicker({
  selected,
  onSelect,
  onClose,
  placeholder = "Selecione uma data",
  className = "",
  disabled = false,
  fromYear = 2000,           // ← Ano inicial
  toYear = 2050,             // ← Ano final
  defaultMonth,
  ...props
}) {
  const [open, setOpen] = useState(false);

  const handleSelect = (date) => {
    onSelect?.(date);
    setOpen(false);
    onClose?.();
  };

  const handleOpenChange = (isOpen) => {
    setOpen(isOpen);
    if (!isOpen) {
      onClose?.();
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`w-full justify-between font-normal text-muted-foreground ${className}`}
          disabled={disabled}
          {...props}
        >
          {selected ? selected.toLocaleDateString('pt-BR') : placeholder}
          <CalendarIcon className="w-4 h-4 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0 rounded-lg" align="start">
        <Calendar
          mode="single"
          selected={selected}
          captionLayout="dropdown"
          onSelect={handleSelect}
          fromYear={fromYear}      // ← Configura ano inicial
          toYear={toYear}          // ← Configura ano final
          defaultMonth={defaultMonth || selected}
        />
      </PopoverContent>
    </Popover>
  );
}

// Exemplo de uso com diferentes ranges
export function DatePickerExamples() {
  const [birthDate, setBirthDate] = useState();
  const [futureDate, setFutureDate] = useState();
  const [recentDate, setRecentDate] = useState();

  return (
    <div className="space-y-4 p-4">
      {/* Data de nascimento - 1900 a ano atual */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Data de Nascimento
        </label>
        <DatePicker
          selected={birthDate}
          onSelect={setBirthDate}
          placeholder="Selecione sua data de nascimento"
          fromYear={2000}
          toYear={new Date().getFullYear()}
          defaultMonth={new Date(1990, 0)} // Janeiro de 1990
        />
      </div>

      {/* Data futura - ano atual a 2100 */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Data de Vencimento
        </label>
        <DatePicker
          selected={futureDate}
          onSelect={setFutureDate}
          placeholder="Selecione a data de vencimento"
          fromYear={new Date().getFullYear()}
          toYear={2050}
        />
      </div>

      {/* Últimos 10 anos */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Data Recente
        </label>
        <DatePicker
          selected={recentDate}
          onSelect={setRecentDate}
          placeholder="Selecione uma data recente"
          fromYear={new Date().getFullYear() - 10}
          toYear={new Date().getFullYear()}
        />
      </div>
    </div>
  );
}