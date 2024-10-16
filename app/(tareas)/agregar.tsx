import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  Switch,
  Button,
  View,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { useTareas } from "../../context/TareasContext";
import { Tarea } from "../../interfaces/Tarea";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform } from "react-native";
import Timer from "../../components/Timer"; // Importar el componente Timer

// Función para generar un ID único
const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export default function AgregarTarea() {
  const router = useRouter();
  const { agregarTarea } = useTareas();

  const [tareaNombre, setTareaNombre] = useState("");
  const [tareaPrioridad, setTareaPrioridad] = useState<"Baja" | "Media" | "Alta">("Baja");
  const [tareaMateria, setTareaMateria] = useState("Ninguna");
  const [tareaFechaVencimiento, setTareaFechaVencimiento] = useState("");
  const [tareaRepetir, setTareaRepetir] = useState(false);
  const [configurarPomodoro, setConfigurarPomodoro] = useState(false);
  const [pomodoroConfig, setPomodoroConfig] = useState<{ duracion: number; descanso: number; intervalo: number } | undefined>(undefined); // Estado para almacenar la configuración del Pomodoro

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); // Control del modal de Timer

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split("T")[0];
      setTareaFechaVencimiento(formattedDate);
    }
  };

  const handleAgregarTarea = () => {
    const nuevaTarea: Tarea = {
      id: generateId(),
      nombre: tareaNombre,
      prioridad: tareaPrioridad,
      materia: tareaMateria,
      fechaVencimiento: tareaFechaVencimiento,
      repetir: tareaRepetir,
      pomodoro: configurarPomodoro ? pomodoroConfig : undefined, // Solo agregar la configuración si está activada
    };

    agregarTarea(nuevaTarea);
    router.back();
  };

  const handlePomodoroSwitch = (value: boolean) => {
    setConfigurarPomodoro(value);
    if (value) {
      setModalVisible(true); // Muestra el modal directamente cuando se activa el switch
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20 }}>
      <Text style={{ fontSize: 24 }}>Agregar Tarea</Text>

      {/* Campo para el nombre de la tarea */}
      <Text>Nombre de la Tarea</Text>
      <TextInput
        style={{ borderColor: "gray", borderWidth: 1, padding: 8, marginVertical: 10 }}
        value={tareaNombre}
        onChangeText={setTareaNombre}
        placeholder="Nombre de la tarea"
      />

      {/* Picker para la prioridad */}
      <Text>Prioridad</Text>
      <Picker
        selectedValue={tareaPrioridad}
        onValueChange={(itemValue: "Baja" | "Media" | "Alta") => setTareaPrioridad(itemValue)}
        style={{ borderColor: "gray", borderWidth: 1, marginVertical: 10 }}
      >
        <Picker.Item label="Baja" value="Baja" />
        <Picker.Item label="Media" value="Media" />
        <Picker.Item label="Alta" value="Alta" />
      </Picker>

      {/* Picker para la materia */}
      <Text>Materia</Text>
      <Picker
        selectedValue={tareaMateria}
        onValueChange={(itemValue) => setTareaMateria(itemValue)}
        style={{ borderColor: "gray", borderWidth: 1, marginVertical: 10 }}
      >
        <Picker.Item label="Ninguna" value="Ninguna" />
        <Picker.Item label="Matemáticas" value="Matemáticas" />
        <Picker.Item label="Historia" value="Historia" />
        <Picker.Item label="Ciencias" value="Ciencias" />
      </Picker>

      {/* Fecha de vencimiento */}
      <Text>Fecha de Vencimiento</Text>
      <Pressable
        onPress={() => setShowDatePicker(true)} // Mostramos el picker al presionar
        style={{ borderColor: "gray", borderWidth: 1, padding: 8, marginVertical: 10 }}
      >
        <Text>{tareaFechaVencimiento || "Seleccionar fecha"}</Text>
      </Pressable>

      {showDatePicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateChange}
        />
      )}

      {/* Switch para repetir tarea */}
      <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 10 }}>
        <Text>Repetir</Text>
        <Switch value={tareaRepetir} onValueChange={setTareaRepetir} />
      </View>

      {/* Switch para configurar Pomodoro */}
      <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 10 }}>
        <Text>¿Configurar Pomodoro?</Text>
        <Switch
          value={configurarPomodoro}
          onValueChange={handlePomodoroSwitch} // Llamamos a la función para abrir el modal
        />
      </View>

      {/* Modal de configuración de Pomodoro */}
      {configurarPomodoro && modalVisible && (
        <Timer
          onSave={(config) => {
            setPomodoroConfig(config);
            setModalVisible(false); // Cerrar el modal después de guardar
          }}
        />
      )}

      <Button title="Agregar Tarea" onPress={handleAgregarTarea} />
    </ScrollView>
  );
}
