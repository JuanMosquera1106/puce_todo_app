import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Animated,
  Easing,
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

export const Subject: React.FC = () => {
  const {
    materiasGlobales,
    agregarMateriaAlContexto,
    editarMateria,
    eliminarMateria,
  } = useCalendar();

  const [nombre, setNombre] = useState("");
  const [color, setColor] = useState("#f28b82");
  const [materiaSeleccionada, setMateriaSeleccionada] = useState<Materia | null>(null);
  const [formVisible, setFormVisible] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  // Inicializar formulario al abrir el modal
  const resetForm = (materia: Materia | null) => {
    if (materia) {
      setNombre(materia.event); // Cargar el nombre de la materia seleccionada
      setColor(materia.color); // Cargar el color de la materia seleccionada
    } else {
      setNombre("");
      setColor("#f28b82");
    }
    setHasChanges(false);
  };

  // Monitorea los cambios en el formulario
  useEffect(() => {
    const initialNombre = materiaSeleccionada?.event || "";
    const initialColor = materiaSeleccionada?.color || "#f28b82";

    if (nombre !== initialNombre || color !== initialColor) {
      setHasChanges(true);
    } else {
      setHasChanges(false);
    }
  }, [nombre, color, materiaSeleccionada]);

  // Mostrar/Ocultar formulario con animación
  const toggleForm = (materia: Materia | null = null) => {
    if (formVisible) {
      Animated.timing(animation, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start(() => {
        setFormVisible(false);
        setMateriaSeleccionada(null);
      });
    } else {
      setMateriaSeleccionada(materia);
      resetForm(materia); // Inicializar el formulario según la materia seleccionada
      setFormVisible(true);
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  };

  // Confirmar salida si hay cambios sin guardar
  const handleClose = () => {
    if (hasChanges) {
      Alert.alert(
        "Cambios sin guardar",
        "Tienes cambios sin guardar. ¿Deseas salir sin guardar?",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Salir sin guardar",
            onPress: () => toggleForm(),
            style: "destructive",
          },
        ]
      );
    } else {
      toggleForm();
    }
  };

  // Guardar materia
  const handleGuardar = () => {
    if (!nombre.trim()) {
      Alert.alert("Error", "El nombre de la materia es obligatorio.");
      return;
    }

    const nombreEnUso = materiasGlobales.some(
      (mat) =>
        mat.event.toLowerCase() === nombre.trim().toLowerCase() &&
        (!materiaSeleccionada || mat.id !== materiaSeleccionada.id)
    );

    if (nombreEnUso) {
      Alert.alert(
        "Nombre duplicado",
        "Ya existe una materia con este nombre. Por favor, elige otro."
      );
      return;
    }

    if (materiaSeleccionada) {
      editarMateria(materiaSeleccionada.id, {
        ...materiaSeleccionada,
        event: nombre,
        color,
      });
    } else {
      agregarMateriaAlContexto({
        id: Math.random().toString(36).substr(2, 9),
        event: nombre,
        color,
        duration: 1,
        time: new Date().toISOString(),
      });
    }

    toggleForm();
  };

  const modalScale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });

  const modalOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Materias</Text>
        <TouchableOpacity onPress={() => toggleForm()} style={styles.addButton}>
          <Icon name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Lista de materias */}
      <FlatList
        data={materiasGlobales}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.materiaItem}>
            <View style={styles.materiaInfo}>
              <View
                style={[styles.colorIndicator, { backgroundColor: item.color }]}
              />
              <Text style={styles.materiaName}>{item.event}</Text>
            </View>
            <View style={styles.actionButtons}>
              <TouchableOpacity
                onPress={() => toggleForm(item)} // Pasar la materia seleccionada
                style={styles.editButton}
              >
                <Icon name="edit" size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    "Confirmar eliminación",
                    "¿Estás seguro de eliminar esta materia?",
                    [
                      { text: "Cancelar", style: "cancel" },
                      { text: "Eliminar", onPress: () => eliminarMateria(item.id) },
                    ]
                  );
                }}
                style={styles.deleteButton}
              >
                <Icon name="delete" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyMessage}>No hay materias creadas.</Text>
        }
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      {/* Modal animado */}
      {formVisible && (
        <Animated.View
          style={[
            styles.modalContainer,
            { transform: [{ scale: modalScale }], opacity: modalOpacity },
          ]}
        >
          <Text style={styles.formTitle}>
            {materiaSeleccionada ? "Editar Materia" : "Nueva Materia"}
          </Text>
          <TextInput
            value={nombre}
            onChangeText={(text) => {
              const textoFiltrado = text.replace(/[^a-zA-Z0-9\sáéíóúÁÉÍÓÚüÜñÑ.,-]/g, "");
              if (textoFiltrado.length <= 30) setNombre(textoFiltrado);
            }}
            style={styles.input}
            placeholder="Ej. Cálculo I"
            placeholderTextColor="#888"
          />
          <Text style={styles.label}>Seleccionar Color:</Text>
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
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handleGuardar} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>
                {materiaSeleccionada ? "Actualizar" : "Guardar"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleClose} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f4f4", padding: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: { fontSize: 28, fontWeight: "bold", color: "#333" },
  addButton: {
    backgroundColor: "#0891b2",
    padding: 10,
    borderRadius: 50,
    elevation: 4,
  },
  materiaItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 2,
  },
  materiaInfo: { flexDirection: "row", alignItems: "center" },
  materiaName: { fontSize: 16, fontWeight: "600" },
  colorIndicator: { width: 20, height: 20, borderRadius: 10, marginRight: 10 },
  actionButtons: { flexDirection: "row" },
  editButton: {
    backgroundColor: "#34a853",
    padding: 8,
    borderRadius: 8,
    marginRight: 5,
  },
  deleteButton: {
    backgroundColor: "#e53935",
    padding: 8,
    borderRadius: 8,
  },
  emptyMessage: { textAlign: "center", color: "#777", fontSize: 16, marginTop: 20 },
  modalContainer: {
    position: "absolute",
    top: "30%",
    left: "10%",
    right: "10%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    elevation: 10,
    alignItems: "center",
  },
  formTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 15, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    width: "100%",
  },
  label: { fontWeight: "bold", marginBottom: 5, width: "100%" },
  colorsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 15,
    width: "100%",
  },
  colorCircle: {
    width: 40,
    height: 40,
    margin: 5,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  colorSelected: { borderWidth: 2, borderColor: "white" },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    width: "100%",
  },
  saveButton: {
    backgroundColor: "#0891b2",
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 10,
    alignItems: "center",
  },
  saveButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  cancelButton: {
    backgroundColor: "#e53935",
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

export default Subject;
