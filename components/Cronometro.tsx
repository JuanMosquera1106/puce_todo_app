import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";
import { Audio } from "expo-av";
import * as Progress from "react-native-progress";
import { PlayIcon2, RepeatIcon2 } from "./Icons";
import Ionicons from "react-native-vector-icons/Ionicons"; // Importa el ícono

interface CronometroProps {
  duracion: number;
  descanso: number;
  intervalos: number;
  onFinish: () => void;
  onRegresar: () => void;
}

const Cronometro: React.FC<CronometroProps> = ({
  duracion,
  descanso,
  intervalos,
  onFinish,
  onRegresar,
}) => {
  const [tiempoRestante, setTiempoRestante] = useState(duracion * 60);
  const [modoTrabajo, setModoTrabajo] = useState(true);
  const [intervaloActual, setIntervaloActual] = useState(1);
  const [activo, setActivo] = useState(false);
  const [showAlarma, setShowAlarma] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Cargar el sonido de la alarma
  const cargarSonido = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require("../assets/martian_soundtrack.mp3")
      );
      setSound(sound);
    } catch (error) {
      console.error("Error cargando el sonido", error);
    }
  };

  useEffect(() => {
    cargarSonido();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  // Controla el cronómetro y los cambios entre focus y break
  useEffect(() => {
    let intervalo: NodeJS.Timeout | null = null;

    if (activo && tiempoRestante > 0) {
      intervalo = setInterval(() => {
        setTiempoRestante((prev) => prev - 1);
      }, 1000);
    } else if (tiempoRestante === 0) {
      if (modoTrabajo) {
        if (intervaloActual === intervalos) {
          onFinish();
        } else {
          if (sound) sound.replayAsync();
          setShowAlarma(true);
          setActivo(false);
        }
      } else {
        if (sound) sound.replayAsync();
        setShowAlarma(true);
        setActivo(false);
      }
    }

    return () => {
      if (intervalo) clearInterval(intervalo);
    };
  }, [activo, tiempoRestante, modoTrabajo, intervaloActual]);

  const iniciarCronometro = () => setActivo(true);
  const pausarCronometro = () => setActivo(false);
  const resetearCronometro = () => {
    setActivo(false);
    setTiempoRestante(duracion * 60);
    setModoTrabajo(true);
    setIntervaloActual(1);
  };

  const desactivarAlarma = () => {
    if (sound) sound.stopAsync();
    setShowAlarma(false);

    if (!modoTrabajo) {
      setModoTrabajo(true);
      setTiempoRestante(duracion * 60);
      setIntervaloActual((prev) => prev + 1);
      setActivo(false);
    } else {
      setModoTrabajo(false);
      setTiempoRestante(descanso * 60);
      setActivo(true);
    }
  };

  const handleVolver = () => {
    setShowModal(true);
  };

  const confirmarVolver = () => {
    resetearCronometro();
    setShowModal(false);
    onRegresar();
  };

  const formatearTiempo = (segundos: number) => {
    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = segundos % 60;
    return `${minutos < 10 ? "0" : ""}${minutos}:${segundosRestantes < 10 ? "0" : ""}${segundosRestantes}`;
  };

  const mostrarModoYIntervalo = () => {
    const totalBreaks = intervalos - 1;
    if (modoTrabajo) {
      return `FOCUS (${intervaloActual} / ${intervalos})`;
    } else {
      const breakActual = intervaloActual - 1;
      return `BREAK (${breakActual + 1} / ${totalBreaks})`;
    }
  };

  const progreso =
    tiempoRestante / (modoTrabajo ? duracion * 60 : descanso * 60);

  return (
    <View style={styles.container}>
      {/* Ícono de volver */}
      <TouchableOpacity onPress={handleVolver} style={styles.volverContainer}>
      <Ionicons name="arrow-back" size={50} color="black" style={{ position: "absolute", left: 1, top: 1 }} />
      <Ionicons name="arrow-back" size={50} color="black" />
      </TouchableOpacity>

      <Progress.Circle
        size={250}
        progress={progreso}
        showsText={true}
        textStyle={styles.timer}
        color="#004E89"
        thickness={8}
        formatText={() => formatearTiempo(tiempoRestante)}
      />
      <Text style={styles.modo}>{mostrarModoYIntervalo()}</Text>

      <View style={styles.controls}>
        <TouchableOpacity
          onPress={activo ? pausarCronometro : iniciarCronometro}
        >
          <PlayIcon2 size={50} color={activo ? "#3498db" : "black"} />
        </TouchableOpacity>
        <TouchableOpacity onPress={resetearCronometro}>
          <RepeatIcon2 size={50} color="#3498db" />
        </TouchableOpacity>
      </View>

      {/* Modal para la alarma */}
      {showAlarma && (
        <Modal visible={showAlarma} animationType="slide" transparent={true}>
          <View style={styles.alarmaContainer}>
            <Text style={styles.alarmaText}>
              {modoTrabajo ? "Fin de Focus" : "Fin del Break"}
            </Text>
            <TouchableOpacity
              onPress={desactivarAlarma}
              style={styles.botonDesactivarAlarma}
            >
              <Text style={styles.textoDesactivarAlarma}>
                Desactivar Alarma
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}

      {/* Modal de confirmación para regresar */}
      {showModal && (
        <Modal visible={showModal} animationType="fade" transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>
                ¿Deseas volver al home? El cronómetro se reiniciará.
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  onPress={() => setShowModal(false)}
                  style={styles.botonVolver}
                >
                  <Text style={styles.textoVolver}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={confirmarVolver}
                  style={styles.botonConfirmar}
                >
                  <Text style={styles.textoConfirmar}>Confirmar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    backgroundColor: "#f3f3f3",
  },
  timer: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#000",
  },
  modo: {
    fontSize: 24,
    marginTop: 20,
    color: "#555",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "50%",
    marginTop: 20,
  },
  volverContainer: {
    position: "absolute",
    top: 20,
    left: 20,
  },
  iconoVolver: {
    textShadowColor: "rgba(0, 0, 0, 0.8)", // Color de la sombra
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  botonVolver: {
    backgroundColor: "#a3323d",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  textoVolver: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  botonConfirmar: {
    backgroundColor: "#004E89",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  textoConfirmar: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  alarmaContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 20,
  },
  alarmaText: {
    fontSize: 30,
    color: "#FFF",
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
  },
  botonDesactivarAlarma: {
    backgroundColor: "#FF6347",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  textoDesactivarAlarma: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Cronometro;
