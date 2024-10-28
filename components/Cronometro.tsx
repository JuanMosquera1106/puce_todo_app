import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from "react-native";
import { Audio } from "expo-av";
import { BackHandler } from "react-native";
import * as Progress from "react-native-progress"; // Importar la librería de progreso
import { PlayIcon2, RepeatIcon2 } from "./Icons"; // Asegúrate de importar los íconos correctamente

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
  const [modoTrabajo, setModoTrabajo] = useState(true); // true: focus, false: break
  const [intervaloActual, setIntervaloActual] = useState(1);
  const [activo, setActivo] = useState(false);
  const [showAlarma, setShowAlarma] = useState(false); // Para manejar la alarma
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [showModal, setShowModal] = useState(false); // Modal de confirmación para regresar

  // Cargar el sonido de la alarma
  const cargarSonido = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require("../assets/martian_soundtrack.mp3"),
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
          onFinish(); // Fin de todos los intervalos
        } else {
          if (sound) sound.replayAsync();
          setShowAlarma(true); // Mostrar la alarma para iniciar el break
          setActivo(false); // Pausar cronómetro
        }
      } else {
        if (sound) sound.replayAsync();
        setShowAlarma(true); // Mostrar la alarma al finalizar el break
        setActivo(false); // Pausar el cronómetro
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

  // Desactivar alarma y empezar el break o focus manualmente
  const desactivarAlarma = () => {
    if (sound) sound.stopAsync();
    setShowAlarma(false); // Ocultar la alarma

    if (!modoTrabajo) {
      // Si estamos al final del break, mostrar opción de iniciar manualmente el próximo focus
      setModoTrabajo(true);
      setTiempoRestante(duracion * 60); // Ajustar tiempo de focus
      setIntervaloActual((prev) => prev + 1); // Incrementar el número de intervalos
      setActivo(false); // No iniciar automáticamente, el usuario debe iniciar manualmente
    } else {
      // Después de desactivar la alarma para iniciar el break
      setModoTrabajo(false);
      setTiempoRestante(descanso * 60); // Ajustar tiempo de break
      setActivo(true); // Iniciar automáticamente el break (botón verde)
    }
  };

  const handleVolver = () => {
    setShowModal(true); // Mostrar el modal de confirmación
  };

  const confirmarVolver = () => {
    resetearCronometro();
    setShowModal(false);
    onRegresar(); // Llama a la función que regresa al index
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

  // Calcular el progreso en porcentaje
  const progreso =
    tiempoRestante / (modoTrabajo ? duracion * 60 : descanso * 60);

  return (
    <View style={styles.container}>
      {/* Círculo de progreso */}
      <Progress.Circle
        size={250}
        progress={progreso}
        showsText={true}
        textStyle={styles.timer}
        color="#3498db"
        thickness={8}
        formatText={() => formatearTiempo(tiempoRestante)}
      />
      <Text style={styles.modo}>{mostrarModoYIntervalo()}</Text>

      <View style={styles.controls}>
        <TouchableOpacity
          onPress={activo ? pausarCronometro : iniciarCronometro}
        >
          <PlayIcon2 size={50} color={activo ? "red" : "green"} />
        </TouchableOpacity>
        <TouchableOpacity onPress={resetearCronometro}>
          <RepeatIcon2 size={50} color="orange" />
        </TouchableOpacity>
      </View>

      <View style={styles.volverContainer}>
        <TouchableOpacity onPress={handleVolver} style={styles.botonVolver}>
          <Text style={styles.textoVolver}>Volver</Text>
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
                ¿Deseas volver al inicio? El cronómetro se reiniciará.
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
    backgroundColor: "#fff",
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
    marginTop: 20,
    alignItems: "center",
  },
  botonVolver: {
    backgroundColor: "#FF6347",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  textoVolver: {
    color: "white",
    fontSize: 20, // Ajusta este valor al tamaño de letra que desees
    fontWeight: "bold",
  },

  botonConfirmar: {
    backgroundColor: "#00BFFF", // Color original para "Confirmar"
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  textoConfirmar: {
    color: "white",
    fontSize: 16, // Tamaño de letra para "Confirmar"
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
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Fondo oscuro semitransparente
    padding: 20,
  },
  alarmaText: {
    fontSize: 30, // Texto grande para resaltar "Fin de Break"
    color: "#FFF", // Blanco para contrastar con el fondo oscuro
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold", // Resaltar el texto
  },
  botonDesactivarAlarma: {
    backgroundColor: "#FF6347", // Usar el mismo color que en "Cancelar" y "Volver"
    paddingVertical: 12, // Espacio vertical para que el botón se vea más grande
    paddingHorizontal: 30, // Espacio horizontal para un buen relleno
    borderRadius: 8, // Bordes redondeados para un diseño más moderno
  },
  textoDesactivarAlarma: {
    color: "#FFF", // Blanco para el texto del botón
    fontSize: 18, // Tamaño adecuado para que sea visible
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Cronometro;
