import React from "react";
import { StyleSheet, View, Text, Image, Dimensions } from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";

const { width, height } = Dimensions.get("window");

const slides = [
  {
    key: "1",
    title: "Organiza tus Materias y Tareas",
    text: "Crea, edita y gestiona tus materias y tareas diarias con facilidad.",
    image: { uri: "https://juanmosquera.neocities.org/TODOAPP/task_img_2_slides.png" },
    backgroundColor: "#59b2ab",
  },
  {
    key: "2",
    title: "Planifica tu Tiempo",
    text: "Utiliza el calendario para una planificación diaria más eficiente.",
    image: { uri: "https://juanmosquera.neocities.org/TODOAPP/calendario_img_slides.png" },
    backgroundColor: "#febe29",
  },
  {
    key: "3",
    title: "Controla tu Rendimiento",
    text: "Visualiza tu rendimiento y mejora tu productividad cada día.",
    image: { uri: "https://juanmosquera.neocities.org/TODOAPP/alto-rendimiento.png" },
    backgroundColor: "#3B5998",
  },
];

const Guide = ({ onDone }: { onDone: () => void }) => {
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
      renderNextButton={() => <Text style={styles.buttonText}>Next</Text>}
      renderSkipButton={() => <Text style={styles.buttonText}>Skip</Text>}
      renderDoneButton={() => <Text style={styles.buttonText}>Done</Text>}
    />
  );
};

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  image: {
    width: width * 0.6, // 60% del ancho de la pantalla
    height: height * 0.3, // 30% del alto de la pantalla
    resizeMode: "contain",
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
  buttonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
});

export default Guide;
