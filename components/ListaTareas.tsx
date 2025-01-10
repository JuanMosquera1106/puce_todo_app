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
  fechaSeleccionada?: Date|null;
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
  const [tareasAgrupadas, setTareasAgrupadas] = useState<{
    hoy: Tarea[];
    mañana: Tarea[];
    futuras: Tarea[];
  }>({ hoy: [], mañana: [], futuras: [] });

  const [mostrarHoy, setMostrarHoy] = useState(true);
  const [mostrarMañana, setMostrarMañana] = useState(true);
  const [mostrarFuturas, setMostrarFuturas] = useState(true);

  
  useEffect(() => {
  if (tareas) {
    // Combina tareas principales e instancias
    const todasLasTareas = tareas.flatMap((tarea) => [
      tarea,
      ...(tarea.instancias || []),
    ]);

    // Elimina duplicados
    const tareasUnicas = [
      ...new Map(todasLasTareas.map((t) => [t.id, t])).values(),
    ];

    // Define fechas importantes
    const hoy = moment().startOf("day");
    const mañana = moment().add(1, "day").startOf("day");

    if (fechaSeleccionada === null) {
      // Caso: No hay fecha seleccionada (Agrupación dinámica y filtros)
      const tareasPendientes = tareasUnicas.filter(
        (tarea) =>
          !tarea.completada &&
          (!mostrarAtrasadas || moment(tarea.fechaVencimiento).isSameOrAfter(hoy, "day"))
      );

      const tareasCompletadasFiltradas = tareasUnicas.filter(
        (tarea) => tarea.completada && mostrarCompletadas
      );

      const tareasAtrasadas = tareasUnicas.filter(
        (tarea) =>
          moment(tarea.fechaVencimiento).isBefore(hoy, "day") &&
          !tarea.completada &&
          mostrarAtrasadas
      );

      setTareasAgrupadas({
        hoy: tareasPendientes.filter((tarea) =>
          moment(tarea.fechaVencimiento).isSame(hoy, "day")
        ),
        mañana: tareasPendientes.filter((tarea) =>
          moment(tarea.fechaVencimiento).isSame(mañana, "day")
        ),
        futuras: tareasPendientes.filter((tarea) =>
          moment(tarea.fechaVencimiento).isAfter(mañana, "day")
        ),
      });

      setTareasFiltradas(tareasPendientes);
      setTareasCompletadas(tareasCompletadasFiltradas);
      setTareasIncompletas(tareasAtrasadas);
    } else {
      // Caso: Fecha seleccionada (Filtrado por fecha específica)
      const tareasFiltradasPorFecha = tareasUnicas.filter((tarea) =>
        moment(tarea.fechaVencimiento).isSame(
          moment(fechaSeleccionada).startOf("day"),
          "day"
        )
      );

      const tareasNoCompletadas = tareasFiltradasPorFecha.filter(
        (tarea) => !tarea.completada && mostrarPendientes
      );

      const tareasCompletadasFiltradas = tareasFiltradasPorFecha.filter(
        (tarea) => tarea.completada && mostrarCompletadas
      );

      const tareasAtrasadas = tareasFiltradasPorFecha.filter(
        (tarea) =>
          moment(tarea.fechaVencimiento).isBefore(hoy, "day") &&
          !tarea.completada &&
          mostrarAtrasadas
      );

      setTareasFiltradas(tareasNoCompletadas);
      setTareasCompletadas(tareasCompletadasFiltradas);
      setTareasIncompletas(tareasAtrasadas);

      // Limpia las agrupaciones dinámicas
      setTareasAgrupadas({ hoy: [], mañana: [], futuras: [] });
    }
  } else {
    // Limpia los estados si no hay tareas
    setTareasAgrupadas({ hoy: [], mañana: [], futuras: [] });
    setTareasFiltradas([]);
    setTareasCompletadas([]);
    setTareasIncompletas([]);
  }
}, [
  tareas,
  fechaSeleccionada,
  mostrarCompletadas,
  mostrarAtrasadas,
  mostrarPendientes,
]);
  
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
      {cargando ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Cargando tareas...</Text>
        </View>
      ) : (
        <View>
          {/* Caso: No hay tareas para mostrar */}
          {tareasFiltradas.length === 0 &&
          tareasCompletadas.length === 0 &&
          tareasAgrupadas.hoy.length === 0 &&
          tareasAgrupadas.mañana.length === 0 &&
          tareasAgrupadas.futuras.length === 0 &&
          tareasIncompletas.length === 0 ? (
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
              {/* Caso: fechaSeleccionada === null */}
              {fechaSeleccionada === null ? (
                <View>
                  {/* Hoy */}
                  <TouchableOpacity
                    onPress={() => setMostrarHoy(!mostrarHoy)}
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginVertical: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        color: "#0891b2",
                      }}
                    >
                      Hoy ({tareasAgrupadas.hoy.length})
                    </Text>
                    <FontAwesome
                      name={mostrarHoy ? "chevron-up" : "chevron-down"}
                      size={16}
                      color="#0891b2"
                    />
                  </TouchableOpacity>
                  {mostrarHoy &&
                    tareasAgrupadas.hoy.map((tarea) => (
                      <TareaCard
                        key={tarea.id}
                        tarea={tarea}
                        onEdit={() =>
                        handleAbrirModal({
                          ...tarea,
                          fechaVencimiento: fechaSeleccionada
                            ? moment(fechaSeleccionada).format("YYYY-MM-DD")
                            : moment().format("YYYY-MM-DD"),
                        })
                      }
                        onDelete={() => handleEliminarTarea(tarea.id)}
                        onComplete={() => handleCompletarTarea(tarea.id)}
                        onPlay={() => handleIniciarCronometro(tarea)}
                        completada={tarea.completada}
                        customStyle={styles.tareaPendiente}
                      />
                    ))}
  
                  {/* Mañana */}
                  <TouchableOpacity
                    onPress={() => setMostrarMañana(!mostrarMañana)}
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginVertical: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        color: "#0891b2",
                      }}
                    >
                      Mañana ({tareasAgrupadas.mañana.length})
                    </Text>
                    <FontAwesome
                      name={mostrarMañana ? "chevron-up" : "chevron-down"}
                      size={16}
                      color="#0891b2"
                    />
                  </TouchableOpacity>
                  {mostrarMañana &&
                    tareasAgrupadas.mañana.map((tarea) => (
                      <TareaCard
                        key={tarea.id}
                        tarea={tarea}
                        onEdit={() =>
  handleAbrirModal({
    ...tarea,
    fechaVencimiento: fechaSeleccionada
      ? moment(fechaSeleccionada).format("YYYY-MM-DD")
      : moment().format("YYYY-MM-DD"),
  })
}
                        onDelete={() => handleEliminarTarea(tarea.id)}
                        onComplete={() => handleCompletarTarea(tarea.id)}
                        onPlay={() => handleIniciarCronometro(tarea)}
                        completada={tarea.completada}
                        customStyle={styles.tareaPendiente}
                      />
                    ))}
  
                  {/* Futuras */}
                  <TouchableOpacity
                    onPress={() => setMostrarFuturas(!mostrarFuturas)}
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginVertical: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        color: "#0891b2",
                      }}
                    >
                      Futuras ({tareasAgrupadas.futuras.length})
                    </Text>
                    <FontAwesome
                      name={mostrarFuturas ? "chevron-up" : "chevron-down"}
                      size={16}
                      color="#0891b2"
                    />
                  </TouchableOpacity>
                  {mostrarFuturas &&
                    tareasAgrupadas.futuras.map((tarea) => (
                      <TareaCard
                        key={tarea.id}
                        tarea={tarea}
                        onEdit={() =>
  handleAbrirModal({
    ...tarea,
    fechaVencimiento: fechaSeleccionada
      ? moment(fechaSeleccionada).format("YYYY-MM-DD")
      : moment().format("YYYY-MM-DD"),
  })
}
                        onDelete={() => handleEliminarTarea(tarea.id)}
                        onComplete={() => handleCompletarTarea(tarea.id)}
                        onPlay={() => handleIniciarCronometro(tarea)}
                        completada={tarea.completada}
                        customStyle={styles.tareaPendiente}
                      />
                    ))}
                </View>
              ) : (
                <View>
                  {/* Caso: fechaSeleccionada definida */}
                  {tareasFiltradas.map((tarea) => (
                    <TareaCard
                      key={tarea.id}
                      tarea={tarea}
                      onEdit={() =>
  handleAbrirModal({
    ...tarea,
    fechaVencimiento: fechaSeleccionada
      ? moment(fechaSeleccionada).format("YYYY-MM-DD")
      : moment().format("YYYY-MM-DD"),
  })
}
                      onDelete={() => handleEliminarTarea(tarea.id)}
                      onComplete={() => handleCompletarTarea(tarea.id)}
                      onPlay={() => handleIniciarCronometro(tarea)}
                      completada={tarea.completada}
                      customStyle={styles.tareaPendiente}
                    />
                  ))}
                </View>
              )}
  
              {/* Completadas */}
              {tareasCompletadas.length > 0 && (
                <View>
                  <TouchableOpacity
                    onPress={() =>
                      setMostrarCompletadasLocal(!mostrarCompletadasLocal)
                    }
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
                  {mostrarCompletadasLocal &&
                    tareasCompletadas.map((tarea) => (
                      <TareaCard
                        key={tarea.id}
                        tarea={tarea}
                        onEdit={() =>
  handleAbrirModal({
    ...tarea,
    fechaVencimiento: fechaSeleccionada
      ? moment(fechaSeleccionada).format("YYYY-MM-DD")
      : moment().format("YYYY-MM-DD"),
  })
}
                        onDelete={() => handleEliminarTarea(tarea.id)}
                        onComplete={() => handleCompletarTarea(tarea.id)}
                        onPlay={() => handleIniciarCronometro(tarea)}
                        completada={tarea.completada}
                        customStyle={styles.tareaCompletada}
                      />
                    ))}
                </View>
              )}
  
              {/* Atrasadas */}
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
                      Atrasadas ({tareasIncompletas.length})
                    </Text>
                    <FontAwesome
                      name={mostrarIncompletas ? "chevron-up" : "chevron-down"}
                      size={16}
                      color="red"
                    />
                  </TouchableOpacity>
                  {mostrarIncompletas &&
                    tareasIncompletas.map((tarea) => (
                      <TareaCard
                        key={tarea.id}
                        tarea={tarea}
                        onEdit={() =>
  handleAbrirModal({
    ...tarea,
    fechaVencimiento: fechaSeleccionada
      ? moment(fechaSeleccionada).format("YYYY-MM-DD")
      : moment().format("YYYY-MM-DD"),
  })
}
                        onDelete={() => handleEliminarTarea(tarea.id)}
                        onComplete={() => handleCompletarTarea(tarea.id)}
                        onPlay={() => handleIniciarCronometro(tarea)}
                        completada={tarea.completada}
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