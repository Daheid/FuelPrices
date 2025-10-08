document.addEventListener("DOMContentLoaded", async () => {
  const selectArea = document.getElementById("campo2")

  try {
    // Endpoint GET que devuelve las áreas
    const url =
      "https://api.fuelprices.nelsoncarrero.dev/api/v1/areas/filter/eia"
    const response = await fetch(url, { method: "GET" })
    const json = await response.json()

    // Limpiar opciones previas excepto la primera
    selectArea.innerHTML = `<option value="all">Selecciona un área</option>`

    // Agregar opción "Todas"
    selectArea.innerHTML += `<option value="all">Todas</option>`

    // Recorrer el array "data"
    json.data.forEach((area) => {
      const option = document.createElement("option")
      option.value = area.name // o area.id si prefieres enviar el id
      option.textContent = area.name.replaceAll("_", " ")
      selectArea.appendChild(option)
    })
  } catch (error) {
    console.error("Error al obtener las áreas:", error)
  }
})
