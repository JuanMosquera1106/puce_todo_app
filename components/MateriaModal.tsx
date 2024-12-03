import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Materia } from "../interfaces/Materia";
import { useCalendar } from "../context/CalendarContext";

const colorsAvailable = [
  "#f28b82",
  "#fbbc04",
  "#34a853",
  "#a7ffeb",
  "#cbf0f8",
  "#aecbfa",
  "#d7aefb",
  "#a4c639",
];

interface MateriaModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
  materia?: Materia;
}

export const MateriaModal: React.FC<MateriaModalProps> = ({
  visible,
  onClose,
  onSave,
  materia,
}) => {
  const {
    agregarMateriaAlContexto,
    editarMateria,
    materiasGlobales,
  } = useCalendar();
  
  const [nombre, setNombre] = useState(materia?.event || "");
  const [color, setColor] = useState(materia?.color || "#f28b82");
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (visible) {
      setNombre(materia?.event || "");
      setColor(materia?.color || "#f28b82");
      setHasChanges(false); // Restablece los cambios al abrir el modal
    }
  }, [visible, materia]);

  const handleGuardar = () => {
    if (!nombre.trim()) {
      Alert.alert("Error", "El nombre de la materia es obligatorio.");
      return;
    }

    // Verificar si el nombre ya existe (excepto la misma materia en edición)
    const nombreEnUso = materiasGlobales.some(
      (mat) =>
        mat.event.toLowerCase() === nombre.trim().toLowerCase() &&
        (!materia || mat.id !== materia.id)
    );

    if (nombreEnUso) {
      Alert.alert(
        "Nombre duplicado",
        "Ya existe una materia con este nombre. Por favor, elige otro."
      );
      return;
    }

    if (materia) {
      // Editar materia existente
      editarMateria(materia.id, { ...materia, event: nombre, color });
    } else {
      // Agregar nueva materia
      agregarMateriaAlContexto({
        id: Math.random().toString(36).substr(2, 9),
        event: nombre,
        color,
        duration: 1,
        time: new Date().toISOString(),
      });
    }

    setHasChanges(false);
    onSave();
    onClose();
  };


  const handleClose = () => {
    if (hasChanges) {
      Alert.alert(
        "Cambios sin guardar",
        "Tienes cambios sin guardar. ¿Deseas salir sin guardar?",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Salir sin guardar", onPress: onClose, style: "destructive" },
        ]
      );
    } else {
      onClose();
    }
  };

  useEffect(() => {
    const initialNombre = materia?.event || "";
    const initialColor = materia?.color || "#f28b82";

    if (nombre !== initialNombre || color !== initialColor) {
      setHasChanges(true);
    } else {
      setHasChanges(false);
    }
  }, [nombre, color, materia]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Icon name="close" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>
            {materia ? "Editar Materia" : "Nueva Materia"}
          </Text>
          <TextInput
            value={nombre}
            onChangeText={setNombre}
            style={styles.input}
            placeholder="Ej. Cálculo I"
            placeholderTextColor="#888"
          />
          <Text style={styles.label}>Color:</Text>
          <View style={styles.colorsContainer}>
            {colorsAvailable.map((col) => (
              <TouchableOpacity
                key={col}
                onPress={() => setColor(col)}
                style={[
                  styles.colorCircle,
                  { backgroundColor: col },
                  color === col && styles.colorSelected,
                ]}
              >
                {color === col && <Icon name="check" size={16} color="white" />}
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity onPress={handleGuardar} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: { position: "absolute", right: 10, top: 10 },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    color: "#333",
  },
  label: { fontWeight: "bold", marginBottom: 5, fontSize: 16 },
  colorsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 10,
  },
  colorCircle: {
    width: 40,
    height: 40,
    margin: 8,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  colorSelected: {
    borderWidth: 2,
    borderColor: "white",
  },
  saveButton: {
    backgroundColor: "#34a853",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
