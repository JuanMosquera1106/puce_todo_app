import React, { useState } from "react";
import {
  FlatList,
  Pressable,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import { styled } from "nativewind";
import { useTareas } from "../../context/TareasContext";
import { AddIcon, EditIcon, DeleteIcon } from "../../components/Icons";
import FormularioTareaModal from "../../components/FormularioTarea";
import { Tarea } from "../../interfaces/Tarea"; // Importa la interfaz Tarea

// Crear una versión estilizada de `Pressable` y `Text`
const StyledPressable = styled(Pressable);
const StyledText = styled(Text);

export default function GestionTareas() {
  const { tareas, cargando, eliminarTarea } = useTareas();

  // Estado para controlar la visibilidad del modal
  const [modalVisible, setModalVisible] = useState(false);
  const [tareaActual, setTareaActual] = useState<Tarea | undefined>(undefined); // Cambiado a undefined
  const [esEditar, setEsEditar] = useState(false); // Controla si estamos en modo edición

  // Mostrar el modal para agregar una nueva tarea
  const handleAgregarTarea = () => {
    setTareaActual(undefined); // Cambiado a undefined en lugar de null
    setEsEditar(false); // Modo agregar
    setModalVisible(true); // Mostrar el modal
  };

  // Mostrar el modal para editar una tarea
  const handleEditarTarea = (tarea: Tarea) => {
    // Definir tipo 'Tarea' explícitamente
    setTareaActual(tarea); // Cargamos la tarea actual
    setEsEditar(true); // Modo edición
    setModalVisible(true); // Mostrar el modal
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setModalVisible(false);
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
              <StyledText className="text-lg text-dark">
                {item.nombre}
              </StyledText>
              <StyledText className="text-dark/80">
                Materia: {item.materia}
              </StyledText>
              <StyledText className="text-dark/80">
                Prioridad: {item.prioridad}
              </StyledText>
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
                  onPress={() => handleEditarTarea(item)} // Editar tarea
                  className="px-4 py-2 rounded active:opacity-80"
                >
                  <EditIcon />
                </StyledPressable>
                <StyledPressable
                  onPress={() => eliminarTarea(item.id)} // Eliminar tarea
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
        onPress={handleAgregarTarea} // Agregar nueva tarea
        className="bg-gray-200 w-16 h-16 rounded-full active:opacity-80 flex items-center justify-center absolute bottom-8 right-8"
      >
        <AddIcon />
      </StyledPressable>

      {/* Modal para agregar o editar tarea */}
      {modalVisible && (
        <FormularioTareaModal
          visible={modalVisible}
          onClose={handleCloseModal}
          tareaInicial={tareaActual} // Pasa la tarea actual si estamos editando
          esEditar={esEditar} // Define si es edición o agregado
        />
      )}
    </View>
  );
}
