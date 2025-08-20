document.addEventListener("DOMContentLoaded", async () => {
  const selectArea = document.getElementById("campo3")

  try {
    // Endpoint GET que devuelve las áreas
    const url =
      "https://fuelpricesapi.nelsoncarrero.dev/api/v1/products/filter/eia"
    const response = await fetch(url, { method: "GET" })
    const json = await response.json()

    // Limpiar opciones previas excepto la primera
    selectArea.innerHTML = `<option value="all">Selecciona un producto</option>`

    // Agregar opción "Todos"
    selectArea.innerHTML += `<option value="all">Todos</option>`

    // Recorrer el array "data"
    json.data.forEach((area) => {
      const option = document.createElement("option")
      option.value = area.name // o area.id si prefieres enviar el id
      option.textContent = area.name.replaceAll("_", " ")
      selectArea.appendChild(option)
    })
  } catch (error) {
    console.error("Error al obtener los productos:", error)
  }
})
