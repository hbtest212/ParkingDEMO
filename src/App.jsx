import { useState, useEffect } from "react";
import PanelConfig from "./components/PanelConfig";
import ParkingGrid from "./components/ParkingGrid";
import ModalRegistro from "./components/ModalRegistro";
import PanelRetiro from "./components/PanelRetiro";
import { API_URL } from "./data/data.js";

function App() {
  const [config, setConfig] = useState({
    espacios: parseInt(localStorage.getItem("espacios")) || 20,
    precioMoto: parseInt(localStorage.getItem("precioMoto")) || 300,
    precioAuto: parseInt(localStorage.getItem("precioAuto")) || 500,
  });

  const [estacionamiento, setEstacionamiento] = useState([]);
  const [modalRegistroOpen, setModalRegistroOpen] = useState(false);
  const [espacioSeleccionado, setEspacioSeleccionado] = useState(null);
  const [tipo, setTipo] = useState("Auto");
  const [patente, setPatente] = useState("");

  useEffect(() => {
    async function cargarEstacionamiento() {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        const espacios = Array.from({ length: config.espacios }, (_, i) => {
          const veh = data.find((v) => v.espacioId === i + 1);
          return {
            id: i + 1,
            libre: !veh,
            vehiculo: veh ? { tipo: veh.tipo, patente: veh.patente, fechaIngreso: veh.fechaIngreso } : null,
          };
        });
        setEstacionamiento(espacios);
      } catch (error) {
        console.error(error);
      }
    }
    cargarEstacionamiento();
  }, [config.espacios]);

  const handleEspacioClick = (espacio) => {
    setEspacioSeleccionado(espacio);
    if (espacio.libre) {
      setTipo("Auto");
      setPatente("");
      setModalRegistroOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-400 p-4">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3 lg:w-1/4">
          <PanelConfig config={config} setConfig={setConfig} />
        </div>

        <div className="w-full md:w-2/3 lg:w-3/4 flex flex-col gap-4">
          <ParkingGrid estacionamiento={estacionamiento} onEspacioClick={handleEspacioClick} />

          {espacioSeleccionado && !espacioSeleccionado.libre && (
            <PanelRetiro
              espacio={espacioSeleccionado}
              config={config}
              onRetirar={(id) => {
                setEstacionamiento((prev) =>
                  prev.map((esp) => (esp.id === id ? { ...esp, libre: true, vehiculo: null } : esp))
                );
                setEspacioSeleccionado(null);
              }}
            />
          )}
        </div>
      </div>

      <ModalRegistro
        show={modalRegistroOpen}
        onClose={() => setModalRegistroOpen(false)}
        espacioSeleccionado={espacioSeleccionado}
        tipo={tipo}
        setTipo={setTipo}
        patente={patente}
        setPatente={setPatente}
        onRegister={(id, tipo, patente) => {
          setEstacionamiento((prev) =>
            prev.map((esp) =>
              esp.id === id ? { ...esp, libre: false, vehiculo: { tipo, patente, fechaIngreso: new Date().toISOString() } } : esp
            )
          );
        }}
      />
    </div>
  );
}

export default App;
