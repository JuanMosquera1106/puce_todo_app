import React, { createContext, useState, useContext, useCallback } from "react";
import { Tarea } from "../interfaces/Tarea";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";

// --- Generación de fechas repetidas ---
const generarFechasRepetidas = (tarea: Tarea): Tarea[] => {
  if (!tarea.repetir || tarea.repetir === "No repetir") return [];

  const instancias: Tarea[] = [];
  let fechaActual = moment(tarea.fechaVencimiento).subtract(1, "day");

  while (fechaActual.isSameOrAfter(moment().startOf("day"))) {
    if (
      (tarea.repetir === "Semanal" || tarea.repetir === "Mensual") &&
      fechaActual.isSame(moment(tarea.fechaVencimiento).subtract(1, "day"), "day")
    ) {
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

// --- Eliminar duplicados ---
const eliminarDuplicados = (tareas: Tarea[]): Tarea[] => {
  return [...new Map(tareas.map((t) => [t.id, t])).values()];
};

// --- Tipo para el contexto ---
type TareasContextType = {
  tareas: Tarea[];
  cargando: boolean;
  agregarTarea: (tarea: Tarea) => Promise<void>;
  actualizarTarea: (tarea: Tarea) => Promise<void>;
  completarTarea: (id: string) => void;
  eliminarTarea: (id: string) => void;
  setFiltroMateria: (materia: string | null) => void;
};

// --- Creación del contexto ---
const TareasContext = createContext<TareasContextType | undefined>(undefined);

export const useTareas = () => {
  const context = useContext(TareasContext);
  if (!context) {
    throw new Error("useTareas debe ser usado dentro de un TareasProvider");
  }
  return context;
};

// --- Proveedor del contexto ---
export const TareasProvider = ({ children }: { children: React.ReactNode }) => {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [cargando, setCargando] = useState(true);
  const [filtroMateria, setFiltroMateria] = useState<string | null>(null);

  // --- Guardar tareas en almacenamiento persistente ---
  const guardarTareasEnStorage = async (nuevasTareas: Tarea[]) => {
    try {
      const tareasSinDuplicados = eliminarDuplicados(nuevasTareas);
      await AsyncStorage.setItem("tareas", JSON.stringify(tareasSinDuplicados));
    } catch (error) {
      console.error("Error guardando tareas:", error);
    }
  };

  // --- Cargar tareas desde almacenamiento persistente ---
  const cargarTareasDesdeStorage = useCallback(async () => {
    try {
      const tareasGuardadas = await AsyncStorage.getItem("tareas");
      if (tareasGuardadas) {
        const tareasConInstancias = JSON.parse(tareasGuardadas);
        setTareas(tareasConInstancias);
      }
    } catch (error) {
      console.error("Error cargando tareas:", error);
    } finally {
      setCargando(false);
    }
  }, []);

  React.useEffect(() => {
    cargarTareasDesdeStorage();
  }, [cargarTareasDesdeStorage]);

  // --- Completar una tarea ---
  const completarTarea = (id: string): void => {
    const nuevasTareas = tareas.map((tarea) => {
      if (tarea.id === id) {
        return { ...tarea, completada: !tarea.completada };
      }

      return tarea;
    });

    setTareas(eliminarDuplicados(nuevasTareas));
    guardarTareasEnStorage(nuevasTareas);
  };

  // --- Eliminar una tarea ---
  const eliminarTarea = (id: string): void => {
    const nuevasTareas = tareas.filter((tarea) => tarea.id !== id);

    setTareas(nuevasTareas);
    guardarTareasEnStorage(nuevasTareas);
  };

  // --- Función para transformar la tarea al formato requerido para Supabase ---
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

  // --- Insertar tarea en Supabase ---
  const insertarTareaEnSupabase = async (tarea: Tarea) => {
    try {
      const tareaTransformada = transformarTarea(tarea);
      const response = await fetch(
        "https://pcbuevklhuyxcwyfazac.supabase.co/rest/v1/Tarea",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjYnVldmtsaHV5eGN3eWZhemFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE0OTk3NzMsImV4cCI6MjA0NzA3NTc3M30.jPRuol82X1rdiQLWAPrXUsXG-vTs65I_sNzQ-QUeDog",
          },
          body: JSON.stringify(tareaTransformada),
        }
      );
      if (!response.ok) {
        console.log("Error al insertar tarea en Supabase:", response.status);
        console.log(tareaTransformada);
      }
    } catch (e) {
      console.log("Error al enviar datos a Supabase", e);
    }
  };

  // --- Actualizar tarea en Supabase ---
  const actualizarTareaEnSupabase = async (tarea: Tarea) => {
    try {
      const tareaTransformada = transformarTarea(tarea);
      const response = await fetch(
        `https://pcbuevklhuyxcwyfazac.supabase.co/rest/v1/Tarea?id_async=eq.${tareaTransformada.id_async}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            apikey:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjYnVldmtsaHV5eGN3eWZhemFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE0OTk3NzMsImV4cCI6MjA0NzA3NTc3M30.jPRuol82X1rdiQLWAPrXUsXG-vTs65I_sNzQ-QUeDog",
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

  // --- Agregar tarea ---
  const agregarTarea = async (nuevaTarea: Tarea): Promise<void> => {
    const nuevasInstancias = generarFechasRepetidas(nuevaTarea);
    const nuevasTareas = [...tareas, nuevaTarea, ...nuevasInstancias];
    const tareasSinDuplicados = eliminarDuplicados(nuevasTareas);

    setTareas(tareasSinDuplicados);
    guardarTareasEnStorage(tareasSinDuplicados);

    await insertarTareaEnSupabase(nuevaTarea);

    for (const instancia of nuevasInstancias) {
      await insertarTareaEnSupabase(instancia);
    }
  };

  // --- Actualizar tarea ---
  const actualizarTarea = async (tareaActualizada: Tarea): Promise<void> => {
    // Filtra las tareas, eliminando instancias relacionadas con la tarea principal actualizada
    const tareasSinInstanciasPrevias = tareas.filter(
      (tarea) => !tarea.id.startsWith(`${tareaActualizada.id}-`)
    );
  
    // Generar nuevas instancias si cambian las propiedades clave
    const nuevasInstancias =
      tareaActualizada.repetir !== "No repetir"
        ? generarFechasRepetidas(tareaActualizada).map((instancia) => {
            // Mantener estado completado si ya existía
            const instanciaExistente = tareas.find((t) => t.id === instancia.id);
            return {
              ...instancia,
              completada: instanciaExistente?.completada || false,
            };
          })
        : [];
  
    // Actualizar la lista de tareas
    const nuevasTareas = [
      ...tareasSinInstanciasPrevias.filter((t) => t.id !== tareaActualizada.id), // Elimina la tarea principal vieja
      { ...tareaActualizada, instancias: nuevasInstancias }, // Agrega la tarea principal actualizada
      ...nuevasInstancias, // Agrega las nuevas instancias
    ];
  
    // Actualizar el estado y almacenamiento
    const tareasSinDuplicados = eliminarDuplicados(nuevasTareas);
    setTareas(tareasSinDuplicados);
    guardarTareasEnStorage(tareasSinDuplicados);
  
    // Actualizar en Supabase (tarea principal e instancias)
    await actualizarTareaEnSupabase(tareaActualizada);
    for (const instancia of nuevasInstancias) {
      await actualizarTareaEnSupabase(instancia);
    }
  };  

  // --- Aplicar filtro por materia ---
  const obtenerTareasFiltradas = useCallback(() => {
    if (!filtroMateria) return tareas;
    return tareas.filter((tarea) => tarea.materia === filtroMateria);
  }, [filtroMateria, tareas]);

  return (
    <TareasContext.Provider
      value={{
        tareas: obtenerTareasFiltradas(),
        cargando,
        agregarTarea,
        actualizarTarea,
        completarTarea,
        eliminarTarea,
        setFiltroMateria,
      }}
    >
      {children}
    </TareasContext.Provider>
  );
};
