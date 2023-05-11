card1 = document.querySelector(".card1");
card2 = document.querySelector(".card2");
card3 = document.querySelector(".card3");
card4 = document.querySelector(".card4");

const queryString = window.location.search;
id = queryString.substring(queryString.length - 24);

datasetdata = [
  {
    label: "Set ",
    data: [1],
    backgroundColor: "#909090ff",
    borderColor: "#909090ff",
    borderWidth: 2.5,
  },
];

async function logOut() {
  await fetch("api/v1/auth/logout");
  window.open("/auth/", "_self");
}

updateChart();
function updateChart() {
  async function fetchData() {
    const url = `/api/v1/challenges/${id}`;
    const response = await fetch(url);
    // wait until request has been completed
    const datapoints = await response.json();
    // check response
    return datapoints;
  }

  fetchData().then((datapoints) => {
    // crunch the numbers & prepare the datasets
    const summary = datapoints.challenge.workouts.map(function (index) {
      return index.sets;
    });

    // first chart elements
    let output = [];
    var transpose = async function (input) {
      output = Array.from({ length: input[0].length }, () =>
        new Array(input.length).fill(0)
      );
      for (let r = 0; r < input.length; r++) {
        for (let c = 0; c < input[0].length; c++) {
          output[c][r] = input[r][c];
        }
      }
      return output;
    };
    let labels = [];
    transpose(summary);

    for (let i = 0; i < summary.length; i++) {
      labels[i] = `Session ${i + 1}`;
    }
    // let colors = chroma
    //   .scale(["44EDC0", "112A56"])
    //   .mode("hsl")
    //   .colors(output.length);
    // console.log(colors);

    // populate first chart data
    for (var i = 0; i < output.length; i++) {
      datasetdata[i] = {
        label: `Set ${i + 1}`,
        data: output[i],
        backgroundColor: "#003844",
        borderColor: "#003844",
        borderWidth: 2.5,
      };
    }

    datasetdata[0].backgroundColor = "#30D589";
    datasetdata[0].borderColor = "#30D589";

    // update first chart elements
    firstChart.config.data.labels = labels;
    firstChart.config.data.datasets[0].data = output[0];
    firstChart.config.data.datasets = datasetdata;

    firstChart.update();

    //  first info card elements
    var firstSetDelta =
      Math.floor((100 * output[0].slice(-1)) / output[0][0] - 100) + " %";

    // first info DOM handling
    var info1 = document.createElement("div");
    info1.innerHTML = `Look at that. Your first set started out at ${
      output[0][0]
    } reps and you've reached
        now ${output[0].slice(
          -1
        )} reps. That's a ${firstSetDelta} rested output increase, in only ${
      summary.length
    } sessions. And that's just getting started!`;
    card2.append(info1);

    // upate second chart elements
    secondChart.config.data.labels = labels;
    secondChart.config.data.datasets[0].data = output[0];
    secondChart.config.type = "bar";
    secondChart.config.data.datasets = datasetdata;
    secondChart.config.options.scales.x.stacked = true;
    secondChart.config.options.scales.y.stacked = true;
    for (let i = 0; i < datasetdata.length; i++) {
      secondChart.config.data.datasets[i].borderWidth = "0";
    }
    secondChart.update();

    //  second info card elements
    // var firstSetDelta =
    //   Math.floor((100 * output[0].slice(-1)) / output[0][0] - 100) + " %";

    // second info DOM handling
    var info2 = document.createElement("div");
    info2.innerHTML = `Look at that. Your first set started out at ${
      output[0][0]
    } reps and you've reached
        now ${output[0].slice(
          -1
        )} reps. That's a ${firstSetDelta} rested output increase, in only ${
      summary.length
    } sessions. And that's just getting started!`;
    card4.append(info2);
  });
}

const data = {
  labels: [`1`],
  datasets: [
    {
      label: "Set ",
      data: [1],
      backgroundColor: "#909090ff",
      borderStyle: "solid",
      borderColor: "#909090ff",
      borderWidth: 2.5,
    },
  ],
};

// config
const config1 = {
  type: "line",
  data,
  options: {
    scales: {
      x: {
        stacked: false,
      },
      y: {
        beginAtZero: true,
        stacked: false,
      },
    },
    elements: {
      point: {
        radius: 0,
      },
      line: {
        tension: 0.1,
      },
    },
  },
};

const config2 = {
  type: "line",
  data,
  options: {
    scales: {
      x: {
        stacked: false,
      },
      y: {
        beginAtZero: true,
        stacked: false,
      },
    },
    elements: {
      point: {
        radius: 0,
      },
      line: {
        tension: 0.1,
      },
    },
  },
};

// render init block
const firstChart = new Chart(document.getElementById("firstChart"), config1);
const secondChart = new Chart(document.getElementById("secondChart"), config2);
