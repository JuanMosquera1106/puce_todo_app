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
import Toast from "react-native-toast-message";

interface ListaTareasProps {
  fechaSeleccionada: Date;
  handleAbrirModal: (tarea: Tarea) => void;
  handleIniciarCronometro: (tarea: Tarea) => void;
  mostrarCompletadas: boolean;
  mostrarAtrasadas: boolean;
  mostrarPendientes: boolean;
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
  mostrarCompletadas,
  mostrarAtrasadas,
  mostrarPendientes,
}) => {
  const { tareas, cargando, eliminarTarea, actualizarTarea, completarTarea } = useTareas();
  const [tareasFiltradas, setTareasFiltradas] = useState<Tarea[]>([]);
  const [tareasCompletadas, setTareasCompletadas] = useState<Tarea[]>([]);
  const [tareasIncompletas, setTareasIncompletas] = useState<Tarea[]>([]);
  const [mostrarCompletadasLocal, setMostrarCompletadasLocal] =
    useState(mostrarCompletadas);
  const [mostrarIncompletas, setMostrarIncompletas] = useState(false);
  const [tareaCreadaHoy, setTareaCreadaHoy] = useState(false);

  useEffect(() => {
    if (tareas) {
      // Combina tareas principales e instancias
      const todasLasTareas = tareas.flatMap((tarea) => [
        tarea,
        ...(tarea.instancias || []),
      ]);
  
      // Elimina duplicados
      const tareasUnicas = [...new Map(todasLasTareas.map((t) => [t.id, t])).values()];
  
      // Filtra tareas del día seleccionado
      const tareasDelDia = tareasUnicas.filter((tarea) =>
        moment(tarea.fechaVencimiento).isSame(moment(fechaSeleccionada), "day")
      );
  
      setTareaCreadaHoy(tareasDelDia.length > 0);
  
      // Divide en completadas y no completadas
      const tareasNoCompletadas = tareasDelDia.filter((tarea) => !tarea.completada);
      const tareasCompletadas = tareasDelDia.filter((tarea) => tarea.completada);
  
      setTareasFiltradas(
        tareasNoCompletadas
          .filter((tarea) => mostrarPendientes)
          .sort((a, b) => prioridadValor[b.prioridad] - prioridadValor[a.prioridad])
      );
  
      setTareasCompletadas(mostrarCompletadas ? tareasCompletadas : []);
  
      const tareasIncompletasPasadas = tareasUnicas.filter(
        (tarea) =>
          tarea.fechaVencimiento < moment().format("YYYY-MM-DD") &&
          !tarea.completada &&
          mostrarAtrasadas
      );
      setTareasIncompletas(tareasIncompletasPasadas);
    }
  }, [tareas, fechaSeleccionada, mostrarCompletadas, mostrarAtrasadas, mostrarPendientes]);  

  if (cargando) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Cargando tareas...</Text>
      </View>
    );
  }

  const handleCompletarTarea = (id: string) => {
    completarTarea(id); // Llama al contexto
  };
  

  const handleEliminarTarea = (id: string) => {
    eliminarTarea(id);
    Toast.show({
      type: "error",
      text1: "Tarea eliminada",
      text2: "La tarea ha sido eliminada exitosamente.",
      position: "top",
      visibilityTime: 3000,
      topOffset: 60,
    });
  };

  const styles = {
    tareaCompletada: {
      borderColor: "#666", // Gris o negro para tareas completadas
      backgroundColor: "#f0f0f0",
    },
    tareaPendiente: {
      borderColor: "#55BCF6", // Azul para tareas pendientes
      backgroundColor: "#e7f5ff",
    },
    tareaAtrasada: {
      borderColor: "red", // Rojo para tareas atrasadas
      backgroundColor: "#ffe5e5",
    },
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
    key={item.id || `${item.nombre}-${item}`} // Genera claves únicas
    tarea={item}
    onEdit={() => handleAbrirModal(item)}
    onDelete={() => handleEliminarTarea(item.id)}
    onComplete={() => handleCompletarTarea(item.id)}
    onPlay={() => handleIniciarCronometro(item)}
    completada={item.completada}
    customStyle={styles.tareaPendiente}
  />
))}

{tareasCompletadas.length > 0 && (
  <View>
    <TouchableOpacity
      onPress={() => setMostrarCompletadasLocal(!mostrarCompletadasLocal)}
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
        name={mostrarCompletadasLocal ? "chevron-up" : "chevron-down"}
        size={16}
        color="#555"
      />
    </TouchableOpacity>
    {mostrarCompletadasLocal && (
      <View>
        {tareasCompletadas.map((item: Tarea) => (
          <TareaCard
            key={item.id}
            tarea={item}
            onEdit={() => handleAbrirModal(item)}
            onDelete={() => handleEliminarTarea(item.id)}
            onComplete={() => handleCompletarTarea(item.id)}
            onPlay={() => handleIniciarCronometro(item)}
            completada={item.completada}
            customStyle={styles.tareaCompletada}
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
            onDelete={() => handleEliminarTarea(item.id)}
            onComplete={() => handleCompletarTarea(item.id)}
            onPlay={() => handleIniciarCronometro(item)}
            completada={item.completada}
            customStyle={styles.tareaAtrasada}
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