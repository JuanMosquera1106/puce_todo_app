import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  Button,
  View,
  Pressable,
  Modal,
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
} from "../components/Icons";
import Timer from "../components/Timer"; // Importamos el componente Timer

// Componentes estilizados
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledButton = styled(Button);
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

  const [tareaNombre, setTareaNombre] = useState(tareaInicial?.nombre || "");
  const [tareaPrioridad, setTareaPrioridad] = useState<"Baja" | "Media" | "Alta">(
    tareaInicial?.prioridad || "Baja"
  );
  const [tareaMateria, setTareaMateria] = useState(tareaInicial?.materia || "Ninguna");
  const [tareaFechaVencimiento, setTareaFechaVencimiento] = useState(tareaInicial?.fechaVencimiento || "");
  const [repetirFrecuencia, setRepetirFrecuencia] = useState<string | null>(tareaInicial?.repetir || null);
  const [pomodoroConfig, setPomodoroConfig] = useState(
    tareaInicial?.pomodoro || { duracion: 25, descanso: 5, intervalo: 4 }
  );
  const [recordatorio, setRecordatorio] = useState<{ hora: string; tipo: string } | null>(
    tareaInicial?.recordatorio || null
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [mostrarNotificacion, setMostrarNotificacion] = useState<"Recordatorios" | "Repetir" | "Prioridad" | null>(null);

  // Estado para mostrar el modal de configuración del Timer
  const [mostrarTimer, setMostrarTimer] = useState(false);

  // Función para manejar el cambio de fecha
  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split("T")[0];
      setTareaFechaVencimiento(formattedDate);
    }
  };

  // Función para guardar la tarea
  const handleGuardarTarea = () => {
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

  // Función para guardar la configuración del temporizador Pomodoro
  const handleGuardarPomodoro = (config: { duracion: number; descanso: number; intervalo: number }) => {
    setPomodoroConfig(config); // Actualiza la configuración del Pomodoro
    setMostrarTimer(false); // Cierra el modal del Timer
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
        <StyledView className="flex-1 justify-end items-center bg-opacity-500">
          <StyledView
            className="bg-white p-6 border border-gray-300 rounded-lg w-[99%]"
            onStartShouldSetResponder={() => true}
          >
            <StyledText className="text-2xl mb-4">
              {esEditar ? "Editar Tarea" : "Agregar Tarea"}
            </StyledText>

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

            <StyledText className="text-lg">Nombre de la Tarea</StyledText>
            <StyledTextInput
              className="border border-gray-300 rounded-md p-3 my-2"
              value={tareaNombre}
              onChangeText={setTareaNombre}
              placeholder="Nombre de la tarea"
            />

            {/* Fila de opciones con scroll horizontal */}
            <StyledScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="my-4"
            >
              {/* Ícono de reloj para abrir el Timer */}
              <StyledPressable
                onPress={() => setMostrarTimer(true)} // Mostrar modal del Timer
                className="mx-3"
              >
                <TimeIcon />
              </StyledPressable>

              <StyledPressable
                onPress={() => setShowDatePicker(true)}
                className="mx-3"
              >
                <CalendarIcon />
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
            </StyledScrollView>

            {showDatePicker && (
              <DateTimePicker
                value={new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={handleDateChange}
              />
            )}

       {/* Mostrar el Timer */}
       {mostrarTimer && (
        <Timer
          visible={mostrarTimer}
          duracionInicial={pomodoroConfig.duracion} // Pasar los valores actuales como iniciales
          descansoInicial={pomodoroConfig.descanso}
          intervaloInicial={pomodoroConfig.intervalo}
          onSave={handleGuardarPomodoro} // Guardar la configuración del Pomodoro
          onClose={() => setMostrarTimer(false)} // Cerrar el modal del Timer
        />
      )}

            {/* Modales adicionales */}
            {mostrarNotificacion && (
              <Modal
                transparent={true}
                visible={!!mostrarNotificacion}
                animationType="fade"
                onRequestClose={() => setMostrarNotificacion(null)}
              >
                <StyledPressable
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                  }}
                  onPress={onClose}
                >
                  <StyledView className="flex-1 mb-[120px] justify-end items-center bg-opacity-10">
                    <StyledView
                      className="bg-white p-6 border border-gray-300 rounded-lg w-4/5 relative"
                      onStartShouldSetResponder={() => true}
                    >
                      <StyledPressable
                        onPress={() => setMostrarNotificacion(null)}
                        className="absolute top-4 right-4"
                      >
                        <CloseIcon />
                      </StyledPressable>

                      {mostrarNotificacion === "Recordatorios" && (
                        <StyledView>
                          <StyledText className="text-lg mb-4">
                            Configurar Recordatorio
                          </StyledText>
                          <StyledTextInput
                            className="border border-gray-300 rounded-md p-2 my-2"
                            placeholder="HH:MM"
                            value={recordatorio?.hora || ""}
                            onChangeText={(value) =>
                              setRecordatorio({
                                ...recordatorio,
                                hora: value || "",
                                tipo: recordatorio?.tipo || "Diario",
                              })
                            }
                          />
                          <Picker
                            selectedValue={recordatorio?.tipo || "Diario"}
                            onValueChange={(value) =>
                              setRecordatorio({
                                ...recordatorio,
                                tipo: value,
                                hora: recordatorio?.hora || "",
                              })
                            }
                          >
                            <Picker.Item label="Diario" value="Diario" />
                            <Picker.Item label="Semanal" value="Semanal" />
                            <Picker.Item label="Mensual" value="Mensual" />
                          </Picker>
                        </StyledView>
                      )}

                      {mostrarNotificacion === "Repetir" && (
                        <StyledView>
                          <StyledText className="text-lg mb-4">
                            Configurar Repetición
                          </StyledText>
                          <Picker
                            selectedValue={repetirFrecuencia || "No repetir"}
                            onValueChange={(value) => setRepetirFrecuencia(value)}
                          >
                            <Picker.Item label="No repetir" value="No repetir" />
                            <Picker.Item label="Diario" value="Diario" />
                            <Picker.Item label="Semanal" value="Semanal" />
                            <Picker.Item label="Mensual" value="Mensual" />
                          </Picker>
                        </StyledView>
                      )}

                      {mostrarNotificacion === "Prioridad" && (
                        <StyledView>
                          <StyledText className="text-lg mb-4">
                            Configurar Prioridad
                          </StyledText>
                          <Picker
                            selectedValue={tareaPrioridad}
                            onValueChange={(itemValue: "Baja" | "Media" | "Alta") => setTareaPrioridad(itemValue)}
                          >
                            <Picker.Item label="Baja" value="Baja" />
                            <Picker.Item label="Media" value="Media" />
                            <Picker.Item label="Alta" value="Alta" />
                          </Picker>
                        </StyledView>
                      )}
                    </StyledView>
                  </StyledView>
                </StyledPressable>
              </Modal>
            )}

            <StyledButton
              title={esEditar ? "Guardar Cambios" : "Agregar Tarea"}
              onPress={handleGuardarTarea}
            />
          </StyledView>
        </StyledView>
      </StyledPressable>
    </Modal>
  );
}
