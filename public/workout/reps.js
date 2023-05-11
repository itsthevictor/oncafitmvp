const btn = document.getElementById("btn");
const input = document.getElementById("input");
const set = document.getElementById("set");
const circularProgress = document.querySelector(".circular-progress");
const progValue = document.querySelector(".prog");
const hVolume = document.getElementById("h-volume");
const hWeight = document.getElementById("h-weight");
const hSets = document.getElementById("h-sets");
const hReps = document.getElementById("h-reps");
const summary = document.querySelector(".summary");
const canvas = document.querySelector(".canvas");
const ctx = document.getElementById("summaryChart");
const title = document.querySelector(".title");
const done = document.querySelector(".done-btn");

function myFunction(x) {
  x.classList.toggle("change");
}

let userProfile = {
  name: "Victor",
  weight: "64",
};

let exercise = {
  name: "Pseudo Planche Push-ups",
  weightDist: "0.7",
};

let counter = 1;
let sum = 0;
let reps;
let sets = [];
let target = 0;
let progress = 0;
let circle;
let volume;
let seshSets = {};
let setNo;
let labels = [];
let workout = {};

hWeight.textContent = `${userProfile.weight * exercise.weightDist} kg`;

const queryString = window.location.search;
id = queryString.substring(queryString.length - 24);

const url = `/api/v1/challenges`;
getChallenge();

async function getChallenge() {
  const response = await fetch(`/api/v1/challenges/${id}`);
  const data = await response.json();
  const { challenge } = data;
  if (!data) {
    console.log("no data");
  } else {
    target = challenge.reps;
    title.textContent = challenge.exercise;
    let { date } = challenge.workouts.pop();
    // get last workout date and current date
    const wDate = new Date(date);
    const newDate = new Date();
    // check if have already performed this exercise today
    if (newDate.setHours(0, 0, 0, 0) == wDate.setHours(0, 0, 0, 0)) {
      console.log("yes");
    } else {
      console.log("no");
      // what happens if have already performed this exercise today
    }
  }
}
console.log(target);
btn.addEventListener("click", () => {
  reps = parseInt(input.value);
  // console.log(reps);
  input.value = "";
  sum = parseInt(sum) + reps;
  counter++;
  set.textContent = `Set ${counter}`;
  sets.push(reps);

  progress = ((sum / target) * 100).toFixed(0);
  progValue.textContent = `${progress}%`;
  circle = (progress / 100) * 360;
  circularProgress.style.background = `conic-gradient(#30D589 ${circle}deg, #003844 0deg)`;
  progValue.style.color = "#30D589";
  hReps.textContent = sum;
  hSets.textContent = counter - 1;
  volume = (userProfile.weight * exercise.weightDist * sum).toFixed(0);
  hVolume.textContent = `${volume} kg`;

  if (sum >= target) {
    alert("workout complete!");
    btn.disabled = true;
    input.disabled = true;
    btn.style.background = "#195C54";
    btn.style.borderColor = "#195C54";
    summary.textContent = `Summary: ${sets}`;
    summary.classList.remove("hidden");
    circularProgress.classList.add("hidden");
    canvas.classList.remove("hidden");
    done.classList.remove("hidden");
    const data = { sets };
    for (let i = 0; i < sets.length; i++) {
      labels[i] = `set ${i + 1}`;
    }

    console.log(sets);
    // console.log(labels);
    const summaryChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            data: sets,
            borderWidth: 2,
            backgroundColor: "#28ca9f",
            borderColor: "#28ca9f",
            borderRadius: 2.5,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        plugins: {
          legend: false,
        },
      },
    });

    //send data to server and insert to database
    const date = new Date(Date.now());
    workout.date = date;
    workout.sets = sets;
    console.log(workout);
    fetch(`/api/v1/challenges/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/JSON",
      },
      body: JSON.stringify(workout),
    }).then((response) => {
      response.json();
    });

    // reset counters
    counter = 1;
    set.textContent = `Set ${counter}`;
    sum = 0;
  }
});
