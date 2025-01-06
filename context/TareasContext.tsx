import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Tarea } from "../interfaces/Tarea";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";

// Función para generar las fechas repetidas de la tarea
const generarFechasRepetidas = (tarea: Tarea): Tarea[] => {
  if (!tarea.repetir || tarea.repetir === "No repetir") return [];

  const instancias: Tarea[] = [];
  let fechaActual = moment(tarea.fechaVencimiento).subtract(1, "day");

  while (fechaActual.isSameOrAfter(moment().startOf("day"))) {
    if (fechaActual.isSame(moment(tarea.fechaVencimiento), "day")) {
      fechaActual.subtract(1, tarea.repetir === "Semanal" ? "week" : "month");
      continue;
    }

    instancias.push({
      ...tarea,
      id: `${tarea.id}-${fechaActual.format("YYYY-MM-DD")}`,
      fechaVencimiento: fechaActual.format("YYYY-MM-DD"),
      repetir: "No repetir",
      completada: false,
    });

    switch (tarea.repetir) {
      case "Diario":
        fechaActual.subtract(1, "day");
        break;
      case "Semanal":
        fechaActual.subtract(1, "week");
        break;
      case "Mensual":
        fechaActual.subtract(1, "month");
        break;
    }
  }

  return instancias.reverse();
};

// Eliminar tareas duplicadas
const eliminarDuplicados = (tareas: Tarea[]): Tarea[] => {
  return [...new Map(tareas.map((t) => [t.id, t])).values()];
};

// Interfaz para los eventos del día
interface DayEvents {
  [date: string]: {
    [time: string]: Tarea | null;
  };
}

type TareasContextType = {
  tareas: Tarea[];
  dayEvents: DayEvents;
  setDayEvents: React.Dispatch<React.SetStateAction<DayEvents>>;
  cargando: boolean;
  agregarTarea: (tarea: Tarea) => Promise<void>;
  actualizarTarea: (tarea: Tarea) => Promise<void>;
  completarTarea: (id: string) => void;
  eliminarTarea: (id: string) => void;
  setFiltroMateria: (materia: string | null) => void;
  agregarTareaAlCalendario: (tarea: Tarea, time: string, date: string) => void;
};

const TareasContext = createContext<TareasContextType | undefined>(undefined);

// Hook para usar el contexto de tareas
export const useTareas = () => {
  const context = useContext(TareasContext);
  if (!context) {
    throw new Error("useTareas debe ser usado dentro de un TareasProvider");
  }
  return context;
};

// Proveedor del contexto de tareas
export const TareasProvider = ({ children }: { children: React.ReactNode }) => {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [dayEvents, setDayEvents] = useState<DayEvents>({});
  const [cargando, setCargando] = useState(true);
  const [filtroMateria, setFiltroMateria] = useState<string | null>(null);

  // Cargar tareas y eventos desde almacenamiento local (AsyncStorage)
  const cargarTareasDesdeStorage = useCallback(async () => {
    try {
      const tareasGuardadas = await AsyncStorage.getItem("tareas");
      const dayEventsGuardados = await AsyncStorage.getItem("dayEvents");

      if (tareasGuardadas) {
        setTareas(JSON.parse(tareasGuardadas));
      }
      if (dayEventsGuardados) {
        setDayEvents(JSON.parse(dayEventsGuardados));
      }
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarTareasDesdeStorage();
  }, [cargarTareasDesdeStorage]);

  useEffect(() => {
    async function saveData() {
      await AsyncStorage.setItem("tareas", JSON.stringify(tareas));
      await AsyncStorage.setItem("dayEvents", JSON.stringify(dayEvents));
    }
    saveData();
  }, [tareas, dayEvents]);

  // Función para transformar la tarea al formato necesario para Supabase
  const transformarTarea = (tarea: Tarea) => {
    const { id, pomodoro, ...resto } = tarea;
    return {
      ...resto,
      id_async: id, // Usar id como id_async en Supabase
      duracion: pomodoro?.duracion ?? null,
      descanso: pomodoro?.descanso ?? null,
      intervalo: pomodoro?.intervalo ?? null,
    };
  };

    // Función para aplicar el filtro
    const obtenerTareasFiltradas = useCallback(() => {
      if (!filtroMateria) return tareas; // Si no hay filtro, retorna todas las tareas
      return tareas.filter((tarea) => tarea.materia === filtroMateria);
    }, [filtroMateria, tareas]);

  // Insertar tarea en Supabase
  const insertarTareaEnSupabase = async (tarea: Tarea) => {
    try {
      const tareaTransformada = transformarTarea(tarea);
      const response = await fetch(
        "https://pcbuevklhuyxcwyfazac.supabase.co/rest/v1/Tarea",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjYnVldmtsaHV5eGN3eWZhemFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE0OTk3NzMsImV4cCI6MjA0NzA3NTc3M30.jPRuol82X1rdiQLWAPrXUsXG-vTs65I_sNzQ-QUeDog",
          },
          body: JSON.stringify(tareaTransformada),
        }
      );
      if (!response.ok) {
        console.log("Error al insertar tarea en Supabase:", response.status);
        console.log(tareaTransformada);
      } else {
        console.log("Tarea insertada en Supabase:", tareaTransformada);
      }
    } catch (e) {
      console.log("Error al enviar datos a Supabase", e);
      console.log(tarea);
    }
  };

  // Actualizar tarea en Supabase
  const actualizarTareaEnSupabase = async (tarea: Tarea) => {
    try {
      const tareaTransformada = transformarTarea(tarea);
      const response = await fetch(
        `https://pcbuevklhuyxcwyfazac.supabase.co/rest/v1/Tarea?id_async=eq.${tareaTransformada.id_async}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjYnVldmtsaHV5eGN3eWZhemFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE0OTk3NzMsImV4cCI6MjA0NzA3NTc3M30.jPRuol82X1rdiQLWAPrXUsXG-vTs65I_sNzQ-QUeDog",
          },
          body: JSON.stringify(tareaTransformada),
        }
      );
      if (!response.ok) {
        console.log("Error al actualizar tarea en Supabase:", response.status);
      }
    } catch (e) {
      console.log("Error al enviar datos a Supabase para actualizar", e);
    }
  };

  // Agregar tarea (también maneja las instancias repetidas)
  const agregarTarea = async (nuevaTarea: Tarea): Promise<void> => {
    const nuevasInstancias = generarFechasRepetidas(nuevaTarea);
    const nuevasTareas = [...tareas, nuevaTarea, ...nuevasInstancias];
    const tareasSinDuplicados = eliminarDuplicados(nuevasTareas);

    setTareas(tareasSinDuplicados);
    await AsyncStorage.setItem("tareas", JSON.stringify(tareasSinDuplicados));

    await insertarTareaEnSupabase(nuevaTarea);

    for (const instancia of nuevasInstancias) {
      await insertarTareaEnSupabase(instancia);
    }
  };

  // Actualizar tarea
  const actualizarTarea = async (tareaActualizada: Tarea): Promise<void> => {
    const tareasFiltradas = tareas.filter((t) => t.id !== tareaActualizada.id && !t.id.startsWith(`${tareaActualizada.id}-`));
    const nuevasInstancias = tareaActualizada.repetir !== "No repetir"
      ? generarFechasRepetidas(tareaActualizada)
      : [];

    const nuevasTareas = [
      ...tareasFiltradas,
      { ...tareaActualizada, instancias: nuevasInstancias },
      ...nuevasInstancias,
    ];

    const tareasSinDuplicados = eliminarDuplicados(nuevasTareas);
    setTareas(tareasSinDuplicados);
    await AsyncStorage.setItem("tareas", JSON.stringify(tareasSinDuplicados));

    await actualizarTareaEnSupabase(tareaActualizada);
    for (const instancia of nuevasInstancias) {
      await actualizarTareaEnSupabase(instancia);
    }
  };

  // Marcar tarea como completada
  const completarTarea = (id: string): void => {
    const nuevasTareas = tareas.map((tarea) => {
      if (tarea.id === id) {
        return { ...tarea, completada: !tarea.completada };
      }
      return tarea;
    });

    setTareas(eliminarDuplicados(nuevasTareas));
    AsyncStorage.setItem("tareas", JSON.stringify(nuevasTareas));
  };

  // Eliminar tarea
  const eliminarTarea = (id: string): void => {
    const nuevasTareas = tareas.filter((tarea) => !(tarea.id === id || tarea.id.startsWith(`${id}-`)));
    setTareas(nuevasTareas);
    AsyncStorage.setItem("tareas", JSON.stringify(nuevasTareas));
  };

  // Agregar tarea a los eventos del calendario
  const agregarTareaAlCalendario = (tarea: Tarea, time: string, date: string) => {
    setDayEvents((prev) => {
      const updatedDayEvents = { ...prev };
      if (!updatedDayEvents[date]) updatedDayEvents[date] = {};
      updatedDayEvents[date][time] = tarea;
      return updatedDayEvents;
    });
  };

  return (
    <TareasContext.Provider
      value={{
        tareas: obtenerTareasFiltradas(), // Solo devuelve tareas filtradas
        dayEvents,
        setDayEvents,
        cargando,
        agregarTarea,
        actualizarTarea,
        completarTarea,
        eliminarTarea,
        setFiltroMateria,
        agregarTareaAlCalendario,
      }}
    >
      {children}
    </TareasContext.Provider>
  );
};
