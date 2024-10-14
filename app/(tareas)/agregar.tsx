import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  Switch,
  Button,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useTareas } from "../../context/TareasContext"; // Asegúrate de usar el contexto adecuado
import { Tarea } from "../../interfaces/Tarea";
import { Picker } from "@react-native-picker/picker";

// Función para generar un ID único
const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export default function AgregarTarea() {
  const router = useRouter();
  const { agregarTarea } = useTareas(); // Obtenemos la función para agregar la tarea al contexto

  const [tareaNombre, setTareaNombre] = useState("");
  const [tareaPrioridad, setTareaPrioridad] = useState<
    "Baja" | "Media" | "Alta"
  >("Media");
  const [tareaMateria, setTareaMateria] = useState("");
  const [tareaFechaVencimiento, setTareaFechaVencimiento] = useState("");
  const [tareaRepetir, setTareaRepetir] = useState(false);
  const [configurarPomodoro, setConfigurarPomodoro] = useState(false);
  const [pomodoroConfig, setPomodoroConfig] = useState({
    duracion: 25,
    descanso: 5,
    intervalo: 4,
  });

  const handleAgregarTarea = () => {
    const nuevaTarea: Tarea = {
      id: generateId(), // Genera un ID único
      nombre: tareaNombre,
      prioridad: tareaPrioridad,
      materia: tareaMateria,
      fechaVencimiento: tareaFechaVencimiento,
      repetir: tareaRepetir,
      pomodoro: configurarPomodoro ? pomodoroConfig : undefined,
    };

    agregarTarea(nuevaTarea); // Agregamos la nueva tarea al contexto o estado global
    router.back(); // Volvemos a la pantalla anterior
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
      >
        <Picker.Item label="Baja" value="Baja" />
        <Picker.Item label="Media" value="Media" />
        <Picker.Item label="Alta" value="Alta" />
      </Picker>

      <Text>Materia</Text>
      <TextInput
        style={{
          borderColor: "gray",
          borderWidth: 1,
          padding: 8,
          marginVertical: 10,
        }}
        value={tareaMateria}
        onChangeText={setTareaMateria}
        placeholder="Materia"
      />

      <Text>Fecha de Vencimiento (AAAA-MM-DD)</Text>
      <TextInput
        style={{
          borderColor: "gray",
          borderWidth: 1,
          padding: 8,
          marginVertical: 10,
        }}
        value={tareaFechaVencimiento}
        onChangeText={setTareaFechaVencimiento}
        placeholder="Fecha de vencimiento"
      />

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
