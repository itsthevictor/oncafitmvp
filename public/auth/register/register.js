const signupFormDOM = document.querySelector(".signup-form");
const signupCard = document.querySelector(".signup-card");
const nameSignup = document.getElementById("name-signup");
const emailSignup = document.getElementById("email-signup");
const passwordSignup = document.getElementById("password-signup");
const weightSignup = document.getElementById("w-signup");
const toggleKg = document.getElementById("toggle-on");
const toggleLb = document.getElementById("toggle-off");

let unit = "kg";
console.log(toggleKg.value, toggleLb.value);

toggleKg.addEventListener("click", () => {
  unit = "kg";
  console.log(unit);
});

toggleLb.addEventListener("click", () => {
  unit = "lb";
  console.log(unit);
});

signupFormDOM.addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log(weightSignup.value);
  const name = nameSignup.value;
  const email = emailSignup.value;
  const password = passwordSignup.value;
  const weight = weightSignup.value;
  //   if (!emailInput.value || !passwordInput.value) return;
  const user = { email, name, password, weight, unit };
  try {
    axios
      .post("/api/v1/auth/register", user)
      .then((res) => {
        if (res.status === 201) {
          console.log("success");
          nameSignup.value = "";
          emailSignup.value = "";
          passwordSignup.value = "";
          signupCard.classList.add("hidden");
          document.querySelector(".success-message").textContent = res.data.msg;
          document.querySelector(".success-message").classList.remove("hidden");
        }
      })
      .catch((error) => {
        document.querySelector(".error-message").textContent =
          error.response.data.msg;
        document.querySelector(".error-message").classList.remove("hidden");
      });
  } catch (err) {
    console.log(err);
  }
});
