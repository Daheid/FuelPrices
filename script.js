const form = document.getElementById("demoForm")
const tableBody = document.querySelector("#resultsTable tbody")

form.addEventListener("submit", async (e) => {
  e.preventDefault()

  const fechaa = new Date()
  const fecha =
    document.getElementById("campo1").value ||
    fechaa.toISOString().split("T")[0]
  const area = document.getElementById("campo2").value
  const producto = document.getElementById("campo3").value

  const url = "https://fuelpricesapi.nelsoncarrero.dev/api/v1/prices/filter/eia"

  console.log("Enviando request con:", {
    period: fecha,
    area: area,
    product: producto,
  })

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        period: fecha,
        area: area,
        product: producto,
      }),
    })

    console.log("Status:", response.status)

    // Leer la respuesta como texto primero para debugging
    const responseText = await response.text()
    console.log("Response raw:", responseText)

    // Parsear el texto a JSON
    const json = JSON.parse(responseText)

    // Limpiar tabla
    tableBody.innerHTML = ""

    // Guardamos el periodo ajustado o el solicitado para mostrar en cada fila
    const periodo = json.adjusted_period || json.requested_period || fecha

    json.data.forEach((item) => {
      const row = document.createElement("tr")
      row.innerHTML = `
        <td>${periodo}</td>
        <td>${item.area}</td>
        <td>${item.product}</td>
        <td>${item.value}</td>
      `
      tableBody.appendChild(row)
    })

    if (json.data.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="4">No se encontraron datos</td></tr>`
    }
  } catch (error) {
    console.error("Error al obtener datos:", error)
    tableBody.innerHTML = `<tr><td colspan="4">Error al cargar los datos</td></tr>`
  }
})
