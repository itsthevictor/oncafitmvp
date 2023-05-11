const hud = document.querySelector(".welcome");
const btn = document.querySelector(".btn");
const chalDiv = document.querySelector(".challenges");
const list = document.querySelector(".list");

getUser();

async function getUser() {
  const response = await fetch("api/v1/users/showMe");
  const data = await response.json();
  if (!data.user) {
    window.open("/auth/register/", "_self");
  } else {
    const { name } = data.user;
    getAllMyChallenges();
  }
}

async function getAllMyChallenges() {
  const response = await fetch("api/v1/challenges/myChallenges");
  const data = await response.json();
  const challenges = data.challenges;
  console.log(data);
  if (challenges.length < 1) {
    const noChal = document.createElement("div");
    noChal.classList.add("noChal");
    noChal.textContent = `You don't have any challenges yet. Get started to get strong!`;
    list.append(noChal);
  }

  // console.log(challenges[0].exercise);
  for (item of challenges) {
    const chal = document.createElement("div");
    chal.classList.add("chal");
    chal.textContent = `${item.exercise}`;
    const one = document.createElement("div");
    one.classList.add("one");
    var actions = document.createElement("div");
    actions.classList.add("actions");
    const link = document.createElement("div");
    link.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';

    var a = document.createElement("a");
    a.appendChild(link);
    a.title = `${item._id}`;
    a.href = `/workout?challengeId=${item._id}`;
    a.classList.add("button");
    actions.append(a);
    one.append(chal);
    if (item.reportsAvaliable) {
      var reports = document.createElement("div");
      reports.classList.add("reports");
      const link2 = document.createElement("div");
      link2.innerHTML = '<i class="fa-solid fa-chart-line"></i>';
      var a2 = document.createElement("a");
      a2.appendChild(link2);
      console.log(a2.innerHTML);

      a2.title = `${item._id}`;
      a2.href = `/reports?challengeId=${item._id}`;
      a2.classList.add("button");
      reports.append(a2);
      one.append(reports);
    }
    // actions.append(link2);

    one.append(actions);

    list.append(one);
  }
}

function createChallenge() {
  console.log("btn clicked");
  window.open("/create-challenge/", "_self");
}

async function logOut() {
  await fetch("api/v1/auth/logout", {
    method: "DELETE",
  }).then((response) => {
    response.json();
  });

  window.open("/auth/login/", "_self");
}
