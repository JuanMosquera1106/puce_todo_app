import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Animated,
  Easing,
  TouchableOpacity,
  Alert,
  TouchableWithoutFeedback,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { Ionicons } from "@expo/vector-icons";

interface TimerProps {
  visible: boolean;
  onSave: (config: {
    duracion: number;
    descanso: number;
    intervalo: number;
  }) => void;
  onClose: () => void;
  duracionInicial: number;
  descansoInicial: number;
  intervaloInicial: number;
}

const Timer: React.FC<TimerProps> = ({
  visible,
  onSave,
  onClose,
  duracionInicial,
  descansoInicial,
  intervaloInicial,
}) => {
  const [workTime, setWorkTime] = useState(duracionInicial);
  const [breakTime, setBreakTime] = useState(descansoInicial);
  const [intervals, setIntervals] = useState(intervaloInicial);
  const [hasChanges, setHasChanges] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [translateYAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    setWorkTime(duracionInicial);
    setBreakTime(descansoInicial);
    setIntervals(intervaloInicial);
    setHasChanges(false);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible]);

  const handleSave = () => {
    onSave({ duracion: workTime, descanso: breakTime, intervalo: intervals });
    onClose();
  };

  const handleClose = () => {
    if (hasChanges) {
      Alert.alert(
        "Cambios sin guardar",
        "Tienes cambios sin guardar. ¿Quieres salir sin guardar?",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Salir", onPress: onClose },
        ],
      );
    } else {
      onClose();
    }
  };

  const handleChange = () => setHasChanges(true);

  const workTimeOptions = Array.from({ length: 59 }, (_, i) => ({
    label: `${i + 1} minutos`,
    value: i + 1,
  }));
  const breakTimeOptions = Array.from({ length: 15 }, (_, i) => ({
    label: `${i + 1} minutos`,
    value: i + 1,
  }));
  const intervalOptions = Array.from({ length: 5 }, (_, i) => ({
    label: `${i + 1} ciclo(s)`,
    value: i + 1,
  }));

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.modalContent,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: translateYAnim }],
                },
              ]}
            >
              <Text style={styles.modalTitle}>Configura tu Pomodoro</Text>

              <View style={styles.sectionContainer}>
                <View style={styles.iconLabelContainer}>
                  <Ionicons
                    name="timer-outline"
                    size={20}
                    color="#4A90E2"
                    style={styles.icon}
                  />
                  <Text style={styles.label}>Duración del Pomodoro</Text>
                </View>
                <RNPickerSelect
                  onValueChange={(value) => {
                    setWorkTime(value);
                    handleChange();
                  }}
                  items={workTimeOptions}
                  value={workTime}
                  placeholder={{ label: "Seleccionar tiempo", value: null }}
                  style={pickerSelectStyles}
                />
              </View>

              <View style={styles.sectionContainer}>
                <View style={styles.iconLabelContainer}>
                  <Ionicons
                    name="cafe-outline"
                    size={20}
                    color="#4A90E2"
                    style={styles.icon}
                  />
                  <Text style={styles.label}>Tiempo de Descanso</Text>
                </View>
                <RNPickerSelect
                  onValueChange={(value) => {
                    setBreakTime(value);
                    handleChange();
                  }}
                  items={breakTimeOptions}
                  value={breakTime}
                  placeholder={{ label: "Seleccionar descanso", value: null }}
                  style={pickerSelectStyles}
                />
              </View>

              <View style={styles.sectionContainer}>
                <View style={styles.iconLabelContainer}>
                  <Ionicons
                    name="repeat-outline"
                    size={20}
                    color="#4A90E2"
                    style={styles.icon}
                  />
                  <Text style={styles.label}>Intervalos de trabajo</Text>
                </View>
                <RNPickerSelect
                  onValueChange={(value) => {
                    setIntervals(value);
                    handleChange();
                  }}
                  items={intervalOptions}
                  value={intervals}
                  placeholder={{ label: "Seleccionar intervalos", value: null }}
                  style={pickerSelectStyles}
                />
              </View>

              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Ionicons name="save-outline" size={20} color="#fff" />
                <Text style={styles.saveButtonText}>Guardar</Text>
              </TouchableOpacity>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalContent: {
    width: 350,
    paddingVertical: 19,
    paddingHorizontal: 20,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  sectionContainer: {
    width: "100%",
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    marginBottom: 20,
  },
  iconLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  icon: {
    marginRight: 8,
  },
  label: {
    fontSize: 16,
    color: "#4A90E2",
  },
  saveButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    paddingVertical: 12,
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    width: "100%",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 8,
    fontWeight: "600",
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#d3d3d3",
    borderRadius: 8,
    color: "#333",
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#d3d3d3",
    borderRadius: 8,
    color: "#333",
    paddingRight: 30,
  },
});

export default Timer;
