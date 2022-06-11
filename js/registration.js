const elForm = document.querySelector(".site-form");
const elUserName = elForm.querySelector("#usernameInput");
const elEmail = elForm.querySelector("#emailInput");
const elPassword = elForm.querySelector("#passwordInput");
const elAvatar = elForm.querySelector("#uploadInput");
const elMessage = elForm.querySelector("#message");

const API = "https://super-online-chat.herokuapp.com/";

elForm.addEventListener("submit", async (evt) => {
  evt.preventDefault();

  let formData = new FormData();
  let userData = JSON.stringify({
    userName: elUserName.value,
    password: elPassword.value,
    email: elEmail.value,
  });

  formData.append("avatar", elAvatar.files[0]);
  formData.append("userData", userData);

  let res = await fetch(API + "register", {
    method: "POST",
    body: formData,
  });
  let data = await res.json();

  if (data.status == 201) {
    window.localStorage.setItem("token", data.token);
    window.localStorage.setItem("userId", data.userId);
  } else elMessage.textContent = data.message;

  let token = window.localStorage.getItem("token");
  let userId = window.localStorage.getItem("userId");

  if (token && userId) {
    location.replace("http://127.0.0.1:5500/index.html");
  }
});
