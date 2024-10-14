import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  Switch,
  Button,
  View,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTareas } from "../../context/TareasContext"; // Asegúrate de usar el contexto o método adecuado
import { Tarea } from "../../interfaces/Tarea";
import { Picker } from "@react-native-picker/picker";

export default function EditarTarea() {
  const router = useRouter();
  const { actualizarTarea } = useTareas(); // Obtenemos la función de actualización del contexto
  const {
    id,
    nombre,
    prioridad,
    materia,
    fechaVencimiento,
    repetir,
    pomodoro,
  } = useLocalSearchParams();

  const pomodoroData =
    pomodoro && typeof pomodoro === "string" ? JSON.parse(pomodoro) : undefined;

  const [tareaNombre, setTareaNombre] = useState(nombre as string);
  const [tareaPrioridad, setTareaPrioridad] = useState<
    "Baja" | "Media" | "Alta"
  >(prioridad as "Baja" | "Media" | "Alta");
  const [tareaMateria, setTareaMateria] = useState(materia as string);
  const [tareaFechaVencimiento, setTareaFechaVencimiento] = useState(
    fechaVencimiento as string,
  );
  const [tareaRepetir, setTareaRepetir] = useState(repetir === "true");
  const [configurarPomodoro, setConfigurarPomodoro] = useState(!!pomodoroData);
  const [pomodoroConfig, setPomodoroConfig] = useState(
    pomodoroData
      ? {
          duracion: parseInt(pomodoroData.duracion, 10) || 25,
          descanso: parseInt(pomodoroData.descanso, 10) || 5,
          intervalo: parseInt(pomodoroData.intervalo, 10) || 4,
        }
      : { duracion: 25, descanso: 5, intervalo: 4 },
  );

  const handleGuardarCambios = () => {
    const tareaActualizada: Tarea = {
      id: id as string,
      nombre: tareaNombre,
      prioridad: tareaPrioridad,
      materia: tareaMateria,
      fechaVencimiento: tareaFechaVencimiento,
      repetir: tareaRepetir,
      pomodoro: configurarPomodoro ? pomodoroConfig : undefined,
    };

    actualizarTarea(tareaActualizada); // Actualizamos la tarea en el contexto o estado global

    router.back(); // Volvemos a la pantalla anterior
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20 }}>
      <Text style={{ fontSize: 24 }}>Editar Tarea</Text>

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

      <Button title="Guardar Cambios" onPress={handleGuardarCambios} />
    </ScrollView>
  );
}
