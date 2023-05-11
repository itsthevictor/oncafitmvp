const signupFormDOM = document.querySelector(".signup-form");
const signupCard = document.querySelector(".signup-card");
const nameSignup = document.getElementById("name-signup");
const emailSignup = document.getElementById("email-signup");
const passwordSignup = document.getElementById("password-signup");

// signupFormDOM.addEventListener("submit", async (e) => {
//   e.preventDefault();
//   const name = nameSignup.value;
//   const email = emailSignup.value;
//   const password = passwordSignup.value;
//   //   if (!emailInput.value || !passwordInput.value) return;
//   const user = { email, name, password };
//   try {
//     const response = await fetch("/api/v1/auth/register", {
//       method: "POST",
//       headers: {
//         "Content-type": "application/json",
//       },
//       body: JSON.stringify(user),
//     });

//     if (response.status === 201) {
//       nameSignup.value = "";
//       emailSignup.value = "";
//       passwordSignup.value = "";
//       window.open("/", "_self");
//     }
//   } catch (error) {
//     console.log(error);
//   }
// });

signupFormDOM.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = nameSignup.value;
  const email = emailSignup.value;
  const password = passwordSignup.value;
  //   if (!emailInput.value || !passwordInput.value) return;
  const user = { email, name, password };
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
