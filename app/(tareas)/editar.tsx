import FormularioTarea from "../../components/FormularioTarea";
import { useLocalSearchParams } from "expo-router";

export default function EditarTarea() {
  const params = useLocalSearchParams();

  // Función para convertir a string si es un array de strings o devolver undefined si no está presente
  const obtenerParametroComoString = (
    param: string | string[] | undefined,
  ): string | undefined => {
    if (Array.isArray(param)) {
      return param[0]; // Tomamos el primer elemento si es un array
    }
    return param; // Retorna directamente si es string o undefined
  };

  const tareaInicial = {
    id: obtenerParametroComoString(params.id) as string,
    nombre: obtenerParametroComoString(params.nombre) as string,
    prioridad: obtenerParametroComoString(params.prioridad) as
      | "Baja"
      | "Media"
      | "Alta",
    materia: obtenerParametroComoString(params.materia) as string,
    fechaVencimiento: obtenerParametroComoString(
      params.fechaVencimiento,
    ) as string,
    repetir: obtenerParametroComoString(params.repetir) || null, // null si no existe
    pomodoro: params.pomodoro
      ? JSON.parse(obtenerParametroComoString(params.pomodoro)!)
      : null,
    recordatorio: params.recordatorio
      ? JSON.parse(obtenerParametroComoString(params.recordatorio)!)
      : null,
  };

  return (
    <FormularioTarea
      esEditar={true}
      tareaInicial={tareaInicial}
      visible={true}
      onClose={() => {
        // Implement the onClose functionality here
      }}
    />
  );
}
