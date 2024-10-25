import React, { useState, useEffect } from "react";
import {
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import { useTareas } from "../context/TareasContext";
import TareaCard from "./TareaCard";
import EmptyState from "./EmptyState";
import moment from "moment";
import { Tarea } from "../interfaces/Tarea";
import { FontAwesome } from "@expo/vector-icons";

interface ListaTareasProps {
  fechaSeleccionada: Date;
  handleAbrirModal: (tarea: Tarea) => void;
  handleIniciarCronometro: (tarea: Tarea) => void;
}

const prioridadValor: Record<"Alta" | "Media" | "Baja", number> = {
  Alta: 3,
  Media: 2,
  Baja: 1,
};

const ListaTareas: React.FC<ListaTareasProps> = ({
  fechaSeleccionada,
  handleAbrirModal,
  handleIniciarCronometro,
}) => {
  const { tareas, cargando, eliminarTarea, actualizarTarea } = useTareas();
  const [tareasFiltradas, setTareasFiltradas] = useState<Tarea[]>([]);
  const [tareasCompletadas, setTareasCompletadas] = useState<Tarea[]>([]);
  const [mostrarCompletadas, setMostrarCompletadas] = useState(false);
  const [tareasIncompletas, setTareasIncompletas] = useState<Tarea[]>([]);
  const [mostrarIncompletas, setMostrarIncompletas] = useState(false);
  const [tareaCreadaHoy, setTareaCreadaHoy] = useState(false);

  useEffect(() => {
    if (tareas) {
      const tareasDelDia = tareas.filter(
        (tarea) =>
          tarea.fechaVencimiento ===
          moment(fechaSeleccionada).format("YYYY-MM-DD"),
      );
      setTareaCreadaHoy(tareasDelDia.length > 0);
      const tareasNoCompletadas = tareasDelDia.filter(
        (tarea) => !tarea.completada,
      );
      const tareasCompletadas = tareasDelDia.filter(
        (tarea) => tarea.completada,
      );
      setTareasFiltradas(
        tareasNoCompletadas.sort(
          (a, b) => prioridadValor[b.prioridad] - prioridadValor[a.prioridad],
        ),
      );
      setTareasCompletadas(tareasCompletadas);

      // Filtrar tareas incompletas que ya han pasado de fecha
      const tareasIncompletasPasadas = tareas.filter(
        (tarea) =>
          tarea.fechaVencimiento < moment().format("YYYY-MM-DD") &&
          !tarea.completada,
      );
      setTareasIncompletas(tareasIncompletasPasadas);
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

  const handleCompletarTarea = (tarea: Tarea) => {
    const tareaActualizada = { ...tarea, completada: !tarea.completada };
    actualizarTarea(tareaActualizada);
  };

  return (
    <View>
      {tareasFiltradas.length === 0 && tareasCompletadas.length === 0 ? (
        tareaCreadaHoy ? (
          <Text
            style={{
              textAlign: "center",
              fontSize: 18,
              color: "green",
              marginTop: 20,
            }}
          >
            ¡Felicidades! Has completado todas tus tareas.
          </Text>
        ) : (
          <View style={{ alignItems: "center", marginTop: 20 }}>
            <EmptyState />
            <Image
              source={require("../assets/no-tareas.png")}
              style={{ width: 150, height: 150 }}
            />
          </View>
        )
      ) : (
        <View>
          {tareasFiltradas.map((item: Tarea) => (
            <TareaCard
              key={item.id}
              tarea={item}
              onEdit={() => handleAbrirModal(item)}
              onDelete={() => eliminarTarea(item.id)}
              onComplete={() => handleCompletarTarea(item)}
              onPlay={() => handleIniciarCronometro(item)}
              completada={item.completada}
            />
          ))}
          {tareasCompletadas.length > 0 && (
            <View>
              <TouchableOpacity
                onPress={() => setMostrarCompletadas(!mostrarCompletadas)}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginVertical: 10,
                }}
              >
                <Text style={{ fontSize: 16, color: "#555" }}>
                  Completado ({tareasCompletadas.length})
                </Text>
                <FontAwesome
                  name={mostrarCompletadas ? "chevron-up" : "chevron-down"}
                  size={16}
                  color="#555"
                />
              </TouchableOpacity>
              {mostrarCompletadas && (
                <View>
                  {tareasCompletadas.map((item: Tarea) => (
                    <TareaCard
                      key={item.id}
                      tarea={item}
                      onEdit={() => handleAbrirModal(item)}
                      onDelete={() => eliminarTarea(item.id)}
                      onComplete={() => handleCompletarTarea(item)}
                      onPlay={() => handleIniciarCronometro(item)}
                      completada={item.completada}
                    />
                  ))}
                </View>
              )}
            </View>
          )}
          {tareasIncompletas.length > 0 && (
            <View>
              <TouchableOpacity
                onPress={() => setMostrarIncompletas(!mostrarIncompletas)}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginVertical: 10,
                }}
              >
                <Text style={{ fontSize: 16, color: "red" }}>
                  Incompleto ({tareasIncompletas.length})
                </Text>
                <FontAwesome
                  name={mostrarIncompletas ? "chevron-up" : "chevron-down"}
                  size={16}
                  color="#555"
                />
              </TouchableOpacity>
              {mostrarIncompletas && (
                <View>
                  {tareasIncompletas.map((item: Tarea) => (
                    <TareaCard
                      key={item.id}
                      tarea={item}
                      onEdit={() => handleAbrirModal(item)}
                      onDelete={() => eliminarTarea(item.id)}
                      onComplete={() => handleCompletarTarea(item)}
                      onPlay={() => handleIniciarCronometro(item)}
                      completada={item.completada}
                    />
                  ))}
                </View>
              )}
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default ListaTareas;
