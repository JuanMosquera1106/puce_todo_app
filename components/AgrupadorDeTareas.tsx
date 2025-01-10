import React from "react";
import { View, Text } from "react-native";
import TareaCard from "./TareaCard";
import moment from "moment";
import { Tarea } from "../interfaces/Tarea";

interface AgrupadorDeTareasProps {
  tareas: Tarea[];
  handleAbrirModal: (tarea: Tarea) => void;
  handleIniciarCronometro: (tarea: Tarea) => void;
  handleCompletarTarea: (id: string) => void;
  handleEliminarTarea: (id: string) => void;
}

const AgrupadorDeTareas: React.FC<AgrupadorDeTareasProps> = ({
  tareas,
  handleAbrirModal,
  handleIniciarCronometro,
  handleCompletarTarea,
  handleEliminarTarea,
}) => {
  const hoy = moment().startOf("day");
  const mañana = moment().add(1, "day").startOf("day");
  const finSemana = moment().endOf("week");

  const tareasHoy = tareas.filter((tarea) =>
    moment(tarea.fechaVencimiento).isSame(hoy, "day")
  );
  const tareasMañana = tareas.filter((tarea) =>
    moment(tarea.fechaVencimiento).isSame(mañana, "day")
  );
  const tareasEstaSemana = tareas.filter(
    (tarea) =>
      moment(tarea.fechaVencimiento).isAfter(mañana, "day") &&
      moment(tarea.fechaVencimiento).isBefore(finSemana, "day")
  );
  const tareasFuturas = tareas.filter((tarea) =>
    moment(tarea.fechaVencimiento).isAfter(finSemana, "day")
  );

  const renderTareas = (titulo: string, tareas: Tarea[]) => (
    <View style={{ marginBottom: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
        {titulo}:
      </Text>
      {tareas.length > 0 ? (
        tareas.map((tarea) => (
          <TareaCard
            key={tarea.id}
            tarea={tarea}
            completada={tarea.completada} // Agrega esta línea
            onEdit={() => handleAbrirModal(tarea)}
            onDelete={() => handleEliminarTarea(tarea.id)}
            onComplete={() => handleCompletarTarea(tarea.id)}
            onPlay={() => handleIniciarCronometro(tarea)}
          />
        ))
      ) : (
        <Text style={{ fontSize: 14, fontStyle: "italic", color: "#555" }}>
          No hay tareas para {titulo.toLowerCase()}.
        </Text>
      )}
    </View>
  );

  return (
    <View>
      {renderTareas("Hoy", tareasHoy)}
      {renderTareas("Mañana", tareasMañana)}
      {renderTareas("Esta Semana", tareasEstaSemana)}
      {renderTareas("Futuras", tareasFuturas)}
    </View>
  );
};

export default AgrupadorDeTareas;
