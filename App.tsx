import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler"; // Importar GestureHandlerRootView
import { TareasProvider } from "./context/TareasContext"; // Asegúrate de que la ruta sea correcta
import Layout from "./app/_layout"; // Asegúrate de que la ruta sea correcta
import "react-native-gesture-handler";
import { MenuProvider } from "react-native-popup-menu";
import moment from "moment"; // Importar moment


// Configuración global
moment.locale("es"); // Establecer idioma español
moment.tz.setDefault("America/Guayaquil"); // Establecer zona horaria predeterminada


export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
          <TareasProvider>
             <MenuProvider>
               <StatusBar style="light" />
                <Layout />
            </MenuProvider>
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
