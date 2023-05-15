const btn = document.getElementById("btn");
const input = document.getElementById("input");
const set = document.getElementById("set");
const circularProgress = document.querySelector(".circular-progress");
const progValue = document.querySelector(".prog");
const progBar = document.querySelector(".progress-bar");
const hVolume = document.getElementById("h-volume");
const hWeight = document.getElementById("h-weight");
const hSets = document.getElementById("h-sets");
const hReps = document.getElementById("h-reps");
const summary = document.querySelector(".summary");
const canvas = document.querySelector(".canvas");
const ctx = document.getElementById("summaryChart");
const title = document.querySelector(".title");
const done = document.querySelector(".done-btn");
const bind = document.querySelector(".bind");
const counterBox = document.querySelector(".counter-box");

function myFunction(x) {
  x.classList.toggle("change");
}

var redirect = function () {
  window.open("/create-challenge", "self");
};
var redirectHome = function () {
  window.open("/", "self");
};

document.getElementById("input").addEventListener("keypress", function (evt) {
  if ((evt.which != 8 && evt.which != 0 && evt.which < 48) || evt.which > 57) {
    evt.preventDefault();
  }
});

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
let activeWeight;
let unit;

const startTime = new Date(Date.now());

getUser();
async function getUser() {
  const response = await fetch("/api/v1/users/showMe");
  const data = await response.json();
  if (!data.user) {
    window.open("/auth/register/", "_self");
  } else {
    // const { weight, unit } = data.user;

    activeWeight = data.user.weight.toFixed(1);
    // hWeight.textContent = `${activeWeight} ${data.user.unit}`;

    unit = data.user.unit;
  }
}
// hWeight.textContent = `${user.weight * 0.6} ${user.unit}`;

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
    const { weightDist } = challenge;

    activeWeight = (activeWeight * weightDist).toFixed(1);
    hWeight.textContent = `${activeWeight} ${unit}`;
    title.textContent = challenge.exercise;
    let { date } = challenge.workouts.pop();
    // get last workout date and current date
    const wDate = new Date(date);
    const newDate = new Date();
    // check if have already performed this exercise today
    if (newDate.setHours(0, 0, 0, 0) == wDate.setHours(0, 0, 0, 0)) {
      // if workout already today on this challenge the message an bac to dashboard button or create new challenge
      bind.classList.add("hidden");
      const already = document.createElement("div");
      const msg = document.createElement("div");
      const actions = document.createElement("div");
      const or = document.createElement("div");
      const cta1 = document.createElement("button");
      const cta2 = document.createElement("button");
      document.querySelector(".container").append(already);
      done.innerHTML = `<i class="fa-solid fa-xmark fa-lg"></i>`;
      done.style.background = `var(--itemback)`;
      done.style.border = `none`;
      done.style.color = `var(--accent)`;
      msg.style.textAlign = `center`;
      msg.style.marginBottom = `0.5rem`;
      msg.innerHTML = `<h3>It looks like you've already nailed this challenge today. Come back tomorrow to workout again</h3>`;
      or.textContent = `or`;
      or.style.textAlign = `center`;
      or.style.marginBottom = `0.75rem`;
      or.style.color = `var(--accent)`;
      cta2.textContent = "create a new challenge";
      cta2.onclick = redirect;
      already.append(msg);
      already.append(actions);
      actions.append(or);
      actions.append(cta2);
      circularProgress.style.background = "var(--accent)";
      progValue.style.color = "var(--accent)";
      done.classList.remove("hidden");
    }
  }
}

btn.addEventListener("click", () => {
  if (!input.value) {
    return;
  }
  reps = parseInt(input.value);
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

  // Volume
  volume = (activeWeight * sum).toFixed(0);
  hVolume.textContent = `${volume} ${unit}`;

  if (sum >= target) {
    alert("workout complete!");
    progBar.style.padding = "0";
    btn.disabled = true;
    input.disabled = true;

    const cta2 = document.createElement("button");
    cta2.textContent = "done";
    cta2.onclick = redirectHome;
    document.querySelector(".complete").append(cta2);
    summary.textContent = `Summary: ${sets}`;
    summary.classList.remove("hidden");
    circularProgress.classList.add("hidden");
    canvas.style.width = "100%";
    canvas.classList.remove("hidden");

    counterBox.classList.add("hidden");
    const data = { sets };
    for (let i = 0; i < sets.length; i++) {
      labels[i] = `set ${i + 1}`;
    }

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
    const endTime = new Date(Date.now());
    workout.date = endTime;
    workout.sets = sets;
    const duration = (
      (endTime.getTime() - startTime.getTime()) /
      60000
    ).toFixed(2);
    workout.duration = duration;
    workout.volume = volume;

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
