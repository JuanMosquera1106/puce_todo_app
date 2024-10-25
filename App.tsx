import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { TareasProvider } from "./context/TareasContext"; // Asegúrate de que la ruta sea correcta
import Layout from "./app/_layout"; // Asegúrate de que la ruta sea correcta

export default function App() {
  return (
    <SafeAreaProvider>
      <TareasProvider>
        <View style={styles.container}>
          <StatusBar style="light" />
          <Layout />
        </View>
      </TareasProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
});
