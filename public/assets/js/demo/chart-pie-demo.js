// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

// Pie Chart Example
document.addEventListener("DOMContentLoaded", () => {
  let url = "/piechart"
  fetch(url)
    .then(res => res.json())
    .then(data => {
      var ctx = document.getElementById("myPieChart").getContext("2d");
      var myPieChart = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: data.ship_rows_week_n,
          datasets: [{
            data: data.shipment_week_d,
            backgroundColor: ["#FF5733", "#FFC300", "#33FF57", "#3363FF", "#FF33E0"],
          }],
        },
        options: {
          maintainAspectRatio: false,
          tooltips: {
            backgroundColor: "rgb(255,255,255)",
            bodyFontColor: "#858796",
            borderColor: '#dddfeb',
            borderWidth: 1,
            xPadding: 15,
            yPadding: 15,
            displayColors: false,
            caretPadding: 10,
          },
          cutoutPercentage: 80,
          plugins: {
            legend: {
              position: 'bottom' // 라벨 위치를 아래로 설정
            }
          }
        }
      });
    })
})