const loginFormDOM = document.querySelector(".login-form");
const loginCard = document.querySelector(".login-card");
const emailInput = document.getElementById("email-input");
const passwordInput = document.getElementById("password-input");

loginFormDOM.addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log("credentials sent");
  const email = emailInput.value;
  const password = passwordInput.value;
  //   if (!emailInput.value || !passwordInput.value) return;
  const user = { email, password };
  try {
    axios
      .post("/api/v1/auth/login", user)
      .then((res) => {
        if (res.status === 200) {
          emailInput.value = "";
          passwordInput.value = "";
          window.open("/", "_self");
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
