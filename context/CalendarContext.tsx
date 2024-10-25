import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DayEvents } from "../interfaces/Materia";

interface CalendarContextType {
  dayEvents: DayEvents;
  setDayEvents: React.Dispatch<React.SetStateAction<DayEvents>>;
  loadEvents: () => Promise<void>;
  saveEvents: () => Promise<void>;
<<<<<<< HEAD
  updateEvent: (date: string, eventData: any) => void; // Función para actualizar eventos
=======
>>>>>>> fd59d14e718270452c6c2e64e420788942320673
}

const CalendarContext = createContext<CalendarContextType | undefined>(
  undefined,
);

export const CalendarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [dayEvents, setDayEvents] = useState<DayEvents>({});

<<<<<<< HEAD
  // Función para cargar eventos desde AsyncStorage
=======
>>>>>>> fd59d14e718270452c6c2e64e420788942320673
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

<<<<<<< HEAD
  // Función para guardar eventos en AsyncStorage
=======
>>>>>>> fd59d14e718270452c6c2e64e420788942320673
  const saveEvents = async () => {
    try {
      await AsyncStorage.setItem("dayEvents", JSON.stringify(dayEvents));
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

<<<<<<< HEAD
  // Función para actualizar un evento específico
  const updateEvent = (date: string, eventData: any) => {
    setDayEvents((prevEvents) => ({
      ...prevEvents,
      [date]: eventData,
    }));
  };

=======
>>>>>>> fd59d14e718270452c6c2e64e420788942320673
  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    saveEvents();
  }, [dayEvents]);

  return (
    <CalendarContext.Provider
<<<<<<< HEAD
      value={{ dayEvents, setDayEvents, loadEvents, saveEvents, updateEvent }}
=======
      value={{ dayEvents, setDayEvents, loadEvents, saveEvents }}
>>>>>>> fd59d14e718270452c6c2e64e420788942320673
    >
      {children}
    </CalendarContext.Provider>
  );
};

<<<<<<< HEAD
// Hook para usar el contexto
=======
>>>>>>> fd59d14e718270452c6c2e64e420788942320673
export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error("useCalendar must be used within a CalendarProvider");
  }
  return context;
};
