import React, { useState, useEffect, useRef } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  View,
  Pressable,
  Modal,
  Alert,
  Animated,
  Button,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform } from "react-native";
import { styled } from "nativewind";
import { Tarea } from "../interfaces/Tarea";
import { useTareas } from "../context/TareasContext";
import { useCalendar } from "../context/CalendarContext";
import { Materia } from "../interfaces/Materia";
import moment from "moment";
import Timer from "./Timer";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { MateriaModal } from "./MateriaModal";
import Toast from "react-native-toast-message";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledPressable = styled(Pressable);
const StyledScrollView = styled(ScrollView);

const generateId = (): string => Math.random().toString(36).substr(2, 9);

export default function FormularioTareaModal({
  visible,
  onClose,
  tareaInicial,
  esEditar = false,
}: {
  visible: boolean;
  onClose: () => void;
  tareaInicial?: Tarea;
  esEditar?: boolean;
}) {
  const { agregarTarea, actualizarTarea } = useTareas();
  const { agregarMateriaAlContexto, materiasGlobales } = useCalendar();
  const [tareaNombre, setTareaNombre] = useState(tareaInicial?.nombre || "");
  const [tareaPrioridad, setTareaPrioridad] = useState<
    "Baja" | "Media" | "Alta"
  >(tareaInicial?.prioridad || "Baja");
  const [tareaMateria, setTareaMateria] = useState(
    tareaInicial?.materia || "Ninguna",
  );
  const [tareaFechaVencimiento, setTareaFechaVencimiento] = useState(
    tareaInicial?.fechaVencimiento || new Date().toLocaleDateString("en-CA"),
  );
  const [materiasDisponibles, setMateriasDisponibles] = useState<string[]>([]);
  const [repetirFrecuencia, setRepetirFrecuencia] = useState<string | null>(
    tareaInicial?.repetir || null,
  );
  const [pomodoroConfig, setPomodoroConfig] = useState(
    tareaInicial?.pomodoro || { duracion: 25, descanso: 5, intervalo: 1 },
  );
  const [fechaError, setFechaError] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [mostrarNotificacion, setMostrarNotificacion] = useState<
    "Pomodoro" | "Recordatorios" | "Repetir" | "Prioridad" | null
  >(null);
  const [mostrarTimer, setMostrarTimer] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const [nuevaMateriaModalVisible, setNuevaMateriaModalVisible] =
    useState(false);
  const [nuevaMateriaNombre, setNuevaMateriaNombre] = useState("");
  const [nuevaMateriaColor, setNuevaMateriaColor] = useState("#f28b82");
  const coloresDisponibles = [
    "#f28b82",
    "#fbbc04",
    "#34a853",
    "#a7ffeb",
    "#cbf0f8",
    "#aecbfa",
    "#d7aefb",
    "#a4c639",
  ];
  const [materiaModalVisible, setMateriaModalVisible] = useState(false);
  const [materiaSeleccionada, setMateriaSeleccionada] = useState<
    Materia | undefined
  >(undefined);

  // Colores de prioridad
  const prioridadColores = {
    Baja: "#55BCF6", // Azul por defecto
    Media: "#55BCF6", // Amarillo Se manejara el azul por defecto
    Alta: "#55BCF6", // Rojo
  };

  const colorRepetirActivo = "#55BCF6"; // Morado pastel para opciones de repetir activo
  const colorRepetirInactivo = "#000"; // Negro por defecto

  // Track the initial values to detect any changes
  const initialValues = JSON.stringify({
    nombre: tareaInicial?.nombre || "",
    prioridad: tareaInicial?.prioridad || "Baja",
    materia: tareaInicial?.materia || "Ninguna",
    fechaVencimiento:
      tareaInicial?.fechaVencimiento || new Date().toLocaleDateString("en-CA"),
    repetir: tareaInicial?.repetir || null,
    pomodoro: tareaInicial?.pomodoro || {
      duracion: 25,
      descanso: 5,
      intervalo: 1,
    },
  });

  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setMateriasDisponibles(materiasGlobales.map((materia) => materia.event));
  }, [materiasGlobales]);

  useEffect(() => {
    const currentValues = JSON.stringify({
      nombre: tareaNombre,
      prioridad: tareaPrioridad,
      materia: tareaMateria,
      fechaVencimiento: tareaFechaVencimiento,
      repetir: repetirFrecuencia,
      pomodoro: pomodoroConfig,
    });
    setHasChanges(currentValues !== initialValues);
  }, [
    tareaNombre,
    tareaPrioridad,
    tareaMateria,
    tareaFechaVencimiento,
    repetirFrecuencia,
    pomodoroConfig,
  ]);

  useEffect(() => {
    if (visible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    } else {
      scaleAnim.setValue(0);
    }
  }, [visible]);

  const handleCloseModal = () => {
    if (hasChanges) {
      Alert.alert(
        "Descartar cambios",
        "Tienes cambios sin guardar. ¿Estás seguro de que quieres salir sin guardar?",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Salir sin guardar", onPress: onClose, style: "destructive" },
        ],
      );
    } else {
      onClose();
    }
  };

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const now = moment().startOf("day");
      const chosenDate = moment(selectedDate).startOf("day");
      if (chosenDate.isBefore(now)) {
        setFechaError("No puedes seleccionar una fecha anterior a la actual.");
      } else {
        const formattedDate = chosenDate.format("YYYY-MM-DD");
        setTareaFechaVencimiento(formattedDate);
        setFechaError("");
      }
    }
  };

  const agregarMateriaNueva = () => {
    if (!nuevaMateriaNombre.trim()) {
      Alert.alert("Error", "El nombre de la materia es obligatorio.");
      return;
    }

    const nuevaMateria: Materia = {
      id: generateId(),
      time: "",
      event: nuevaMateriaNombre,
      color: nuevaMateriaColor,
      duration: 1,
    };

    // Agregar la nueva materia al contexto
    agregarMateriaAlContexto(nuevaMateria);
    setTareaMateria(nuevaMateria.id); // Asignar el ID de la nueva materia a tareaMateria

    // Cerrar el modal y resetear los campos
    setNuevaMateriaModalVisible(false);
    setNuevaMateriaNombre("");
    setNuevaMateriaColor("#f28b82");
  };

  // CAMBIAR AUTOMATICAMENTE EL PICKER A LA MATERIA NUEVA AL MOMENTO DE EDITAR
  useEffect(() => {
    if (!esEditar && materiasGlobales.length > 0) {
      const ultimaMateria = materiasGlobales[materiasGlobales.length - 1];
      setTareaMateria(ultimaMateria.id);
    }
  }, [materiasGlobales]); // Este efecto se ejecutará cada vez que materiasGlobales cambie

  // CAMBIAR AUTOMATICAMENTE EL PICKER A LA MATERIA NUEVA AL MOMENTO DE EDITAR
  useEffect(() => {
    // Seleccionar la última materia agregada automáticamente solo si no estamos editando
    if (esEditar && materiasGlobales.length > 0) {
      const ultimaMateria = materiasGlobales[materiasGlobales.length - 1];
      setTareaMateria(ultimaMateria.id);
    }
  }, [materiasGlobales]); // Este efecto se ejecutará cada vez que materiasGlobales cambie

  useEffect(() => {
    if (visible) {
      if (esEditar && tareaInicial) {
        // En modo de edición, establece el picker en la materia de la tarea inicial
        setTareaMateria(tareaInicial.materia);
      } else {
        // En modo creación, establece el picker en "Ninguna"
        setTareaMateria("Ninguna");
      }
    }
  }, [visible, esEditar, tareaInicial]);

  const handleGuardarTarea = () => {
    if (!tareaNombre.trim()) {
      Alert.alert("Error", "El nombre de la tarea es obligatorio.");
      return;
    }
    if (moment(tareaFechaVencimiento).isBefore(moment(), "day")) {
      setFechaError("La fecha de vencimiento no puede ser anterior a hoy.");
      return;
    }

    const tarea: Tarea = {
      id: esEditar && tareaInicial ? tareaInicial.id : generateId(),
      nombre: tareaNombre,
      prioridad: tareaPrioridad,
      materia: tareaMateria,
      fechaVencimiento: tareaFechaVencimiento,
      repetir: repetirFrecuencia,
      pomodoro: pomodoroConfig,
      completada: tareaInicial?.completada || false,
    };

    // Guardar la tarea según si está en modo edición o creación
    esEditar ? actualizarTarea(tarea) : agregarTarea(tarea);
    onClose();

    // Mostrar notificación Toast
    Toast.show({
      type: "success",
      text1: esEditar ? "Tarea actualizada" : "Tarea guardada",
      text2: esEditar
        ? "La tarea ha sido actualizada exitosamente."
        : "Tu tarea ha sido creada exitosamente.",
      position: "top",
      visibilityTime: 3000,
      topOffset: 60,
    });
  };

  const handleGuardarPomodoro = (config: {
    duracion: number;
    descanso: number;
    intervalo: number;
  }) => {
    setPomodoroConfig(config);
    setMostrarTimer(false);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleCloseModal}
    >
      <Pressable
        style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        onPress={handleCloseModal}
        onStartShouldSetResponder={() => true}
      >
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <StyledView
            className="bg-white shadow-lg rounded-3xl p-8 mt-32"
            onStartShouldSetResponder={() => true}
          >
            <StyledText className="text-3xl font-semibold text-center text-[#0891b2] mb-4">
              {esEditar ? "Editar Tarea" : "Agregar Tarea"}
            </StyledText>

            <StyledText className="text-lg font-semibold text-gray-700">
              Nombre de la Tarea
            </StyledText>
            <StyledTextInput
              className="border border-gray-200 rounded-lg px-4 py-3 mb-4"
              value={tareaNombre}
              onChangeText={(text) => {
                if (text.length <= 30) setTareaNombre(text);
              }}
              placeholder="Nombre de la tarea"
            />

            <StyledText className="text-lg font-semibold text-gray-700">
              Materia
            </StyledText>
            <StyledView className="border border-gray-200 rounded-lg mt-2 mb-4">
              <Picker
                selectedValue={tareaMateria}
                onValueChange={(itemValue) => {
                  if (itemValue === "AgregarMateria") {
                    setMateriaSeleccionada(undefined);
                    setMateriaModalVisible(true);
                  } else if (itemValue === "Ninguna") {
                    setMateriaSeleccionada(undefined);
                    setTareaMateria("Ninguna");
                  } else {
                    const materia = materiasGlobales.find(
                      (mat) => mat.id === itemValue,
                    );
                    if (materia) {
                      setMateriaSeleccionada(materia);
                      setTareaMateria(materia.id); // Establece el ID de la materia seleccionada
                    }
                  }
                }}
                style={{ color: "#1f2937" }}
              >
                <Picker.Item label="Ninguna" value="Ninguna" />
                {materiasGlobales.map((materia) => (
                  <Picker.Item
                    key={materia.id}
                    label={materia.event}
                    value={materia.id}
                  />
                ))}
                <Picker.Item label="+ Agregar Materia" value="AgregarMateria" />
              </Picker>
            </StyledView>

            <MateriaModal
              visible={materiaModalVisible}
              onClose={() => setMateriaModalVisible(false)}
              materia={materiaSeleccionada} // undefined para crear, materia para editar
              onSave={() => setMateriaModalVisible(false)}
            />

            <Modal
              visible={nuevaMateriaModalVisible}
              transparent={true}
              animationType="slide"
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                }}
              >
                <View
                  style={{
                    backgroundColor: "white",
                    padding: 20,
                    borderRadius: 10,
                    width: "80%",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      marginBottom: 10,
                    }}
                  >
                    Nueva Materia
                  </Text>
                  <TextInput
                    value={nuevaMateriaNombre}
                    onChangeText={setNuevaMateriaNombre}
                    style={{
                      borderWidth: 1,
                      borderColor: "#ccc",
                      padding: 8,
                      borderRadius: 5,
                      marginBottom: 10,
                    }}
                    placeholder="Nombre de la materia"
                  />
                  <Text style={{ fontWeight: "bold" }}>Color:</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      marginTop: 10,
                    }}
                  >
                    {coloresDisponibles.map((color) => (
                      <TouchableOpacity
                        key={color}
                        onPress={() => setNuevaMateriaColor(color)}
                        style={{
                          backgroundColor: color,
                          width: 30,
                          height: 30,
                          margin: 5,
                          borderRadius: 15,
                          borderWidth: color === nuevaMateriaColor ? 2 : 0,
                          borderColor: "black",
                        }}
                      />
                    ))}
                  </View>
                  <Button
                    title="Guardar Materia"
                    onPress={agregarMateriaNueva}
                  />
                  <Button
                    title="Cancelar"
                    color="red"
                    onPress={() => setNuevaMateriaModalVisible(false)}
                  />
                </View>
              </View>
            </Modal>

            <StyledText className="text-lg font-semibold text-gray-700">
              Fecha de Vencimiento
            </StyledText>
            <StyledPressable onPress={() => setShowDatePicker(true)}>
              <StyledTextInput
                className="border border-gray-200 rounded-lg px-4 py-3 mt-2 mb-4 text-gray-700"
                value={tareaFechaVencimiento}
                editable={false}
              />
            </StyledPressable>
            {fechaError ? (
              <StyledText className="text-sm text-red-500">
                {fechaError}
              </StyledText>
            ) : null}

            {showDatePicker && (
              <DateTimePicker
                value={new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={handleDateChange}
              />
            )}

            <StyledScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                justifyContent: "center",
                alignItems: "center",
              }}
              className="my-2 flex-row"
            >
              {/* Priority Icon with dynamic color */}
              <StyledPressable
                onPress={() => setMostrarNotificacion("Prioridad")}
                className="items-center justify-center mx-3"
              >
                <FontAwesome5
                  name="font-awesome-flag"
                  size={28}
                  color={prioridadColores[tareaPrioridad]}
                />
                <StyledText className="text-sm text-gray-600 mt-1 mr-4 text-center">
                  {"    "}
                  Prioridad
                </StyledText>
              </StyledPressable>

              <StyledPressable
                onPress={() => setMostrarTimer(true)}
                className="items-center justify-center mx-3"
              >
                <FontAwesome5 name="clock" size={28} color="black" />
                <StyledText className="text-sm text-gray-600 mt-1 mr-4 text-center">
                  {"    "}
                  Pomodoro
                </StyledText>
              </StyledPressable>

              {/* Repeat Icon with dynamic color */}
              <StyledPressable
                onPress={() => setMostrarNotificacion("Repetir")}
                className="items-center justify-center mx-3"
              >
                <FontAwesome5
                  name="redo"
                  size={24}
                  color={
                    repetirFrecuencia && repetirFrecuencia !== "No repetir"
                      ? colorRepetirActivo
                      : colorRepetirInactivo
                  }
                />
                <StyledText className="text-sm text-gray-600 mt-1 mr-3 text-center">
                  {"    "}
                  Repetir
                </StyledText>
              </StyledPressable>
            </StyledScrollView>

            {mostrarTimer && (
              <Timer
                visible={mostrarTimer}
                onSave={handleGuardarPomodoro}
                onClose={() => setMostrarTimer(false)}
                duracionInicial={pomodoroConfig.duracion}
                descansoInicial={pomodoroConfig.descanso}
                intervaloInicial={pomodoroConfig.intervalo}
              />
            )}

            {mostrarNotificacion && (
              <Modal
                transparent={true}
                visible={!!mostrarNotificacion}
                animationType="fade"
                onRequestClose={() => setMostrarNotificacion(null)}
              >
                <Pressable
                  style={{
                    flex: 1,
                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => setMostrarNotificacion(null)}
                  onStartShouldSetResponder={() => true}
                >
                  <Animated.View
                    style={{
                      width: "85%",
                      maxWidth: 400,
                      backgroundColor: "white",
                      borderRadius: 20,
                      paddingVertical: 25,
                      paddingHorizontal: 20,
                      alignItems: "center",
                      shadowColor: "#000",
                      shadowOpacity: 0.4,
                      shadowRadius: 15,
                      elevation: 12,
                    }}
                    onStartShouldSetResponder={() => true}
                  >
                    {/* Header with Icon */}
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 20,
                      }}
                    >
                      {mostrarNotificacion === "Repetir" ? (
                        <MaterialIcons
                          name="repeat-on"
                          size={28}
                          color="#0891b2"
                        />
                      ) : (
                        <MaterialIcons
                          name="flag-circle"
                          size={35}
                          color="#0891b2"
                        />
                      )}
                      <Text
                        style={{
                          fontSize: 22,
                          fontWeight: "700",
                          color: "#0891b2",
                          marginLeft: 10,
                          textAlign: "center",
                        }}
                      >
                        {mostrarNotificacion === "Repetir"
                          ? "Configurar Repetición"
                          : "Configurar Prioridad"}
                      </Text>
                    </View>

                    {/* Picker Content */}
                    <View
                      style={{
                        width: "100%",
                        borderRadius: 10,
                        overflow: "hidden",
                        borderWidth: 1,
                        borderColor: "#ccc",
                      }}
                    >
                      {mostrarNotificacion === "Repetir" ? (
                        <Picker
                          selectedValue={repetirFrecuencia || "No repetir"}
                          onValueChange={(value) => setRepetirFrecuencia(value)}
                          style={{ height: 60, width: "100%", color: "#333" }}
                        >
                          <Picker.Item label="No repetir" value="No repetir" />
                          <Picker.Item label="Diario" value="Diario" />
                          <Picker.Item label="Semanal" value="Semanal" />
                          <Picker.Item label="Mensual" value="Mensual" />
                        </Picker>
                      ) : (
                        <Picker
                          selectedValue={tareaPrioridad}
                          onValueChange={(
                            itemValue: "Baja" | "Media" | "Alta",
                          ) => setTareaPrioridad(itemValue)}
                          style={{ height: 50, width: "100%", color: "#333" }}
                        >
                          <Picker.Item label="!Baja" value="Baja" />
                          <Picker.Item label="!!Media" value="Media" />
                          <Picker.Item label="!!!Alta" value="Alta" />
                        </Picker>
                      )}
                    </View>
                  </Animated.View>
                </Pressable>
              </Modal>
            )}

            <StyledPressable
              onPress={handleGuardarTarea}
              className="mt-6 p-4 bg-[#0891b2] rounded-full items-center shadow-lg"
            >
              <StyledText className="text-white font-bold text-lg">
                Guardar Tarea
              </StyledText>
            </StyledPressable>
          </StyledView>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}
