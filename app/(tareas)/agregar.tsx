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
import DateTimePicker from "@react-native-community/datetimepicker"; // Importamos el DateTimePicker
import { Platform } from "react-native";

// Función para generar un ID único
const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export default function AgregarTarea() {
  const router = useRouter();
  const { agregarTarea } = useTareas();

  const [tareaNombre, setTareaNombre] = useState("");
  const [tareaPrioridad, setTareaPrioridad] = useState<
    "Baja" | "Media" | "Alta"
  >("Baja");
  const [tareaMateria, setTareaMateria] = useState("Ninguna");
  const [tareaFechaVencimiento, setTareaFechaVencimiento] = useState("");
  const [tareaRepetir, setTareaRepetir] = useState(false);
  const [configurarPomodoro, setConfigurarPomodoro] = useState(false);
  const [pomodoroConfig, setPomodoroConfig] = useState({
    duracion: 25,
    descanso: 5,
    intervalo: 4,
  });

  // Estado para controlar el DateTimePicker
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Manejador del cambio de fecha
  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowDatePicker(false); // Ocultamos el picker tras seleccionar una fecha
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split("T")[0]; // Formato AAAA-MM-DD
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
      pomodoro: configurarPomodoro ? pomodoroConfig : undefined,
    };

    agregarTarea(nuevaTarea);
    router.back();
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20 }}>
      <Text style={{ fontSize: 24 }}>Agregar Tarea</Text>

      <Text>Nombre de la Tarea</Text>
      <TextInput
        style={{
          borderColor: "gray",
          borderWidth: 1,
          padding: 8,
          marginVertical: 10,
        }}
        value={tareaNombre}
        onChangeText={setTareaNombre}
        placeholder="Nombre de la tarea"
      />

      <Text>Prioridad</Text>
      <Picker
        selectedValue={tareaPrioridad}
        onValueChange={(itemValue: "Baja" | "Media" | "Alta") =>
          setTareaPrioridad(itemValue)
        }
        style={{ borderColor: "gray", borderWidth: 1, marginVertical: 10 }}
      >
        <Picker.Item label="Baja" value="Baja" />
        <Picker.Item label="Media" value="Media" />
        <Picker.Item label="Alta" value="Alta" />
      </Picker>

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

      <Text>Fecha de Vencimiento</Text>
      <Pressable
        onPress={() => setShowDatePicker(true)} // Mostramos el picker al presionar
        style={{
          borderColor: "gray",
          borderWidth: 1,
          padding: 8,
          marginVertical: 10,
        }}
      >
        <Text>{tareaFechaVencimiento || "Seleccionar fecha"}</Text>
      </Pressable>

      {showDatePicker && (
        <DateTimePicker
          value={new Date()} // Fecha inicial (actual)
          mode="date" // Selección de solo fecha
          display={Platform.OS === "ios" ? "spinner" : "default"} // Tipo de visualización
          onChange={handleDateChange} // Manejador para la fecha seleccionada
        />
      )}

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginVertical: 10,
        }}
      >
        <Text>Repetir</Text>
        <Switch value={tareaRepetir} onValueChange={setTareaRepetir} />
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginVertical: 10,
        }}
      >
        <Text>¿Configurar Pomodoro?</Text>
        <Switch
          value={configurarPomodoro}
          onValueChange={setConfigurarPomodoro}
        />
      </View>

      {configurarPomodoro && (
        <View>
          <Text>Duración del Pomodoro (minutos)</Text>
          <TextInput
            style={{
              borderColor: "gray",
              borderWidth: 1,
              padding: 8,
              marginVertical: 10,
            }}
            keyboardType="numeric"
            value={pomodoroConfig.duracion.toString()}
            onChangeText={(value) =>
              setPomodoroConfig({
                ...pomodoroConfig,
                duracion: parseInt(value, 10),
              })
            }
            placeholder="Duración del Pomodoro"
          />

          <Text>Tiempo de Descanso (minutos)</Text>
          <TextInput
            style={{
              borderColor: "gray",
              borderWidth: 1,
              padding: 8,
              marginVertical: 10,
            }}
            keyboardType="numeric"
            value={pomodoroConfig.descanso.toString()}
            onChangeText={(value) =>
              setPomodoroConfig({
                ...pomodoroConfig,
                descanso: parseInt(value, 10),
              })
            }
            placeholder="Tiempo de Descanso"
          />

          <Text>Intervalo de Descanso</Text>
          <TextInput
            style={{
              borderColor: "gray",
              borderWidth: 1,
              padding: 8,
              marginVertical: 10,
            }}
            keyboardType="numeric"
            value={pomodoroConfig.intervalo.toString()}
            onChangeText={(value) =>
              setPomodoroConfig({
                ...pomodoroConfig,
                intervalo: parseInt(value, 10),
              })
            }
            placeholder="Intervalo de Descanso"
          />
        </View>
      )}

      <Button title="Agregar Tarea" onPress={handleAgregarTarea} />
    </ScrollView>
  );
}
