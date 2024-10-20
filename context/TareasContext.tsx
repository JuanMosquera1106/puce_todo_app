import React, { createContext, useState, useContext, useCallback } from "react";
import { Tarea } from "../interfaces/Tarea";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Para almacenamiento persistente

type TareasContextType = {
  tareas: Tarea[];
  cargando: boolean;
  agregarTarea: (tarea: Tarea) => void;
  actualizarTarea: (tarea: Tarea) => void;
  eliminarTarea: (id: string) => void;
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

  return (
    <TareasContext.Provider
      value={{ tareas, cargando, agregarTarea, actualizarTarea, eliminarTarea }}
    >
      {children}
    </TareasContext.Provider>
  );
};
