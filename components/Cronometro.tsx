import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, Modal } from "react-native";
import { Audio } from 'expo-av';  // Importamos la librería de audio

interface CronometroProps {
  duracion: number;  // Tiempo de trabajo en minutos
  descanso: number;  // Tiempo de descanso en minutos
  intervalos: number;  // Número de ciclos de trabajo/descanso
  onFinish: () => void;  // Función que se llama cuando el cronómetro termina
  onRegresar: () => void; // Función para regresar a la pantalla de tareas
}

const Cronometro: React.FC<CronometroProps> = ({ duracion, descanso, intervalos, onFinish, onRegresar }) => {
  const [tiempoRestante, setTiempoRestante] = useState(duracion * 60); // Tiempo en segundos
  const [modoTrabajo, setModoTrabajo] = useState(true); // Controla si estamos en modo trabajo o descanso
  const [intervaloActual, setIntervaloActual] = useState(1); // Ciclo actual
  const [activo, setActivo] = useState(false); // Controla si el cronómetro está corriendo
  const [showAlarma, setShowAlarma] = useState(false);  // Controla si la alarma está sonando
  const [sound, setSound] = useState<Audio.Sound | null>(null);  // Estado para el sonido

  // Función para cargar el sonido de la alarma
  const cargarSonido = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(require('../assets/martian_soundtrack.mp3'));  // Ruta de la alarma
      setSound(sound);
    } catch (error) {
      console.error("Error cargando el sonido", error);
    }
  };

  // Efecto para cargar el sonido al montar el componente
  useEffect(() => {
    cargarSonido();

    return () => {
      if (sound) {
        sound.unloadAsync();  // Limpiar el sonido cuando el componente se desmonte
      }
    };
  }, []);

  useEffect(() => {
    let intervalo: NodeJS.Timeout | null = null;

    if (activo && tiempoRestante > 0) {
      intervalo = setInterval(() => {
        setTiempoRestante((prev) => prev - 1);
      }, 1000);
    } else if (tiempoRestante === 0) {
      if (modoTrabajo) {
        if (intervaloActual === intervalos) {
          // Si estamos en el último intervalo, no suena la alarma y se finaliza
          onFinish();
        } else {
          // Al terminar un ciclo de trabajo, suena la alarma
          if (sound) sound.replayAsync();
          setShowAlarma(true); // Muestra la alarma
          setActivo(false); // Pausar el cronómetro hasta que el usuario desactive la alarma
        }
      } else if (intervaloActual < intervalos) {
        // Continuar con el siguiente ciclo de trabajo
        setModoTrabajo(true);
        setTiempoRestante(duracion * 60);
        setIntervaloActual((prev) => prev + 1);
        setActivo(true); // Reanudar cronómetro
      } else {
        // Al finalizar todos los intervalos, terminar y volver al index
        onFinish();
      }
    }

    return () => {
      if (intervalo) clearInterval(intervalo); // Limpiamos el intervalo cuando el componente se desmonte
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

  // Función para desactivar la alarma
  const desactivarAlarma = () => {
    if (sound) sound.stopAsync();  // Detiene el sonido de la alarma
    setShowAlarma(false);  // Oculta la alarma
    setModoTrabajo(false);  // Cambiar a modo descanso
    setTiempoRestante(descanso * 60);  // Tiempo de descanso
    setActivo(true);  // Reanudar cronómetro
  };

  // Formatear el tiempo para mostrarlo en formato MM:SS
  const formatearTiempo = (segundos: number) => {
    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = segundos % 60;
    return `${minutos < 10 ? "0" : ""}${minutos}:${segundosRestantes < 10 ? "0" : ""}${segundosRestantes}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>{formatearTiempo(tiempoRestante)}</Text>
      <Text style={styles.modo}>
        {modoTrabajo ? "FOCUS" : "BREAK"} ({intervaloActual} / {intervalos})
      </Text>

      <View style={styles.controls}>
        <Button title={activo ? "Pausar" : "Iniciar"} onPress={activo ? pausarCronometro : iniciarCronometro} />
        <Button title="Resetear" onPress={resetearCronometro} />
        <Button title="Volver" onPress={onRegresar} />
      </View>

      {/* Modal para la alarma */} 
      {showAlarma && (
        <Modal visible={showAlarma} animationType="slide" transparent={true}>
          <View style={styles.alarmaContainer}>
            <Text style={styles.alarmaText}>Descanso</Text>
            <Button title="Desactivar Alarma" onPress={desactivarAlarma} />
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
    marginBottom: 20,
  },
  modo: {
    fontSize: 24,
    marginBottom: 20,
    color: "#555",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "60%",
  },
  alarmaContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  alarmaText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
});

export default Cronometro;
