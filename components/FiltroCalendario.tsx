import React from "react";
import CalendarStrip from "react-native-calendar-strip";
import moment from "moment-timezone"; // Asegúrate de instalar moment-timezone

interface CalendarioProps {
  fechaSeleccionada: Date;
  setFechaSeleccionada: (fecha: Date) => void;
}

const FiltroCalendario: React.FC<CalendarioProps> = ({
  fechaSeleccionada,
  setFechaSeleccionada,
}) => {
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
            fontSize: 20,
            fontWeight: "bold",
          },
          textNameStyle: {
            color: "blue",
            fontSize: 14,
            fontWeight: "bold",
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
