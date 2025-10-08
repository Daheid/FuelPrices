const form = document.getElementById("demoForm")
const tableBody = document.querySelector("#resultsTable tbody")

// contenedor de paginación debajo de la tabla
const pagination = document.createElement("div")
pagination.id = "pagination"
document.querySelector(".results").appendChild(pagination)

let allResults = []
let currentPage = 1
const rowsPerPage = 10

// Función para renderizar la tabla según la página
function renderTable(page = 1) {
  tableBody.innerHTML = ""

  const start = (page - 1) * rowsPerPage
  const end = start + rowsPerPage
  const paginatedData = allResults.slice(start, end)

  paginatedData.forEach((item) => {
    const row = document.createElement("tr")
    row.innerHTML = `
      <td>${item.period}</td>
      <td>${item.area.replaceAll("_", " ")}</td>
      <td>${item.product.replaceAll("_", " ")}</td>
      <td>${item.value}</td>
    `
    tableBody.appendChild(row)
  })

  renderPagination()
}

// Función para mostrar botones de paginación
function renderPagination() {
  pagination.innerHTML = ""
  const totalPages = Math.ceil(allResults.length / rowsPerPage)

  if (totalPages <= 1) return // no mostrar botones si hay menos de 30 filas

  if (currentPage > 1) {
    const prevBtn = document.createElement("button")
    prevBtn.textContent = "Anterior"
    prevBtn.onclick = () => {
      currentPage--
      renderTable(currentPage)
    }
    pagination.appendChild(prevBtn)
  }

  const pageInfo = document.createElement("span")
  pageInfo.textContent = ` Página ${currentPage} de ${totalPages} `
  pagination.appendChild(pageInfo)

  if (currentPage < totalPages) {
    const nextBtn = document.createElement("button")
    nextBtn.textContent = "Siguiente"
    nextBtn.onclick = () => {
      currentPage++
      renderTable(currentPage)
    }
    pagination.appendChild(nextBtn)
  }
}

// Submit con POST
form.addEventListener("submit", async (e) => {
  e.preventDefault()

  const fechaa = new Date()
  const fecha =
    document.getElementById("campo1").value ||
    fechaa.toISOString().split("T")[0]
  const area = document.getElementById("campo2").value
  const producto = document.getElementById("campo3").value

  const url =
    "https://api.fuelprices.nelsoncarrero.dev/api/v1/prices/filter/eia"

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

    const json = await response.json()

    const periodo = json.adjusted_period || json.requested_period || fecha

    // Guardar resultados en un array global
    allResults = json.data.map((item) => ({
      period: periodo,
      area: item.area,
      product: item.product,
      value: item.value,
    }))

    currentPage = 1
    if (allResults.length > 0) {
      renderTable()
    } else {
      tableBody.innerHTML = `<tr><td colspan="4">No se encontraron datos</td></tr>`
      pagination.innerHTML = ""
    }
  } catch (error) {
    console.error("Error al obtener datos:", error)
    tableBody.innerHTML = `<tr><td colspan="4">Error al cargar los datos</td></tr>`
    pagination.innerHTML = ""
  }
})
