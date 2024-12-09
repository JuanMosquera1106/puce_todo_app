import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Modal,
} from "react-native";

const { width, height } = Dimensions.get("window");

const Guide = ({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    {
      key: "1",
      title: "Organiza tus Materias y Tareas",
      text: "Crea, edita y gestiona tus materias y tareas diarias con facilidad.",
      image: require("../assets/task_img_2_slides.png"),
      backgroundColor: "#59b2ab",
    },
    {
      key: "2",
      title: "Planifica tu Tiempo",
      text: "Utiliza el calendario para una planificación diaria más eficiente.",
      image: require("../assets/calendario_img_slides.png"),
      backgroundColor: "#febe29",
    },
    {
      key: "3",
      title: "Controla tu Rendimiento",
      text: "Visualiza tu rendimiento y mejora tu productividad cada día.",
      image: require("../assets/alto-rendimiento.png"),
      backgroundColor: "#3B5998",
    },
  ];

  const renderSlide = ({ item }: { item: typeof slides[0] }) => (
    <View style={[styles.slide, { backgroundColor: item.backgroundColor }]}>
      <Image source={item.image} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.text}>{item.text}</Text>
    </View>
  );

  const handleScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.container}>
        <FlatList
          data={slides}
          renderItem={renderSlide}
          keyExtractor={(item) => item.key}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
        />
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentIndex ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>
        <TouchableOpacity style={styles.exitButton} onPress={onClose}>
          <Text style={styles.exitButtonText}>Salir</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: width,
    height: height,
  },
  image: {
    width: width * 0.6,
    height: height * 0.3,
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
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "#fff",
  },
  inactiveDot: {
    backgroundColor: "#aaa",
  },
  exitButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#ff4d4d",
    borderRadius: 5,
    marginBottom: 20,
  },
  exitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Guide;
