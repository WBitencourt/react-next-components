"use client"

import { format, isValid, parse } from "date-fns"
import { Calendar as CalendarIcon, Eraser } from "lucide-react"
import { ptBR } from 'date-fns/locale'
import { useEffect, useRef, useState } from "react"

import { cn } from "@/utils/classname";
import { Button } from "@/components/shadcn/button"
import { Calendar } from "@/components/shadcn/calendar"
import { Input } from "@/components/shadcn/input"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/shadcn/popover"

interface DateProps {
  id?: string;
  name?: string;
  label?: string;
  className?: string;
  highlight?: boolean;
  value: Date | undefined;
  visible?: boolean;
  disabled?: boolean;
  onChange?: (value: Date | null) => void;
}

export function ComponentDate({
  id,
  name,
  label,
  highlight = false,
  className,
  value,
  onChange,
  visible = true,
  disabled = false,
}: DateProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState("");

  const hasValue = !!value;

  const normalizeStringDate = (date: string): string => {
    const digitsOnly = date.replace(/\D/g, "")
  
    let day = digitsOnly.slice(0, 2);
    let month = digitsOnly.slice(2, 4);
    const year = digitsOnly.slice(4, 8);
  
    // Limita o valor do mês para 1-12
    if (month.length === 2) {
      const monthNum = parseInt(month, 10);
      if (monthNum < 1) month = "01";
      else if (monthNum > 12) month = "12";
    }
  
    // Validação do dia baseado no mês e ano
    if (day.length === 2 && month.length === 2) {
      const dayNum = parseInt(day, 10);
      const monthNum = parseInt(month, 10);
      const yearNum = parseInt(year || "2023", 10); // Ano padrão para verificação se não estiver completo
  
      // Define o número máximo de dias no mês considerando anos bissextos para fevereiro
      const maxDays = new Date(yearNum, monthNum, 0).getDate(); // Dia 0 do mês seguinte retorna o último dia do mês atual
      if (dayNum < 1) day = "01";
      else if (dayNum > maxDays) day = maxDays.toString().padStart(2, "0");
    }
  
    let formattedDate = day;
    if (month.length > 0) {
      formattedDate += `/${month}`;
    }
    if (year.length > 0) {
      formattedDate += `/${year}`;
    }
  
    return formattedDate;
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = normalizeStringDate(e.target.value);
    setInputValue(value);

    if(value.length === 10) {
      const parsedDate = parse(value, "dd/MM/yyyy", new Date(), { locale: ptBR });
      
      if (onChange && isValid(parsedDate)) {
        onChange(parsedDate);
      }
    }
  };

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    if (value && isValid(value)) {
      setInputValue(format(value, "dd/MM/yyyy", { locale: ptBR }));
    }
  }, [value]);

  if (!visible) {
    return null;
  }
  
  return (
    <Popover
      open={open} 
      onOpenChange={setOpen}
    >
      <PopoverTrigger asChild>
        <Button
          id={id}
          name={name}
          variant="outline"
          disabled={disabled}
          className={cn(
            `${className} flex flex-col items-start justify-center gap-1 min-w-[200px] h-14 text-left font-normal`,
            !value && "text-muted-foreground"
          )}
        >
          {
            value ? (
              <label 
                data-has-value={hasValue}
                data-highlight={highlight}
                className="text-sm data-[has-value=true]:text-xs data-[highlight=true]:text-red-500"
              >
                { label }
              </label>
            ) : null
          }

          <div className="flex">
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span 
              data-highlight={highlight}
              className="data-[highlight=true]:text-red-500"
            >
              {
                value ? 
                format(value, "P", { locale: ptBR }) 
                : 
                <span>{ label }</span>
              }
            </span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4">
        <div className="flex gap-2 items-center">
          <Input
            ref={inputRef}
            placeholder="dd/mm/aaaa"
            value={inputValue}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                setOpen(false);
              }
            }}
            onChange={handleInputChange}
          />
          <Eraser 
            onClick={() => {
              setInputValue("");
              
              onChange?.(null);
            }}
            className="h-6 w-6 cursor-pointer text-blue-500 hover:text-blue-700" 
          />
        </div>
        <Calendar
          mode="single"
          selected={value}
          locale={ptBR}
          onSelect={(value) => {
            onChange?.(value || null);

            setOpen(false);
          }}
          autoFocus={false}
        />
        <button
          className="w-full mt-2 p-2 text-sm text-white bg-blue-700 rounded-md"
          onClick={() => {
            setInputValue("");

            onChange?.(null);
          }}
        >
          Limpar
        </button>
        <button
          className="w-full mt-2 p-2 text-sm text-white bg-green-700 rounded-md"
          onClick={() => {
            setOpen(false);
          }}
        >
          Confirmar
        </button>
      </PopoverContent>
    </Popover>
  )
}
