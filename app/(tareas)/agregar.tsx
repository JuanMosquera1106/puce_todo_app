import FormularioTarea from "../../components/FormularioTarea";

export default function AgregarTarea() {
  return (
    <FormularioTarea
      visible={true}
      onClose={function (): void {
        throw new Error("Function not implemented.");
      }}
    />
  );
}
