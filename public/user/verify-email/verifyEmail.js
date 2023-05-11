// var url_string = window.location.search;

// console.log(url_string);
// var url = new URL(url_string);
// var token = url.searchParams.get("token");
// console.log(token);
// var email = url.searchParams.get("email");
// console.log(email);

var params = {};

if (location.search) {
  var parts = location.search.substring(1).split("&");

  for (var i = 0; i < parts.length; i++) {
    var nv = parts[i].split("=");
    if (!nv[0]) continue;
    params[nv[0]] = nv[1] || true;
  }
}

var myFunction = function () {
  window.open("/auth/login", "self");
};
console.log(params);

const verifyToken = async () => {
  try {
    const { data } = await axios
      .post("/api/v1/auth/verify-email", {
        verificationToken: params.token,
        email: params.email,
      })
      .then((res) => {
        if (res.status === 200) {
          const card = document.createElement("div");
          document.querySelector(".container").append(card);
          card.classList.add("card");
          card.textContent = `Account Confirmed`;
          const btn = document.createElement("button");
          btn.classList.add("button");
          btn.textContent = "Please Login";
          btn.onclick = myFunction;
          card.append(btn);
        }
      });
  } catch (error) {
    console.log(error);
  }
};

verifyToken();
