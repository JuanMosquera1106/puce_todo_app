import React, { useState } from "react";
import {
  FlatList,
  Pressable,
  Text,
  View,
  ActivityIndicator,
  Modal,
} from "react-native";
import { styled } from "nativewind";
import { useTareas } from "../../context/TareasContext";
import { AddIcon, EditIcon, DeleteIcon, PlayIcon } from "../../components/Icons";
import FormularioTareaModal from "../../components/FormularioTarea";
import Cronometro from "../../components/Cronometro"; // Importamos el cronómetro
import { Tarea } from "../../interfaces/Tarea";

// Crear una versión estilizada de `Pressable` y `Text`
const StyledPressable = styled(Pressable);
const StyledText = styled(Text);

export default function GestionTareas() {
  const { tareas, cargando, eliminarTarea } = useTareas();
  const [modalVisible, setModalVisible] = useState(false);
  const [tareaActual, setTareaActual] = useState<Tarea | undefined>(undefined);
  const [esEditar, setEsEditar] = useState(false);
  const [mostrarCronometro, setMostrarCronometro] = useState(false);
  const [tareaCronometro, setTareaCronometro] = useState<Tarea | undefined>(undefined);

  // Función para manejar agregar tarea
  const handleAgregarTarea = () => {
    setTareaActual(undefined);
    setEsEditar(false);
    setModalVisible(true);
  };

  // Función para manejar la edición de una tarea
  const handleEditarTarea = (tarea: Tarea) => {
    setTareaActual(tarea);
    setEsEditar(true);
    setModalVisible(true);
  };

  // Función para iniciar el cronómetro
  const handleIniciarCronometro = (tarea: Tarea) => {
    setTareaCronometro(tarea); // Guardar la tarea para el cronómetro
    setMostrarCronometro(true); // Mostrar el cronómetro
  };

  // Función para cerrar el modal de formulario de tareas
  const handleCloseModal = () => {
    setModalVisible(false);
  };

  // Función para cerrar el cronómetro
  const handleCerrarCronometro = () => {
    setMostrarCronometro(false); // Cierra el cronómetro y vuelve a la lista
  };

  if (cargando) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Cargando tareas...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "white", padding: 16 }}>
      <StyledText className="text-2xl font-bold text-dark mb-4">
        Gestión de Tareas
      </StyledText>

      {tareas && tareas.length === 0 ? (
        <StyledText className="text-dark/80">
          No hay tareas disponibles
        </StyledText>
      ) : (
        <FlatList
          data={tareas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <StyledPressable className="p-4 border-b border-gray-500">
              <StyledText className="text-lg text-dark">{item.nombre}</StyledText>
              <StyledText className="text-dark/80">Materia: {item.materia}</StyledText>
              <StyledText className="text-dark/80">Prioridad: {item.prioridad}</StyledText>
              <StyledText className="text-dark/80">
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
                  onPress={() => handleEditarTarea(item)}
                  className="px-4 py-2 rounded active:opacity-80"
                >
                  <EditIcon />
                </StyledPressable>

                {/* Añadimos el botón de reproducción */}
                <StyledPressable
                  onPress={() => handleIniciarCronometro(item)}
                  className="px-4 py-2 rounded active:opacity-80"
                >
                  <PlayIcon />
                </StyledPressable>

                <StyledPressable
                  onPress={() => eliminarTarea(item.id)}
                  className="px-4 py-2 rounded active:opacity-80"
                >
                  <DeleteIcon />
                </StyledPressable>
              </View>
            </StyledPressable>
          )}
        />
      )}

      <StyledPressable
        onPress={handleAgregarTarea}
        className="bg-gray-200 w-16 h-16 rounded-full active:opacity-80 flex items-center justify-center absolute bottom-8 right-8"
      >
        <AddIcon />
      </StyledPressable>

      {modalVisible && (
        <FormularioTareaModal
          visible={modalVisible}
          onClose={handleCloseModal}
          tareaInicial={tareaActual}
          esEditar={esEditar}
        />
      )}

      {/* Modal para mostrar el cronómetro */}
      {mostrarCronometro && (
        <Modal visible={mostrarCronometro} animationType="slide" transparent={true}>
          <Cronometro
            duracion={tareaCronometro?.pomodoro?.duracion || 25}
            descanso={tareaCronometro?.pomodoro?.descanso || 5}
            intervalos={tareaCronometro?.pomodoro?.intervalo || 4}
            onFinish={() => setMostrarCronometro(false)}  // Regresa al index cuando termine
            onRegresar={handleCerrarCronometro}  // Permite regresar manualmente
          />
        </Modal>
      )}
    </View>
  );
}
