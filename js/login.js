const elForm = document.querySelector(".site-form");
const elUserName = elForm.querySelector("#usernameInput");
const elPassword = elForm.querySelector("#passwordInput");
const elMessage = elForm.querySelector("#message");

const API = "https://super-online-chat.herokuapp.com/";

elForm.addEventListener("submit", async (evt) => {
  evt.preventDefault();

  let res = await fetch(API + "login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userName: `${elUserName.value}`, password: `${elPassword.value}` }),
  });
  let data = await res.json();

  if (data.status == 200) {
    window.localStorage.setItem("token", data.token);
    window.localStorage.setItem("userId", data.data.userId)
  } else elMessage.textContent = data.message;

  let token = window.localStorage.getItem("token");
  let userId  = window.localStorage.getItem("userId")

  if (token && userId) {
    location.replace("http://127.0.0.1:5500/index.html");
  }
});


