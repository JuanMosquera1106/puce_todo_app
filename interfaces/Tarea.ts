export interface Tarea {
  id: string;
  nombre: string;
  prioridad: "Baja" | "Media" | "Alta";
  materia: string;
  fechaVencimiento: string;
  repetir: boolean;
  pomodoro?: {
    duracion: number; // En minutos
    descanso: number; // En minutos
    intervalo: number; // Número de ciclos
  };
}
