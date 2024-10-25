import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DayEvents } from "../interfaces/Materia";

interface CalendarContextType {
  dayEvents: DayEvents;
  setDayEvents: React.Dispatch<React.SetStateAction<DayEvents>>;
  loadEvents: () => Promise<void>;
  saveEvents: () => Promise<void>;
  updateEvent: (date: string, eventData: any) => void; // Función para actualizar eventos
}

const CalendarContext = createContext<CalendarContextType | undefined>(
  undefined,
);

export const CalendarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [dayEvents, setDayEvents] = useState<DayEvents>({});

  // Función para cargar eventos desde AsyncStorage
  const loadEvents = async () => {
    try {
      const savedEvents = await AsyncStorage.getItem("dayEvents");
      if (savedEvents) {
        setDayEvents(JSON.parse(savedEvents));
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  // Función para guardar eventos en AsyncStorage
  const saveEvents = async () => {
    try {
      await AsyncStorage.setItem("dayEvents", JSON.stringify(dayEvents));
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  // Función para actualizar un evento específico
  const updateEvent = (date: string, eventData: any) => {
    setDayEvents((prevEvents) => ({
      ...prevEvents,
      [date]: eventData,
    }));
  };

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    saveEvents();
  }, [dayEvents]);

  return (
    <CalendarContext.Provider
      value={{ dayEvents, setDayEvents, loadEvents, saveEvents, updateEvent }}
    >
      {children}
    </CalendarContext.Provider>
  );
};

// Hook para usar el contexto
export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error("useCalendar must be used within a CalendarProvider");
  }
  return context;
};
