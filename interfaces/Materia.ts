export interface Materia {
  id: string;
  time: string;
  event: string;
  color: string;
  duration: number; // duración en bloques
}

export interface Events {
  [time: string]: Materia; // Cambiado a Materia en lugar de Event
}

export interface DayEvents {
  [date: string]: Events;
}
