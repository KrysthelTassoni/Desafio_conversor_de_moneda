  //Evento Click y Obtención de los valores del formulario

document
  .getElementById("convertButton")
  .addEventListener("click", async function () {
    const amount = document.getElementById("amount").value;
    const currency = document.getElementById("currency").value;
    const resultElement = document.getElementById("result");
    //Simbolos de las monedas
    const currencySymbols = {
      dolar: "$",
      euro: "€",
    };

    if (!amount || !currency) {
      resultElement.textContent =
        "Por favor, ingrese un monto y seleccione una moneda.";
      return;
    }

    //Manejo de errores, obtención de la data y conversión de la moneda
    try {
      const response = await fetch(`https://mindicador.cl/api/${currency}`);
      if (!response.ok) throw new Error("Error al obtener los datos");
      const data = await response.json();
      const conversionRate = data.serie[0].valor;
      const convertedAmount = (amount / conversionRate).toFixed(4);
      const currencySymbol = currencySymbols[currency];
      resultElement.textContent = `Resultado: ${currencySymbol}${convertedAmount}`;

      const labels = data.serie
        .slice(0, 10)
        .map((item) => new Date(item.fecha).toLocaleDateString())
        .reverse();
      const values = data.serie
        .slice(0, 10)
        .map((item) => item.valor)
        .reverse();

      renderChart(labels, values);
    } catch (error) {
      resultElement.textContent = `Error: ${error.message}`;
    }
  });

   //Gráfico
let chart;

function renderChart(labels, data) {
  const ctx = document.getElementById("chart").getContext("2d");

  //.Destroy
  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Historial últimos 10 días",
          data: data,
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 2,
          fill: false,
        },
      ],
    },
    options: {
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: "Fecha",
          },
        },
        y: {
          display: true,
          title: {
            display: true,
            text: "Valor",
          },
        },
      },
    },
  });
}
