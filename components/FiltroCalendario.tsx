<<<<<<< HEAD
import React, { useState } from "react";
import CalendarStrip from "react-native-calendar-strip";
import moment from "moment-timezone";
=======
import React from "react";
import CalendarStrip from "react-native-calendar-strip";
import moment from "moment-timezone"; // Asegúrate de instalar moment-timezone
>>>>>>> fd59d14e718270452c6c2e64e420788942320673

interface CalendarioProps {
  fechaSeleccionada: Date;
  setFechaSeleccionada: (fecha: Date) => void;
}

const FiltroCalendario: React.FC<CalendarioProps> = ({
  fechaSeleccionada,
  setFechaSeleccionada,
}) => {
<<<<<<< HEAD
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
      style={{ height: 100, paddingTop: 15, paddingBottom: 10 }}
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
          ? "#0000ff" // Azul si es la fecha actual seleccionada
          : "#ff0000", // Rojo para cualquier otra fecha seleccionada
        fontSize: 22,
        fontWeight: "700",
      }}
      highlightDateNameStyle={{
        color: moment(fechaSeleccionada).isSame(today, "day")
          ? "#0000ff" // Azul si es la fecha actual seleccionada
          : "#ff0000", // Rojo para cualquier otra fecha seleccionada
        fontSize: 14,
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
              : "#87CEFA", // Azul claro cuando la fecha actual no está seleccionada
=======
  const today = moment().tz("America/Guayaquil"); // Ajustar a la zona horaria de Ecuador

  return (
    <CalendarStrip
      style={{ height: 90, paddingTop: 10, paddingBottom: 10 }}
      selectedDate={fechaSeleccionada}
      onDateSelected={(date: any) =>
        setFechaSeleccionada(moment(date).toDate())
      } // No modificamos la semana
      calendarHeaderStyle={{
        color: "black",
        fontSize: 16,
        textAlign: "center",
      }}
      dateNumberStyle={{ color: "black", fontSize: 18 }}
      dateNameStyle={{ color: "gray", fontSize: 12 }}
      highlightDateNumberStyle={{
        color: "red", // Color por defecto para la fecha seleccionada
        fontSize: 20,
      }}
      highlightDateNameStyle={{
        color: "red", // Color por defecto para la fecha seleccionada
        fontSize: 14,
      }}
      customDatesStyles={[
        {
          date: today, // Siempre azul y negrita para la fecha actual
          style: { backgroundColor: "transparent" },
          textStyle: {
            color: "blue",
>>>>>>> fd59d14e718270452c6c2e64e420788942320673
            fontSize: 20,
            fontWeight: "bold",
          },
          textNameStyle: {
<<<<<<< HEAD
            color: moment(fechaSeleccionada).isSame(today, "day")
              ? "#0000ff" // Azul cuando es la fecha actual seleccionada
              : "#87CEFA", // Azul claro cuando la fecha actual no está seleccionada
=======
            color: "blue",
>>>>>>> fd59d14e718270452c6c2e64e420788942320673
            fontSize: 14,
            fontWeight: "bold",
          },
        },
      ]}
<<<<<<< HEAD
      disabledDateNameStyle={{ color: "#d3d3d3" }}
      disabledDateNumberStyle={{ color: "#d3d3d3" }}
      iconLeftStyle={{ tintColor: "#555" }}
      iconRightStyle={{ tintColor: "#555" }}
=======
      disabledDateNameStyle={{ color: "grey" }}
      disabledDateNumberStyle={{ color: "grey" }}
>>>>>>> fd59d14e718270452c6c2e64e420788942320673
      iconContainer={{ flex: 0.1 }}
    />
  );
};

export default FiltroCalendario;
