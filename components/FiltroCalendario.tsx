import React, { useState } from "react";
import CalendarStrip from "react-native-calendar-strip";
import moment from "moment-timezone";
import "moment/locale/es"; // Importa el idioma español para moment.js

// Configura moment en español globalmente
moment.locale("es");

interface CalendarioProps {
  fechaSeleccionada: Date;
  setFechaSeleccionada: (fecha: Date) => void;
}

const FiltroCalendario: React.FC<CalendarioProps> = ({
  fechaSeleccionada,
  setFechaSeleccionada,
}) => {
  const today = moment().tz("America/Guayaquil");
  const [startingDate, setStartingDate] = useState<Date>(
    moment(fechaSeleccionada).startOf("week").toDate(),
  );

  const handleDateSelected = (date: any) => {
    const selectedDate = moment(date).toDate();
    setFechaSeleccionada(selectedDate);

    if (!moment(selectedDate).isSame(startingDate, "week")) {
      setStartingDate(moment(selectedDate).startOf("week").toDate());
    }
  };

  return (
    <CalendarStrip
      style={{ height: 100, paddingTop: 15, paddingBottom: 1, marginTop: 25, marginBottom: 12 }}
      selectedDate={fechaSeleccionada}
      startingDate={startingDate}
      onDateSelected={handleDateSelected}
      calendarHeaderStyle={{
        color: "#333",
        fontSize: 16,
        textAlign: "center",
        fontWeight: "600",
      }}
      dateNumberStyle={{ color: "#555", fontSize: 18 }}
      dateNameStyle={{ color: "#888", fontSize: 12 }}
      highlightDateNumberStyle={{
        color: moment(fechaSeleccionada).isSame(today, "day")
          ? "#ff0000" // Azul si es la fecha actual seleccionada
          : "#ff0000", // Rojo para cualquier otra fecha seleccionada
        fontSize: 22,
        fontWeight: "700",
      }}
      highlightDateNameStyle={{
        color: moment(fechaSeleccionada).isSame(today, "day")
          ? "#ff0000" // Azul si es la fecha actual seleccionada
          : "#ff0000", // Rojo para cualquier otra fecha seleccionada
        fontSize: 13,
        fontWeight: "700",
      }}
      customDatesStyles={[
        {
          date: today.toDate(),
          containerStyle: {
            borderWidth: !moment(fechaSeleccionada).isSame(today, "day")
              ? 2
              : 0, // Borde si la fecha actual no está seleccionada
            borderColor: "#87CEFA", // Azul claro para el borde cuando no está seleccionada
            borderRadius: 50, // Círculo
            padding: 5, // Ajustar tamaño del círculo
          },
          textStyle: {
            color: moment(fechaSeleccionada).isSame(today, "day")
              ? "#0000ff" // Azul cuando es la fecha actual seleccionada
              : "#0000ff", // Azul claro cuando la fecha actual no está seleccionada
            fontSize: 20,
            fontWeight: "bold",
          },
          textNameStyle: {
            color: moment(fechaSeleccionada).isSame(today, "day")
              ? "#0000ff" // Azul cuando es la fecha actual seleccionada
              : "#87CEFA", // Azul claro cuando la fecha actual no está seleccionada
            fontSize: 14,
            fontWeight: "bold",
          },
        },
      ]}
      disabledDateNameStyle={{ color: "#d3d3d3" }}
      disabledDateNumberStyle={{ color: "#d3d3d3" }}
      iconLeftStyle={{ tintColor: "#555" }}
      iconRightStyle={{ tintColor: "#555" }}
      iconContainer={{ flex: 0.1 }}
    />
  );
};

export default FiltroCalendario;
