import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler"; // Importar GestureHandlerRootView
import { TareasProvider } from "./context/TareasContext"; // Asegúrate de que la ruta sea correcta
import Layout from "./app/_layout"; // Asegúrate de que la ruta sea correcta
import "react-native-gesture-handler";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <TareasProvider>
          <StatusBar style="light" />
          <Layout />
        </TareasProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
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
