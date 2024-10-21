import React from "react";
import CalendarStrip from "react-native-calendar-strip";
import moment from "moment";

interface CalendarioProps {
  fechaSeleccionada: Date;
  setFechaSeleccionada: (fecha: Date) => void;
}

const FiltroCalendario: React.FC<CalendarioProps> = ({
  fechaSeleccionada,
  setFechaSeleccionada,
}) => {
  const today = moment(); // Fecha de hoy

  return (
    <CalendarStrip
      style={{ height: 90, paddingTop: 10, paddingBottom: 10 }}
      selectedDate={fechaSeleccionada}
      startingDate={moment(fechaSeleccionada).toDate()} // Convertir a Date nativo
      onDateSelected={(date) => setFechaSeleccionada(moment(date).toDate())}
      calendarHeaderStyle={{
        color: "black",
        fontSize: 16,
        textAlign: "center",
      }}
      dateNumberStyle={{ color: "black", fontSize: 18 }}
      dateNameStyle={{ color: "gray", fontSize: 12 }}
      highlightDateNumberStyle={{
        color: moment(fechaSeleccionada).isSame(today, "day") ? "blue" : "red", // Azul para la fecha seleccionada si es hoy, rojo si no es hoy
        fontSize: 20,
      }}
      highlightDateNameStyle={{
        color: moment(fechaSeleccionada).isSame(today, "day") ? "blue" : "red", // Azul para la fecha seleccionada si es hoy, rojo si no es hoy
        fontSize: 14,
      }}
      customDatesStyles={[
        {
          date: today,
          style: { backgroundColor: "transparent" },
          textStyle: { color: "blue", fontSize: 20 }, // La fecha actual siempre está en azul
          textNameStyle: { color: "blue", fontSize: 14 },
        },
        {
          date: moment(fechaSeleccionada),
          style: {
            backgroundColor: "transparent",
            textStyle: {
              color: moment(fechaSeleccionada).isSame(today, "day")
                ? "blue" // Si la fecha seleccionada es hoy, azul
                : "red", // Si la fecha seleccionada no es hoy, rojo
              fontSize: 20,
            },
            textNameStyle: {
              color: moment(fechaSeleccionada).isSame(today, "day")
                ? "blue"
                : "red",
              fontSize: 14,
            },
          },
        },
      ]}
      disabledDateNameStyle={{ color: "grey" }}
      disabledDateNumberStyle={{ color: "grey" }}
      iconContainer={{ flex: 0.1 }}
    />
  );
};

export default FiltroCalendario;
