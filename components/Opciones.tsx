import React, { useState, useEffect } from "react";
import {
  View,
  Modal,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const Opciones: React.FC<{
  visible: boolean;
  onClose: () => void;
  mostrarCompletadas: boolean;
  toggleMostrarCompletadas: () => void;
  mostrarAtrasadas: boolean;
  toggleMostrarAtrasadas: () => void;
  mostrarPendientes: boolean;
  toggleMostrarPendientes: () => void;
}> = ({
  visible,
  onClose,
  toggleMostrarCompletadas,
  toggleMostrarAtrasadas,
  toggleMostrarPendientes,
}) => {
  const [activeOptions, setActiveOptions] = useState({
    completadas: false,
    atrasadas: false,
    pendientes: false,
  });
  const [animation] = useState(new Animated.Value(0));

  const openModal = () => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => onClose());
  };

  const modalStyle = {
    transform: [{ scale: animation }],
    opacity: animation,
  };

  const handleOptionClick = (
    option: "completadas" | "atrasadas" | "pendientes",
    toggleFn: () => void
  ) => {
    setActiveOptions((prevState) => ({
      ...prevState,
      [option]: !prevState[option],
    }));
    toggleFn(); // Ejecuta la función para alternar el estado asociado
    closeModal(); // Cierra el modal después de elegir una opción
  };

  useEffect(() => {
    if (visible) openModal();
  }, [visible]);

  return (
    <Modal transparent visible={visible} animationType="none">
      <TouchableWithoutFeedback onPress={closeModal}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <Animated.View style={[styles.modalContent, modalStyle]}>
              <Text style={styles.modalTitle}>Opciones</Text>

              {/* Opción para Pendientes */}
              <TouchableOpacity
                onPress={() => handleOptionClick("pendientes", toggleMostrarPendientes)}
                style={styles.optionButton}
              >
                <MaterialIcons
                  name={activeOptions.pendientes ? "visibility-off" : "visibility"}
                  size={24}
                  color="#0891b2"
                />
                <Text style={styles.optionText}>Pendientes</Text>
              </TouchableOpacity>

              {/* Opción para Completadas */}
              <TouchableOpacity
                onPress={() => handleOptionClick("completadas", toggleMostrarCompletadas)}
                style={styles.optionButton}
              >
                <MaterialIcons
                  name={activeOptions.completadas ? "visibility-off" : "visibility"}
                  size={24}
                  color="gray"
                />
                <Text style={styles.optionText}>Completas</Text>
              </TouchableOpacity>

              {/* Opción para Atrasadas */}
              <TouchableOpacity
                onPress={() => handleOptionClick("atrasadas", toggleMostrarAtrasadas)}
                style={styles.optionButton}
              >
                <MaterialIcons
                  name={activeOptions.atrasadas ? "visibility-off" : "visibility"}
                  size={24}
                  color="#ff5722"
                />
                <Text style={styles.optionText}>Atrasadas</Text>
              </TouchableOpacity>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: 320,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginVertical: 5,
  },
  optionText: {
    fontSize: 16,
    color: "#444",
    marginLeft: 10,
  },
});

export default Opciones;