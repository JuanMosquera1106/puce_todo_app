import React from "react";
import {
  FlatList,
  Pressable,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { styled } from "nativewind";
import { useTareas } from "../../context/TareasContext"; // Importamos el contexto
import { AddIcon } from "../../components/Icons";

// Crear una versión estilizada de `Pressable` y `Text`
const StyledPressable = styled(Pressable);
const StyledText = styled(Text);

export default function GestionTareas() {
  const router = useRouter();
  const { tareas, cargando, eliminarTarea } = useTareas(); // Usamos el contexto

  if (cargando) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Cargando tareas...</Text> {/* Mostrar un mensaje de carga */}
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "white", padding: 16 }}>
      <StyledText className="text-2xl font-bold text-darrk mb-4">
        Gestión de Tareas
      </StyledText>

      {tareas.length === 0 ? (
        <StyledText className="text-darrk/80">
          No hay tareas disponibles
        </StyledText>
      ) : (
        <FlatList
          data={tareas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <StyledPressable className="p-4 border-b border-gray-500">
              <StyledText className="text-lg text-darrk">
                {item.nombre}
              </StyledText>
              <StyledText className="text-darrk/80">
                Materia: {item.materia}
              </StyledText>
              <StyledText className="text-darrk/80">
                Prioridad: {item.prioridad}
              </StyledText>
              <StyledText className="text-darrk/80">
                Fecha de Vencimiento: {item.fechaVencimiento}
              </StyledText>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 10,
                }}
              >
                <StyledPressable
                  onPress={() =>
                    router.push({
                      pathname: "/editar",
                      params: {
                        id: item.id,
                        nombre: item.nombre,
                        prioridad: item.prioridad,
                        materia: item.materia,
                        fechaVencimiento: item.fechaVencimiento,
                        repetir: item.repetir.toString(),
                        pomodoro: item.pomodoro
                          ? JSON.stringify(item.pomodoro)
                          : undefined,
                      },
                    })
                  }
                  className="bg-blue-500 px-4 py-2 rounded active:opacity-80"
                >
                  <StyledText className="text-white">Editar</StyledText>
                </StyledPressable>

                <StyledPressable
                  onPress={() => eliminarTarea(item.id)}
                  className="bg-red-500 px-4 py-2 rounded active:opacity-80"
                >
                  <StyledText className="text-white">Eliminar</StyledText>
                </StyledPressable>
              </View>
            </StyledPressable>
          )}
        />
      )}

      {/* Botón flotante para agregar nuevas tareas */}
      <StyledPressable
        onPress={() => router.push("/agregar")}
        className="bg-gray-200 w-16 h-16 rounded-full active:opacity-80 flex items-center justify-center absolute bottom-8 right-8"
      >
        <AddIcon />
      </StyledPressable>
    </View>
  );
}
