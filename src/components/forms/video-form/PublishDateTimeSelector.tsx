
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, Clock } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface PublishDateTimeSelectorProps {
  publishDateTime: Date;
  onDateTimeChange: (date: Date) => void;
}

export const PublishDateTimeSelector: React.FC<PublishDateTimeSelectorProps> = ({
  publishDateTime,
  onDateTimeChange
}) => {
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      // Manter a hora atual e mudar apenas a data
      const newDateTime = new Date(publishDateTime);
      newDateTime.setFullYear(date.getFullYear());
      newDateTime.setMonth(date.getMonth());
      newDateTime.setDate(date.getDate());
      
      console.log('Data selecionada:', newDateTime);
      onDateTimeChange(newDateTime);
    }
  };

  const handleTimeChange = (timeString: string) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    if (!isNaN(hours) && !isNaN(minutes)) {
      const newDateTime = new Date(publishDateTime);
      newDateTime.setHours(hours);
      newDateTime.setMinutes(minutes);
      
      console.log('Hora alterada:', newDateTime);
      onDateTimeChange(newDateTime);
    }
  };

  const formatDate = (date: Date) => {
    return format(date, "dd/MM/yyyy", { locale: ptBR });
  };

  const formatTime = (date: Date) => {
    return format(date, "HH:mm");
  };

  return (
    <div className="space-y-2">
      <Label>Data e Horário de Publicação</Label>
      <div className="flex space-x-2">
        {/* Seletor de Data */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[200px] justify-start text-left font-normal"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formatDate(publishDateTime)}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={publishDateTime}
              onSelect={handleDateSelect}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>

        {/* Seletor de Hora */}
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-gray-500" />
          <Input
            type="time"
            value={formatTime(publishDateTime)}
            onChange={(e) => handleTimeChange(e.target.value)}
            className="w-[120px]"
          />
        </div>
      </div>
      <p className="text-xs text-gray-500">
        Selecione quando este vídeo deve ser publicado
      </p>
    </div>
  );
};
