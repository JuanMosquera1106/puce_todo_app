import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  Modal,
  Pressable,
  StyleSheet,
} from "react-native";
import RNPickerSelect from 'react-native-picker-select'; // Usamos RNPickerSelect para la selección

interface TimerProps {
  onSave: (config: { duracion: number; descanso: number; intervalo: number }) => void;
}

const Timer: React.FC<TimerProps> = ({ onSave }) => {
  const [workTime, setWorkTime] = useState(25);  // Tiempo de trabajo por defecto
  const [breakTime, setBreakTime] = useState(5); // Tiempo de descanso por defecto
  const [intervals, setIntervals] = useState(4); // Intervalos por defecto

  const [modalVisible, setModalVisible] = useState(true); // Control de la visibilidad del modal

  const handleSave = () => {
    onSave({
      duracion: workTime,
      descanso: breakTime,
      intervalo: intervals,
    });
    setModalVisible(false); // Cerrar el modal después de guardar
  };

  const workTimeOptions = Array.from({ length: 59 }, (_, i) => ({ label: `${i + 1} minutos`, value: i + 1 }));
  const breakTimeOptions = Array.from({ length: 15 }, (_, i) => ({ label: `${i + 1} minutos`, value: i + 1 }));
  const intervalOptions = Array.from({ length: 5 }, (_, i) => ({ label: `${i + 1} ciclo(s)`, value: i + 1 }));

  return (
    <Modal visible={modalVisible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Configura tu Pomodoro</Text>

          {/* Picker para la duración del Pomodoro */}
          <Text>Duración del Pomodoro (minutos)</Text>
          <RNPickerSelect
            onValueChange={(value) => setWorkTime(value)}
            items={workTimeOptions}
            value={workTime}
            placeholder={{ label: "Seleccionar tiempo", value: null }}
            style={pickerSelectStyles}
          />

          {/* Picker para el tiempo de descanso */}
          <Text>Tiempo de Descanso (minutos)</Text>
          <RNPickerSelect
            onValueChange={(value) => setBreakTime(value)}
            items={breakTimeOptions}
            value={breakTime}
            placeholder={{ label: "Seleccionar descanso", value: null }}
            style={pickerSelectStyles}
          />

          {/* Picker para el número de intervalos */}
          <Text>Intervalos de trabajo</Text>
          <RNPickerSelect
            onValueChange={(value) => setIntervals(value)}
            items={intervalOptions}
            value={intervals}
            placeholder={{ label: "Seleccionar intervalos", value: null }}
            style={pickerSelectStyles}
          />

          {/* Botón para guardar la configuración */}
          <Button title="Guardar" onPress={handleSave} />

          {/* Botón para cerrar el modal sin guardar */}
          <Pressable style={styles.closeButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.buttonText}>Cerrar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    marginBottom: 20,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#ff6347",
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // para que el ícono no se sobreponga en iOS
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // para que el ícono no se sobreponga en Android
  },
});

export default Timer;
