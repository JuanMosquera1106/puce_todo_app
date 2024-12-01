export interface Tarea {
  id: string;
  nombre: string;
  prioridad: "Alta" | "Media" | "Baja";
  materia: string;
  fechaVencimiento: string;
  repetir?: string; // Ejemplo: "Diario", "Semanal"
  completada: boolean;
  pomodoro?: {
    duracion: number; // Duración en minutos
    descanso: number; // Tiempo de descanso en minutos
    intervalo: number; // Número de ciclos
  };
  instancias?: Tarea[]; // Instancias repetidas generadas
}
