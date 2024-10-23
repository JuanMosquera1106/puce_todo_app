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
        color: "red", // Color por defecto para fechas resaltadas
        fontSize: 20,
      }}
      highlightDateNameStyle={{
        color: "red", // Color por defecto para fechas resaltadas
        fontSize: 14,
      }}
      customDatesStyles={[
        {
          date: today, // La fecha de hoy
          style: { backgroundColor: "transparent" },
          textStyle: {
            color: "blue", // Azul para la fecha actual
            fontSize: 20,
          },
          textNameStyle: {
            color: "blue", // Azul para el nombre de la fecha actual
            fontSize: 14,
          },
        },
        {
          date: moment(fechaSeleccionada), // La fecha seleccionada
          style: {
            backgroundColor: "transparent",
          },
          textStyle: {
            color: "red", // Rojo para la fecha seleccionada (si no es hoy)
            fontSize: 20,
          },
          textNameStyle: {
            color: "red", // Rojo para el nombre de la fecha seleccionada (si no es hoy)
            fontSize: 14,
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
