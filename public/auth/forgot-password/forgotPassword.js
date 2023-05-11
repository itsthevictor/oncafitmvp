const loginFormDOM = document.querySelector(".login-form");
const loginCard = document.querySelector(".login-card");
const emailInput = document.getElementById("email-input");
const passwordInput = document.getElementById("password-input");

loginFormDOM.addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log("credentials sent");
  const email = emailInput.value;
  const data = { email };
  try {
    axios
      .post("/api/v1/auth/forgot-password", data)
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
