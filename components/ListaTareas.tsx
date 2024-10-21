import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { useTareas } from "../context/TareasContext";
import TareaCard from "./TareaCard";
import EmptyState from "./EmptyState";
import moment from "moment";
import { Tarea } from "../interfaces/Tarea";

// Definir los props para ListaTareas
interface ListaTareasProps {
  fechaSeleccionada: Date;
  handleAbrirModal: (tarea: Tarea) => void;
}

// Asignar valores numéricos a las prioridades para ordenarlas
const prioridadValor: Record<"Alta" | "Media" | "Baja", number> = {
  Alta: 3,
  Media: 2,
  Baja: 1,
};

const ListaTareas: React.FC<ListaTareasProps> = ({
  fechaSeleccionada,
  handleAbrirModal,
}) => {
  const { tareas, cargando, eliminarTarea } = useTareas();
  const [tareasFiltradas, setTareasFiltradas] = useState<Tarea[]>([]); // Definir tipo de tareasFiltradas

  // Efecto para filtrar y ordenar las tareas por la fecha seleccionada
  useEffect(() => {
    if (tareas) {
      let tareasFiltradas = tareas.filter(
        (tarea) =>
          tarea.fechaVencimiento ===
          moment(fechaSeleccionada).format("YYYY-MM-DD"),
      );

      // Ordenar las tareas filtradas por prioridad
      tareasFiltradas = tareasFiltradas.sort(
        (a, b) => prioridadValor[b.prioridad] - prioridadValor[a.prioridad],
      );

      setTareasFiltradas(tareasFiltradas);
    }
  }, [tareas, fechaSeleccionada]);

  if (cargando) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Cargando tareas...</Text>
      </View>
    );
  }

  return (
    <View>
      {tareasFiltradas.length === 0 ? (
        <EmptyState />
      ) : (
        tareasFiltradas.map((item: Tarea) => (
          <TareaCard
            key={item.id} // Asegúrate de agregar una key única para cada elemento
            tarea={item}
            onEdit={() => handleAbrirModal(item)}
            onDelete={() => eliminarTarea(item.id)}
          />
        ))
      )}
    </View>
  );
};

export default ListaTareas;
