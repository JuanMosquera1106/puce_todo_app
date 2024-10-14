import { View } from "react-native";
import { Stack } from "expo-router";
import { styled } from "nativewind"; // Usamos NativeWind para aplicar clases
import { Logo } from "../components/Logo";
import { CircleInfoIcon } from "../components/Icons";
import { TareasProvider } from "../context/TareasContext";

const StyledView = styled(View);

export default function Layout() {
  return (
    <StyledView className="flex-1 bg-black">
      <TareasProvider>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: "black" },
            headerTintColor: "white", // Color de texto en el header
            headerTitle: "",
            headerLeft: () => <Logo />,
            headerRight: () => <CircleInfoIcon />,
          }}
        />
      </TareasProvider>
    </StyledView>
  );
}
