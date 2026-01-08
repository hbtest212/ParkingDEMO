export default function ParkingGrid({ estacionamiento, onEspacioClick }) {
  return (
    <div className="p-4 border border-green-500 rounded-lg shadow-md bg-black text-green-400">
      <h2 className="text-xl font-bold border-l-4 border-green-500 pl-2 mb-4">
        Estacionamiento
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {estacionamiento && estacionamiento.length > 0 ? (
          estacionamiento.map((esp) => {
            const espacioLibre = esp.libre;

            return (
              <div
                key={esp.id}
                onClick={() => onEspacioClick(esp)}
                className={`flex justify-center items-center w-28 h-16 rounded-lg border 
                  ${espacioLibre ? "bg-green-800 border-green-400" : "bg-red-800 border-red-400 text-red-300"}
                  cursor-pointer hover:scale-105 hover:shadow-lg transition`}
              >
                {espacioLibre ? "LIBRE" : esp.vehiculo.patente}
              </div>
            );
          })
        ) : (
          <p>No hay espacios disponibles</p>
        )}
      </div>
    </div>
  );
}
