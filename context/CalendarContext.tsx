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
  undefined,
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
        JSON.stringify(materiasGlobales),
      );
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  // CalendarContext.js
  const agregarMateriaAlContexto = (materia: Materia): Materia => {
    const nuevaMateria = {
      ...materia,
      id: Math.random().toString(36).substr(2, 9),
    };
    setMateriasGlobales((prevMaterias) => [...prevMaterias, nuevaMateria]);
    return nuevaMateria; // Asegúrate de que aquí se retorne la nueva materia creada
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
