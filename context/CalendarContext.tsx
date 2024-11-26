import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
}

const CalendarContext = createContext<CalendarContextType | undefined>(
  undefined
);

export const CalendarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [dayEvents, setDayEvents] = useState<DayEvents>({});
  const [materiasGlobales, setMateriasGlobales] = useState<Materia[]>([]);

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

  // Transformar Materia antes de enviar a Supabase
  const transformarMateria = (materia: Materia) => {
    return {
      nombre: materia.event, // Cambiar `event` a `nombre` para enviar a la base de datos
    };
  };

  // Insertar materia en Supabase
  const agregarMateriaAlContexto = (materia: Materia): Materia => {
    const nuevaMateria = {
      ...materia,
      id: Math.random().toString(36).substr(2, 9), // Generar un ID aleatorio
    };
    setMateriasGlobales((prevMaterias) => [...prevMaterias, nuevaMateria]);

    const enviarASupabase = async () => {
      try {
        const materiaTransformada = transformarMateria(nuevaMateria);
        const response = await fetch(
          "https://pcbuevklhuyxcwyfazac.supabase.co/rest/v1/Materia",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey:
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjYnVldmtsaHV5eGN3eWZhemFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE0OTk3NzMsImV4cCI6MjA0NzA3NTc3M30.jPRuol82X1rdiQLWAPrXUsXG-vTs65I_sNzQ-QUeDog",
            },
            body: JSON.stringify(materiaTransformada),
          }
        );
        if (!response.ok) {
          console.error("Error al insertar materia en Supabase:", response.status);
        }
      } catch (error) {
        console.error("Error al enviar datos a Supabase:", error);
      }
    };

    enviarASupabase();
    return nuevaMateria; // Retorna la nueva materia creada
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
