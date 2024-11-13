import React, { useEffect } from "react";
import { StyleSheet, View, Text, Image, StatusBar } from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";

const slides = [
  {
    key: "1",
    title: "Organiza tus Tareas",
    text: "Crea, edita y gestiona tus tareas diarias con facilidad.",
    image: require("../assets/task_img_2_slides.png"), // Cambia a una imagen representativa
    backgroundColor: "#007EA7",
  },
  {
    key: "2",
    title: "Planifica tu Tiempo",
    text: "Utiliza el calendario para una planificación diaria más eficiente.",
    image: require("../assets/calendario_img_slides.png"), // Cambia a una imagen representativa
    backgroundColor: "#2D2D2D",
  },
  {
    key: "3",
    title: "Controla tu Rendimiento",
    text: "Visualiza tu rendimiento y mejora tu productividad cada día.",
    image: require("../assets/alto-rendimiento.png"), // Cambia a una imagen representativa
    backgroundColor: "#E63946",
  },
];

const Guide = ({ onDone }: { onDone: () => void }) => {
  useEffect(() => {
    // Oculta la barra de estado
    StatusBar.setHidden(true);
    
    // Vuelve a mostrar la barra de estado al desmontar el componente
    return () => StatusBar.setHidden(false);
  }, []);

  const renderSlide = ({ item }: { item: typeof slides[0] }) => (
    <View style={[styles.slide, { backgroundColor: item.backgroundColor }]}>
      <Image source={item.image} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.text}>{item.text}</Text>
    </View>
  );

  return (
    <AppIntroSlider
      renderItem={renderSlide}
      data={slides}
      onDone={onDone}
      showSkipButton={true}
      onSkip={onDone}
    />
  );
};

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    paddingHorizontal: 20,
  },
});

export default Guide;
