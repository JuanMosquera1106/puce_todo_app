import React, { useState, useEffect } from "react";
import { Animated, View, Text, TextInput, Modal, Alert, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useCalendar } from "../context/CalendarContext";
import { Materia } from "../interfaces/Materia";

const colorsAvailable = ["#f28b82", "#fbbc04", "#34a853", "#a7ffeb", "#cbf0f8", "#aecbfa", "#d7aefb", "#a4c639"];

interface MateriaModalProps {
  visible: boolean;
  onClose: () => void;
  materia?: Materia;
}

export const MateriaModal: React.FC<MateriaModalProps> = ({ visible, onClose, materia }) => {
  const { agregarMateriaAlContexto, materiasGlobales, setMateriasGlobales } = useCalendar();
  const [nombre, setNombre] = useState(materia?.event || "");
  const [color, setColor] = useState(materia?.color || "#f28b82");
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    if (visible) {
      setNombre(materia?.event || "");
      setColor(materia?.color || "#f28b82");

      // Reset and animate opacity for fade-in effect
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    }
  }, [visible, materia]);

  const handleGuardar = () => {
    if (!nombre.trim()) {
      Alert.alert("Error", "El nombre de la materia es obligatorio.");
      return;
    }
    const updatedMateria = materia
      ? { ...materia, event: nombre, color }
      : { id: Math.random().toString(36).substr(2, 9), event: nombre, color, duration: 1, time: new Date().toISOString() };

    if (materia) {
      setMateriasGlobales(materiasGlobales.map((mat) => (mat.id === materia.id ? updatedMateria : mat)));
    } else {
      agregarMateriaAlContexto(updatedMateria);
    }
    onClose();
  };

  const handleEliminar = () => {
    if (materia) {
      setMateriasGlobales(materiasGlobales.filter((mat) => mat.id !== materia.id));
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalBackground}>
        <Animated.View style={[styles.modalContainer, { opacity: fadeAnim }]}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Icon name="close" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>{materia ? "Editar Materia" : "Nueva Materia"}</Text>
          <TextInput
            value={nombre}
            onChangeText={setNombre}
            style={styles.input}
            placeholder="Ej. Calculo I"
            placeholderTextColor="#888"
          />
          <Text style={styles.label}>Color:</Text>
          <View style={styles.colorsContainer}>
            {colorsAvailable.map((col) => (
              <TouchableOpacity
                key={col}
                onPress={() => setColor(col)}
                style={[styles.colorCircle, { backgroundColor: col }, color === col && styles.colorSelected]}
              >
                {color === col && <Icon name="check" size={16} color="white" />}
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity onPress={handleGuardar} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Guardar</Text>
          </TouchableOpacity>
          {materia && (
            <TouchableOpacity
              onPress={() =>
                Alert.alert("Confirm Delete", "Do you want to delete?", [
                  { text: "Cancel", style: "cancel" },
                  { text: "Delete", style: "destructive", onPress: handleEliminar },
                ])
              }
              style={styles.deleteButton}
            >
              <Text style={styles.deleteButtonText}>Borrar</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.6)" },
  modalContainer: { backgroundColor: "white", padding: 20, borderRadius: 15, width: "85%", shadowOpacity: 0.25, elevation: 10 },
  closeButton: { position: "absolute", right: 10, top: 10 },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 15, textAlign: "center", color: "#333" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 8, marginBottom: 15, fontSize: 16, color: "#333" },
  label: { fontWeight: "bold", marginBottom: 5, fontSize: 16 },
  colorsContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", marginTop: 10 },
  colorCircle: { width: 40, height: 40, margin: 8, borderRadius: 20, justifyContent: "center", alignItems: "center" },
  colorSelected: { borderWidth: 2, borderColor: "white", backgroundColor: "rgba(0, 0, 0, 0.2)" },
  saveButton: { backgroundColor: "#34a853", borderRadius: 8, paddingVertical: 10, alignItems: "center", marginTop: 20 },
  saveButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  deleteButton: { backgroundColor: "red", borderRadius: 8, paddingVertical: 10, alignItems: "center", marginTop: 10 },
  deleteButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
