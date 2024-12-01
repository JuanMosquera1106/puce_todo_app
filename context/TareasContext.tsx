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
  agregarTarea: (tarea: Tarea) => void;
  actualizarTarea: (tarea: Tarea) => void;
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
  }, [cargarTareasDesdeStorage]); // Incluir la función en el array de dependencias

  const agregarTarea = (tarea: Tarea) => {
    const nuevasTareas = [...tareas, tarea];
    setTareas(nuevasTareas);
    guardarTareasEnStorage(nuevasTareas); // Guardamos en AsyncStorage
  };

  const actualizarTarea = (tareaActualizada: Tarea) => {
    const nuevasTareas = tareas.map((t) =>
      t.id === tareaActualizada.id ? tareaActualizada : t,
    );
    setTareas(nuevasTareas);
    guardarTareasEnStorage(nuevasTareas); // Guardamos en AsyncStorage
  };

  const eliminarTarea = (id: string) => {
    const nuevasTareas = tareas.filter((tarea) => tarea.id !== id);
    setTareas(nuevasTareas);
    guardarTareasEnStorage(nuevasTareas); // Guardamos en AsyncStorage
  };

  const [filtroMateria, setFiltroMateria] = useState<string | null>(null);

  // Función para aplicar el filtro
  const obtenerTareasFiltradas = useCallback(() => {
    if (!filtroMateria) return tareas; // Si no hay filtro, retornar todas
    return tareas.filter((tarea) => tarea.materia === filtroMateria);
  }, [filtroMateria, tareas]);

  return (
    <TareasContext.Provider
    value={{
      tareas: obtenerTareasFiltradas(), // Solo devuelve tareas filtradas
      cargando,
      agregarTarea,
      actualizarTarea,
      eliminarTarea,
      setFiltroMateria, // Exponemos el setter del filtro
    }}
  >
    {children}
  </TareasContext.Provider>

  );
};
