import React, { createContext, useState, useContext, useCallback } from "react";
import { Tarea } from "../interfaces/Tarea";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Para almacenamiento persistente

type TareasContextType = {
  tareas: Tarea[];
  cargando: boolean;
  agregarTarea: (tarea: Tarea) => void;
  actualizarTarea: (tarea: Tarea) => void;
  setFiltroMateria: (materia: string | null) => void;
};

const TareasContext = createContext<TareasContextType | undefined>(undefined);

export const useTareas = () => {
  const context = useContext(TareasContext);
  if (!context) {
    throw new Error("useTareas debe ser usado dentro de un TareasProvider");
  }
  return context;
};

export const TareasProvider = ({ children }: { children: React.ReactNode }) => {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [cargando, setCargando] = useState(true); // Estado de carga
  const [intentoCargar, setIntentoCargar] = useState(false); // Controlar múltiples cargas

  // Guardar tareas en AsyncStorage
  const guardarTareasEnStorage = async (nuevasTareas: Tarea[]) => {
    try {
      await AsyncStorage.setItem("tareas", JSON.stringify(nuevasTareas));
    } catch (e) {
      console.error("Error guardando las tareas", e);
    }
  };

  // Memorizar cargarTareasDesdeStorage para evitar múltiples renderizados innecesarios
  const cargarTareasDesdeStorage = useCallback(async () => {
    if (intentoCargar) return; // Evitar múltiples cargas
    try {
      const tareasGuardadas = await AsyncStorage.getItem("tareas");
      if (tareasGuardadas) {
        setTareas(JSON.parse(tareasGuardadas));
      }
    } catch (e) {
      console.error("Error cargando las tareas", e);
    } finally {
      setCargando(false); // Deja de cargar cuando finaliza
      setIntentoCargar(true); // Marcar como intentado
    }
  }, [intentoCargar]); // Dependencia para evitar recargar si ya se intentó cargar

  // Cargar tareas cuando se monta el componente
  React.useEffect(() => {
    cargarTareasDesdeStorage();
  }, [cargarTareasDesdeStorage]); // Incluir la función en el array de dependencias

  // Función para mapear el ID de la materia al nombre (event)
  const mapearMateria = async (materiaId: string): Promise<string | null> => {
    try {
      const materiasGuardadas = await AsyncStorage.getItem("materiasGlobales");
      if (materiasGuardadas) {
        const materias = JSON.parse(materiasGuardadas);
        const materiaEncontrada = materias.find(
          (materia: { id: string; event: string }) => materia.id === materiaId
        );
        return materiaEncontrada ? materiaEncontrada.event : null; // Retorna el nombre de la materia
      }
    } catch (error) {
      console.error("Error al mapear materia:", error);
    }
    return null; // Retornar null si no se encuentra la materia
  };

  // Función para transformar la tarea al formato requerido para Supabase
  const transformarTarea = async (tarea: Tarea) => {
    const { id, pomodoro, materia, ...resto } = tarea;
    const materiaNombre = await mapearMateria(materia); // Mapear ID a nombre de materia
    return {
      ...resto,
      id_async: id, // Cambiar id a id_async
      materia: materiaNombre || materia, // Usar el nombre mapeado o mantener el ID
      duracion: pomodoro?.duracion ?? null,
      descanso: pomodoro?.descanso ?? null,
      intervalo: pomodoro?.intervalo ?? null,
    };
  };

  // Insertar tarea en Supabase
  const insertarTareaEnSupabase = async (tarea: Tarea) => {
    try {
      const tareaTransformada = await transformarTarea(tarea); // Transformar el formato
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
        console.error("Error al insertar tarea en Supabase:", response.status);
        console.log(tareaTransformada); // Mostrar tarea para depuración
      }
    } catch (e) {
      console.error("Error al enviar datos a Supabase", e);
    }
  };

  // Actualizar tarea en Supabase
  const actualizarTareaEnSupabase = async (tarea: Tarea) => {
    try {
      const tareaTransformada = await transformarTarea(tarea); // Transformar el formato
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
        console.error("Error al actualizar tarea en Supabase:", response.status);
      }
    } catch (e) {
      console.error("Error al enviar datos a Supabase para actualizar", e);
    }
  };

  const agregarTarea = async (tarea: Tarea) => {
    const nuevasTareas = [...tareas, tarea];
    setTareas(nuevasTareas);
    guardarTareasEnStorage(nuevasTareas); // Guardamos en AsyncStorage
    await insertarTareaEnSupabase(tarea); // Insertar en Supabase
  };

  const actualizarTarea = async (tareaActualizada: Tarea) => {
    const nuevasTareas = tareas.map((t) =>
      t.id === tareaActualizada.id ? tareaActualizada : t
    );
    setTareas(nuevasTareas);
    guardarTareasEnStorage(nuevasTareas); // Guardamos en AsyncStorage
    await actualizarTareaEnSupabase(tareaActualizada); // Actualizar en Supabase
  };

  const [filtroMateria, setFiltroMateria] = useState<string | null>(null);

  // Función para aplicar el filtro
  const obtenerTareasFiltradas = useCallback(() => {
    if (!filtroMateria) return tareas; // Si no hay filtro, retorna todas las tareas
    return tareas.filter((tarea) => tarea.materia === filtroMateria);
  }, [filtroMateria, tareas]);

  return (
    <TareasContext.Provider
      value={{
        tareas: obtenerTareasFiltradas(), // Solo devuelve tareas filtradas
        cargando,
        agregarTarea,
        actualizarTarea,
        setFiltroMateria, // Exponemos el setter del filtro
      }}
    >
      {children}
    </TareasContext.Provider>
  );
};
