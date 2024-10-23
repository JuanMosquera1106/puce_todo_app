import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  View,
  Pressable,
  Modal,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform } from "react-native";
import { styled } from "nativewind";
import { Tarea } from "../interfaces/Tarea";
import { useTareas } from "../context/TareasContext";
import {
  PriorityIcon,
  CalendarIcon,
  RepeatIcon,
  RememberIcon,
  TimeIcon,
  CloseIcon,
  AceptIcon,
} from "../components/Icons";
import moment from "moment";
import Timer from "./Timer"; // Importar el componente Timer

// Componentes estilizados
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledPressable = styled(Pressable);
const StyledScrollView = styled(ScrollView);

const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

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

  // Estados iniciales con valores predeterminados
  const [tareaNombre, setTareaNombre] = useState(tareaInicial?.nombre || "");
  const [tareaPrioridad, setTareaPrioridad] = useState<
    "Baja" | "Media" | "Alta"
  >(tareaInicial?.prioridad || "Baja");
  const [tareaMateria, setTareaMateria] = useState(
    tareaInicial?.materia || "Ninguna",
  );
  const [tareaFechaVencimiento, setTareaFechaVencimiento] = useState(
    tareaInicial?.fechaVencimiento || new Date().toLocaleDateString("en-CA"), // Formato local "YYYY-MM-DD"
  );

  const [repetirFrecuencia, setRepetirFrecuencia] = useState<string | null>(
    tareaInicial?.repetir || null,
  );
  const [pomodoroConfig, setPomodoroConfig] = useState(
    tareaInicial?.pomodoro || {
      duracion: 25, // Valores por defecto
      descanso: 5,
      intervalo: 1,
    },
  );
  const [recordatorio, setRecordatorio] = useState<{
    hora: string;
    tipo: string;
  } | null>(tareaInicial?.recordatorio || null);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [mostrarNotificacion, setMostrarNotificacion] = useState<
    "Pomodoro" | "Recordatorios" | "Repetir" | "Prioridad" | null
  >(null);

  const [mostrarTimer, setMostrarTimer] = useState(false); // Estado para mostrar el Timer

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = moment(selectedDate)
        .startOf("day") // Establecer la hora a las 00:00:00
        .format("YYYY-MM-DD"); // Formato ISO o cualquier formato que prefieras

      setTareaFechaVencimiento(formattedDate);
    }
  };

  // Validar que el nombre de la tarea no esté vacío y que no exceda los 200 caracteres
  const handleGuardarTarea = () => {
    if (!tareaNombre.trim()) {
      Alert.alert("Error", "El nombre de la tarea es obligatorio."); // Mostrar alerta si el nombre está vacío
      return;
    }

    if (tareaNombre.length > 200) {
      Alert.alert(
        "Error",
        "El nombre de la tarea no debe exceder los 200 caracteres.",
      ); // Mostrar alerta si el nombre excede los 200 caracteres
      return;
    }

    const tarea: Tarea = {
      id: esEditar && tareaInicial ? tareaInicial.id : generateId(),
      nombre: tareaNombre,
      prioridad: tareaPrioridad,
      materia: tareaMateria,
      fechaVencimiento: tareaFechaVencimiento,
      repetir: repetirFrecuencia,
      recordatorio: recordatorio,
      pomodoro: pomodoroConfig,
    };

    if (esEditar) {
      actualizarTarea(tarea);
    } else {
      agregarTarea(tarea);
    }

    onClose();
  };

  // Función para manejar el guardado de la configuración del Pomodoro
  const handleGuardarPomodoro = (config: {
    duracion: number;
    descanso: number;
    intervalo: number;
  }) => {
    setPomodoroConfig(config);
    setMostrarTimer(false); // Cerrar el modal del Timer después de guardar
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <StyledPressable
        style={{
          flex: 1,
          justifyContent: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
        onPress={onClose}
      >
        <StyledView
          className="flex-1 justify-end items-center bg-opacity-500"
          onStartShouldSetResponder={() => true} // Para evitar cerrar el modal al hacer clic en su contenido
        >
          <StyledView className="bg-white p-6 border border-gray-300 rounded-lg w-[99%]">
            <StyledText className="text-2xl mb-4">
              {esEditar ? "Editar Tarea" : "Agregar Tarea"}
            </StyledText>

            {/* Materia */}
            <StyledText className="text-lg">Materia</StyledText>
            <StyledView className="border border-gray-300 rounded-md my-1 p-1">
              <Picker
                selectedValue={tareaMateria}
                onValueChange={(itemValue) => setTareaMateria(itemValue)}
              >
                <Picker.Item label="Ninguna" value="Ninguna" />
                <Picker.Item label="Matemáticas" value="Matemáticas" />
                <Picker.Item label="Historia" value="Historia" />
                <Picker.Item label="Ciencias" value="Ciencias" />
              </Picker>
            </StyledView>

            {/* Nombre de la Tarea */}
            <StyledText className="text-lg">Nombre de la Tarea</StyledText>
            <StyledTextInput
              className="border border-gray-300 rounded-md p-3 my-2"
              value={tareaNombre}
              onChangeText={setTareaNombre}
              placeholder="Nombre de la tarea"
            />

            {/* Opciones adicionales (Pomodoro, Recordatorio, Prioridad) */}
            <StyledScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="my-4"
            >
              <StyledPressable
                onPress={() => setMostrarTimer(true)} // Mostrar el Timer al hacer clic en el icono del reloj
                className="mx-3"
              >
                <TimeIcon />
              </StyledPressable>

              <StyledPressable
                onPress={() => setMostrarNotificacion("Recordatorios")}
                className="mx-3"
              >
                <RememberIcon />
              </StyledPressable>

              <StyledPressable
                onPress={() => setMostrarNotificacion("Repetir")}
                className="mx-3"
              >
                <RepeatIcon />
              </StyledPressable>

              <StyledPressable
                onPress={() => setMostrarNotificacion("Prioridad")}
                className="mx-3"
              >
                <PriorityIcon />
              </StyledPressable>

              <StyledPressable
                onPress={() => setShowDatePicker(true)}
                className="mx-3"
              >
                <CalendarIcon />
              </StyledPressable>
            </StyledScrollView>

            {/* DateTimePicker para la fecha */}
            {showDatePicker && (
              <DateTimePicker
                value={new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={handleDateChange}
              />
            )}

            {/* Modal del Timer */}
            {mostrarTimer && (
              <Timer
                visible={mostrarTimer}
                onSave={handleGuardarPomodoro} // Guardar la configuración del Pomodoro
                onClose={() => setMostrarTimer(false)} // Cerrar el Timer sin guardar
                duracionInicial={pomodoroConfig.duracion}
                descansoInicial={pomodoroConfig.descanso}
                intervaloInicial={pomodoroConfig.intervalo}
              />
            )}

            {/* Botón para guardar la tarea */}
            <StyledPressable
              className="absolute top-4 right-4"
              onPress={handleGuardarTarea}
            >
              <AceptIcon />
            </StyledPressable>
          </StyledView>
        </StyledView>
      </StyledPressable>
    </Modal>
  );
}
