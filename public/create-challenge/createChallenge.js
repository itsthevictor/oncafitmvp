// Select dom elements
const steps = Array.from(document.querySelectorAll("form .step"));
const nextBtn = document.querySelectorAll(".next-btn");
const prevBtn = document.querySelectorAll(".prev-btn");
const form = document.querySelector("form");
const container = document.querySelectorAll(".container");
const optionBtn = document.querySelectorAll("form .option-btn");
const beginnerBox = document.querySelector(".beginner-box");
const intermediateBox = document.querySelector(".intermediate-box");
const advancedBox = document.querySelector(".advanced-box");
var theInputs = document.querySelectorAll(".btn2");
const modal = document.querySelector(".modal");
const modalTxt = document.querySelector(".modal-txt");
const spacer = document.querySelector(".spacer");
const btns = document.querySelectorAll(".btnf");
const repsInput = document.querySelector(".reps-input");

const challenge = {
  type: {
    type: String,
  },
  exercise: {
    type: String,
  },
  reps: {
    type: Number,
  },
};

let beginnerE = [];
let advancedE = [];
let intermediateE = [];
let allExes = [];
let height;

// Buton Methods
optionBtn.forEach((button) => {
  button.addEventListener("click", async () => {
    beginnerBox.replaceChildren();
    intermediateBox.replaceChildren();
    advancedBox.replaceChildren();
    const text = button.textContent.toLowerCase();
    challenge.type = text;
    const response = await fetch("/api/v1/exercises/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    const allEx = data.exercises;
    const selectedType = allEx.filter((p) =>
      p.branch.includes(`${challenge.type}`)
    );

    allExes = selectedType;
    const beginnerExercises = selectedType.filter((p) =>
      p.level.includes("beg")
    );

    const advanced = selectedType.filter((p) => p.level.includes("adv"));
    const intermediate = selectedType.filter((p) => p.level.includes("inte"));
    beginnerE = beginnerExercises;
    intermediateE = intermediate;
    advancedE = advanced;
    changeStep("next");
  });
});

function populateExercises() {
  beginnerE.forEach((beginnerE) => {
    var newElement = document.createElement("input");
    newElement.type = "button";
    newElement.className = "btn2";
    newElement.value = beginnerE.name;
    newElement.textContent = beginnerE.name;
    beginnerBox.append(newElement);
  });
  intermediateE.forEach((intermediateE) => {
    var newElement = document.createElement("input");
    newElement.type = "button";
    newElement.className = "btn2";
    newElement.value = intermediateE.name;
    newElement.textContent = intermediateE.name;
    intermediateBox.append(newElement);
  });
  advancedE.forEach((advancedE) => {
    var newElement = document.createElement("input");
    newElement.type = "button";
    newElement.className = "btn2";
    newElement.id = "ex";
    newElement.value = advancedE.name;
    newElement.textContent = advancedE.name;
    advancedBox.append(newElement);
  });
  theInputs = document.querySelectorAll(".btn2");
}

populateExercises();

nextBtn.forEach((button) => {
  button.addEventListener("click", () => {
    changeStep("next");
    modal.classList.add("hidden");
  });
});

prevBtn.forEach((button) => {
  button.addEventListener("click", () => {
    changeStep("prev");
  });
});

// Change steps
function changeStep(btn) {
  let index = 0;
  const active = document.querySelector("form .step.active");
  index = steps.indexOf(active);
  steps[index].classList.remove("active");

  if (btn === "next") {
    index++;
    populateExercises();

    theInputs = document.querySelectorAll(".btn2");
  } else if (btn === "prev") {
    modal.classList.add("hidden");
    index--;
  }
  steps[index].classList.add("active");
  console.log(index);
}

(function () {
  var selector = document.querySelector(".btn2");
  // We bind the event handler directly to the document.
  document.addEventListener("click", function (e) {
    // All click events will be handled by this function, so it needs to be as cheap as possible. To check
    // whether this function should be invoked, we're going to check whether the element that was clicked on
    // was the elemnt that we care about. The element that was clicked on is made available at "e.target"
    var el = e.target;
    // Check if it matches our previously defined selector
    if (!el.matches(".btn2")) {
      return;
    }
    // The method logic
    // alert("Hello, World!");

    theInputs.forEach((theInput) => {
      theInput.addEventListener("click", () => {
        let text = theInput.value;
        challenge.exercise = text;
        modalTxt.replaceChildren();
        let yourExercise = allExes.filter((p) => p.name === `${text}`);
        let instructions = yourExercise[0].instructions;
        var newerElement = document.createElement("div");
        yourExercise = allExes.filter((p) => p.name === `${text}`);
        instructions = yourExercise[0].instructions;
        newerElement.className = "inst";
        newerElement.textContent = `${instructions}`;
        modalTxt.append(newerElement);
        modal.classList.remove("hidden");
        height = modal.offsetHeight;
        spacer.style.height = `${height + 15}px`;
        spacer.classList.remove("hidden");
      });
    });
    theInputs.forEach(function (input) {
      input.addEventListener("click", function () {
        theInputs.forEach(function (input) {
          input.classList.remove("activeOption");
        });
        this.classList.add("activeOption");
      });
    });
  });
})();

btns.forEach((btn) => {
  btn.addEventListener("click", () => {
    challenge.reps = btn.textContent;
    repsInput.value = null;
  });
});

document.querySelector(".reps-input").addEventListener("input", () => {
  challenge.reps = repsInput.value;
  // console.log(challenge);
});

form.addEventListener("submit", async (e) => {
  if (!challenge.reps) {
    alert("please set reps");
    return;
  }
  console.log(challenge);
  e.preventDefault();
  postChallenge();
  setTimeout(() => {
    window.open("/", "_self");
  }, 1000);
});

async function postChallenge() {
  const response = await fetch("/api/v1/challenges", {
    method: "POST",
    headers: {
      "Content-Type": "application/JSON",
    },
    body: JSON.stringify(challenge),
  });
  const data = await response.json();
}
