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

      if (tarea.instancias) {
        const nuevasInstancias = tarea.instancias.map((instancia) =>
          instancia.id === id
            ? { ...instancia, completada: !instancia.completada }
            : instancia
        );
        return { ...tarea, instancias: nuevasInstancias };
      }

      return tarea;
    });

    setTareas(eliminarDuplicados(nuevasTareas));
    guardarTareasEnStorage(nuevasTareas);
  };

  // --- Eliminar una tarea y sus instancias ---
  const eliminarTarea = (id: string): void => {
    const nuevasTareas = tareas.filter((tarea) => {
      if (tarea.id === id) return false;

      if (tarea.instancias) {
        tarea.instancias = tarea.instancias.filter((instancia) => instancia.id !== id);
      }

      return true;
    });

    setTareas(nuevasTareas);
    guardarTareasEnStorage(nuevasTareas);
  };

  // --- Agregar una nueva tarea ---
  const agregarTarea = (nuevaTarea: Tarea): void => {
    const nuevasInstancias = generarFechasRepetidas(nuevaTarea);
    const nuevasTareas = [...tareas, nuevaTarea, ...nuevasInstancias];
    setTareas(eliminarDuplicados(nuevasTareas));
    guardarTareasEnStorage(nuevasTareas);
  };

  // --- Actualizar una tarea ---
  const actualizarTarea = (tareaActualizada: Tarea): void => {
    const nuevasTareas = tareas.map((tarea) => {
      // Si es la tarea principal (sin id con fecha)
      if (tarea.id === tareaActualizada.id && !tarea.id.includes("-")) {
        // Regenerar las instancias desde cero
        const nuevasInstancias =
          tareaActualizada.repetir !== "No repetir"
            ? generarFechasRepetidas(tareaActualizada).map((instancia) => {
                // Buscar si la instancia ya estaba completada y mantener ese estado
                const instanciaExistente = tarea.instancias?.find(
                  (i) => i.id === instancia.id
                );
                return instanciaExistente && instanciaExistente.completada
                  ? { ...instancia, completada: true }
                  : instancia;
              })
            : []; // Si no se repite, no generamos nuevas instancias

        return {
          ...tareaActualizada,
          instancias: nuevasInstancias,
        };
      }

      // No permitir editar instancias directamente
      return tarea;
    });

    setTareas(eliminarDuplicados(nuevasTareas));
    guardarTareasEnStorage(nuevasTareas);
  };

  // --- Aplicar filtro por materia ---
  const obtenerTareasFiltradas = useCallback(() => {
    if (!filtroMateria) return tareas; // Si no hay filtro, retornar todas
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
