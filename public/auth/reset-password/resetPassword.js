const loginFormDOM = document.querySelector(".login-form");
const loginCard = document.querySelector(".login-card");
const emailInput = document.getElementById("email-input");
const passwordInput = document.getElementById("password-input");

var params = {};

if (location.search) {
  var parts = location.search.substring(1).split("&");

  for (var i = 0; i < parts.length; i++) {
    var nv = parts[i].split("=");
    if (!nv[0]) continue;
    params[nv[0]] = nv[1] || true;
  }
}
console.log(params);

var myFunction = function () {
  window.open("/auth/login", "self");
};

loginFormDOM.addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log("credentials sent");

  try {
    axios
      .post("/api/v1/auth/reset-password", {
        password: passwordInput.value,
        email: params.email,
        token: params.token,
      })
      .then((res) => {
        if (res.status === 200) {
          console.log("success");
          loginCard.classList.add("hidden");
          console.log(res);
          const card = document.createElement("div");
          const text = document.createElement("div");
          text.classList.add("text");
          card.append(text);
          document.querySelector(".container").append(card);
          card.classList.add("card");
          text.textContent = `Password changed`;
          const btn = document.createElement("button");
          btn.classList.add("button");
          btn.textContent = "Please Login";
          btn.onclick = myFunction;
          card.append(btn);
        }
        console.log(res);
      })
      .catch((error) => {
        console.log(error.response.data.msg);
        document.querySelector(".error-message").textContent =
          error.response.data.msg;
        document.querySelector(".error-message").classList.remove("hidden");
      });
  } catch (err) {
    console.log(err);
  }
});
