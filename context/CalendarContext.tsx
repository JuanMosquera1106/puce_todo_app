import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, ToastAndroid } from "react-native";
import { DayEvents, Materia } from "../interfaces/Materia";

interface CalendarContextType {
  dayEvents: DayEvents;
  setDayEvents: React.Dispatch<React.SetStateAction<DayEvents>>;
  loadEvents: () => Promise<void>;
  saveEvents: () => Promise<void>;
  updateEvent: (date: string, eventData: any) => void;
  materiasGlobales: Materia[];
  setMateriasGlobales: React.Dispatch<React.SetStateAction<Materia[]>>;
  agregarMateriaAlContexto: (materia: Materia) => void;
  editarMateria: (materiaId: string, updatedMateria: Materia) => void;
  eliminarMateria: (materiaId: string) => void;
}

const CalendarContext = createContext<CalendarContextType | undefined>(
  undefined
);

export const CalendarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [dayEvents, setDayEvents] = useState<DayEvents>({});
  const [materiasGlobales, setMateriasGlobales] = useState<Materia[]>([]);

  const SUPABASE_URL = "https://pcbuevklhuyxcwyfazac.supabase.co/rest/v1/Materia";
  const SUPABASE_API_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjYnVldmtsaHV5eGN3eWZhemFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE0OTk3NzMsImV4cCI6MjA0NzA3NTc3M30.jPRuol82X1rdiQLWAPrXUsXG-vTs65I_sNzQ-QUeDog";

  const loadEvents = async () => {
    try {
      const savedEvents = await AsyncStorage.getItem("dayEvents");
      const savedMaterias = await AsyncStorage.getItem("materiasGlobales");

      if (savedEvents) setDayEvents(JSON.parse(savedEvents));
      if (savedMaterias) setMateriasGlobales(JSON.parse(savedMaterias));
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const saveEvents = async () => {
    try {
      await AsyncStorage.setItem("dayEvents", JSON.stringify(dayEvents));
      await AsyncStorage.setItem(
        "materiasGlobales",
        JSON.stringify(materiasGlobales)
      );
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const transformarMateria = (materia: Materia) => ({
    id: materia.id,
    nombre: materia.event,
  });

  //----------------------------------------------------------------------------------------------------------------------------------//
  //CREAR MATERIA
  const agregarMateriaAlContexto = (materia: Materia): Materia => {
    const nuevaMateria = {
      ...materia,
      id: Math.random().toString(36).substr(2, 9),
    };
    setMateriasGlobales((prevMaterias) => [...prevMaterias, nuevaMateria]);

    const enviarASupabase = async () => {
      try {
        const materiaTransformada = transformarMateria(nuevaMateria);
        const response = await fetch(SUPABASE_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: SUPABASE_API_KEY,
          },
          body: JSON.stringify(materiaTransformada),
        });
        if (!response.ok) {
          console.error("Error al insertar materia en Supabase:", response.status);
        }
      } catch (error) {
        console.error("Error al enviar datos a Supabase:", error);
      }
    };

    enviarASupabase();
    return nuevaMateria;
  };

  //----------------------------------------------------------------------------------------------------------------------------------//
  //EDITAR LA MATERIA
  const editarMateria = (materiaId: string, updatedMateria: Materia) => {
    setMateriasGlobales((prev) =>
      prev.map((materia) =>
        materia.id === materiaId ? { ...materia, ...updatedMateria } : materia
      )
    );
    console.log("Materia editada:", updatedMateria);    console.log("EDITADO");
    const enviarASupabase = async () => { 
      try {
        const materiaTransformada = transformarMateria(updatedMateria);
        const response = await fetch(`${SUPABASE_URL}?id=eq.${materiaId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            apikey: SUPABASE_API_KEY,
          },
          body: JSON.stringify(materiaTransformada),
        });
        if (!response.ok) {
          console.error("Error al editar materia en Supabase:", response.status);
        } else {
          ToastAndroid.show("Materia editada correctamente", ToastAndroid.SHORT);
        }
      } catch (error) {
        console.error("Error al enviar datos a Supabase:", error);
      }
    };

    enviarASupabase();
  };

  //----------------------------------------------------------------------------------------------------------------------------------//
  //ELIMINAR LA MATERIA
  const eliminarMateria = (materiaId: string) => {
    Alert.alert(
      "Confirmar eliminación",
      "¿Estás seguro de que deseas eliminar esta materia?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          onPress: async () => {
            setMateriasGlobales((prev) =>
              prev.filter((materia) => materia.id !== materiaId)
            );
            console.log("ELIMINADO");
            const eliminarDeSupabase = async () => {
              try {
                const response = await fetch(`${SUPABASE_URL}?id=eq.${materiaId}`, {
                  method: "DELETE",
                  headers: {
                    apikey: SUPABASE_API_KEY,
                  },
                });
                if (!response.ok) {
                  console.error(
                    "Error al eliminar materia en Supabase:",
                    response.status
                  );
                } else {
                  ToastAndroid.show(
                    "Materia eliminada correctamente",
                    ToastAndroid.SHORT
                  );
                }
              } catch (error) {
                console.error("Error al eliminar datos de Supabase:", error);
              }
            };

            eliminarDeSupabase();
          },
          style: "destructive",
        },
      ]
    );
  };

  
  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    saveEvents();
  }, [dayEvents, materiasGlobales]);

  return (
    <CalendarContext.Provider
      value={{
        dayEvents,
        setDayEvents,
        loadEvents,
        saveEvents,
        updateEvent: (date, eventData) => {
          setDayEvents((prevEvents) => ({
            ...prevEvents,
            [date]: eventData,
          }));
        },
        materiasGlobales,
        setMateriasGlobales,
        agregarMateriaAlContexto,
        editarMateria,
        eliminarMateria,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error("useCalendar must be used within a CalendarProvider");
  }
  return context;
};
