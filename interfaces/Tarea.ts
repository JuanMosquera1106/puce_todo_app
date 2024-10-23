export interface Tarea {
  id: string;
  nombre: string;
  prioridad: "Baja" | "Media" | "Alta";
  materia: string;
  fechaVencimiento: string;
  repetir?: string | null; // "Diario", "Semanal", etc. o null si no se repite
  recordatorio?: {
    hora: string;
    tipo: string; // "Diario", "Semanal", "Mensual", etc.
  } | null; // null si no hay recordatorio
  pomodoro?: {
    duracion: number; // En minutos
    descanso: number; // En minutos
    intervalo: number; // Número de ciclos
  };
  completada: boolean;
}
