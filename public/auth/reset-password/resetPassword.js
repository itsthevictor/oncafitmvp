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
          document.querySelector(".success-message").textContent = res.data.msg;
          document.querySelector(".success-message").classList.remove("hidden");
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
