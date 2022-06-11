const elForm = document.querySelector(".chat-footer");
const elFileInput = elForm.querySelector("#uploads");
const elTextInput = elForm.querySelector("#textInput");
const elUserList = document.querySelector(".chats-list");
const elChatMain = document.querySelector(".chat-main");
const elUserAvatar = document.querySelector(".profile-avatar");
const elUserName = document.querySelector(".profile-name");
const elUserFile = document.querySelector(".uploaded-file");

const API = "https://super-online-chat.herokuapp.com/";
const token = window.localStorage.getItem("token");
const userId = window.localStorage.getItem("userId");

if (!token || !userId) {
  location.replace("http://127.0.0.1:5500/login.html");
}

async function renderUsers() {
  elUserList.innerHTML = null;

  let res = await fetch(API + "users");
  let data = await res.json();

  if (data.status == 200) {
    data.data.map((user) => {
      let usersItem = document.createElement("li");
      let usersImage = document.createElement("img");
      let usersText = document.createElement("p");

      usersImage.src = user.avatar;
      usersImage.alt = user.userName + "`s avatar";
      usersImage.width = "50";
      usersImage.height = "50";

      usersText.textContent = user.userName;
      usersItem.className = "chats-item";
      usersItem.appendChild(usersImage);
      usersItem.appendChild(usersText);

      return elUserList.appendChild(usersItem);
    });
  }

  return true;
}

renderUsers();

async function renderUserFiles() {
  elChatMain.innerHTML = null;

  let res = await fetch(API + "messages");
  let data = await res.json();

  if (data.status == 200) {
    data.data.forEach((data) => {
      if (data.file.view) {
        let wrapper = document.createElement("div");
        let avatar = document.createElement("img");
        let wrapperInner = document.createElement("div");
        let username = document.createElement("p");
        let object = document.createElement("object");
        let link = document.createElement("a");
        let img = document.createElement("img");
        let time = document.createElement("p");

        wrapper.className =
          userId == data.user.userId ? "msg-wrapper msg-from" : "msg-wrapper";
        avatar.src = data.user.avatar;
        avatar.alt = data.user.name + "`s avatar";
        avatar.width = "50";
        avatar.height = "50";
        wrapperInner.className = "msg-text";
        username.className = "msg-author";
        username.textContent = data.user.name;
        object.className = "msg object-class";
        object.data = data.file.view;
        link.href = data.file.download;
        img.src = "./img/download.png";
        img.alt = "download icon";
        img.width = "25";
        time.className = "time";
        time.textContent = data.date;

        wrapper.appendChild(avatar);
        wrapper.appendChild(wrapperInner);
        wrapperInner.appendChild(username);
        wrapperInner.appendChild(object);
        wrapperInner.appendChild(link);
        wrapperInner.appendChild(time);
        link.appendChild(img);

        elChatMain.appendChild(wrapper);
      }

      if (data.message.trim() != "") {
        let wrapperMsg = document.createElement("div");
        let avatarMsg = document.createElement("img");
        let wrapperInnerMsg = document.createElement("div");
        let usernameMsg = document.createElement("p");
        let messageMsg = document.createElement("p");
        let timeMsg = document.createElement("p");

        wrapperMsg.className =
          userId == data.user.userId ? "msg-wrapper msg-from" : "msg-wrapper";
        avatarMsg.src = data.user.avatar;
        avatarMsg.alt = data.user.name + "`s avatar";
        avatarMsg.width = "50";
        avatarMsg.height = "50";
        wrapperInnerMsg.className = "msg-text";
        usernameMsg.className = "msg-author";
        usernameMsg.textContent = data.user.name;
        messageMsg.className = "msg";
        messageMsg.textContent = data.message;
        timeMsg.className = "time";
        timeMsg.textContent = data.date;

        wrapperMsg.appendChild(avatarMsg);
        wrapperMsg.appendChild(wrapperInnerMsg);
        wrapperInnerMsg.appendChild(usernameMsg);
        wrapperInnerMsg.appendChild(messageMsg);
        wrapperInnerMsg.appendChild(timeMsg);

        elChatMain.appendChild(wrapperMsg);
      }
    });
  }
}

renderUserFiles();

async function users() {
  elUserFile.innerHTML = null;
  let res = await fetch(API + "users");
  let data = await res.json();

  if (data.status == 200) {
    let user = data.data.find((user) => user.userId == userId);

    elUserAvatar.src = user.avatar;
    elUserName.textContent = user.userName;
  }

  let response = await fetch(API + "messages");
  let messagedata = await response.json();

  if (messagedata.status == 200) {
    let allFiles = messagedata.data.filter((file) => {
      if (file.file.view != undefined && file.user.userId == userId) {
        return file;
      }
    });

    allFiles.forEach((file) => {
      let item = document.createElement("li");
      let link = document.createElement("a");
      let img = document.createElement("img");
      let text = document.createElement("p");

      item.className = "uploaded-file-item";
      link.href = file.file.download;
      img.src = file.file.view;
      img.alt = file.file.name;
      img.width = "30";
      text.textContent = file.file.name;

      item.appendChild(link);
      link.appendChild(img);
      link.appendChild(text);
      elUserFile.appendChild(item);
    });
  }
}
users();

elForm.addEventListener("submit", async (evt) => {
  evt.preventDefault();
  elChatMain.innerHTML = null;

  let formData = new FormData();

  // push formdata
  formData.append("file", elFileInput.files[0]);
  formData.append("message", `${elTextInput.value}`);
  formData.append("userId", userId);

  // clear input value
  elTextInput.value = null;
  elFileInput.value = null;

  let res = await fetch(API + "messages", {
    method: "POST",
    headers: { token },
    body: formData,
  });
  let data = await res.json();

  if (data.status == 201) {
    data.data.forEach((data) => {
      if (data.file.view) {
        let wrapper = document.createElement("div");
        let avatar = document.createElement("img");
        let wrapperInner = document.createElement("div");
        let username = document.createElement("p");
        let object = document.createElement("object");
        let link = document.createElement("a");
        let img = document.createElement("img");
        let time = document.createElement("p");

        wrapper.className =
          userId == data.user.userId ? "msg-wrapper msg-from" : "msg-wrapper";
        avatar.src = data.user.avatar;
        avatar.alt = data.user.name + "`s avatar";
        avatar.width = "50";
        avatar.height = "50";
        wrapperInner.className = "msg-text";
        username.className = "msg-author";
        username.textContent = data.user.name;
        object.className = "msg object-class";
        object.data = data.file.view;
        link.href = data.file.download;
        img.src = "./img/download.png";
        img.alt = "download icon";
        img.width = "25";
        time.className = "time";
        time.textContent = data.date;

        wrapper.appendChild(avatar);
        wrapper.appendChild(wrapperInner);
        wrapperInner.appendChild(username);
        wrapperInner.appendChild(object);
        wrapperInner.appendChild(link);
        wrapperInner.appendChild(time);
        link.appendChild(img);

        elChatMain.appendChild(wrapper);
      }

      if (data.message.trim() != "") {
        let wrapperMsg = document.createElement("div");
        let avatarMsg = document.createElement("img");
        let wrapperInnerMsg = document.createElement("div");
        let usernameMsg = document.createElement("p");
        let messageMsg = document.createElement("p");
        let timeMsg = document.createElement("p");

        wrapperMsg.className =
          userId == data.user.userId ? "msg-wrapper msg-from" : "msg-wrapper";
        avatarMsg.src = data.user.avatar;
        avatarMsg.alt = data.user.name + "`s avatar";
        avatarMsg.width = "50";
        avatarMsg.height = "50";
        wrapperInnerMsg.className = "msg-text";
        usernameMsg.className = "msg-author";
        usernameMsg.textContent = data.user.name;
        messageMsg.className = "msg";
        messageMsg.textContent = data.message;
        timeMsg.className = "time";
        timeMsg.textContent = data.date;

        wrapperMsg.appendChild(avatarMsg);
        wrapperMsg.appendChild(wrapperInnerMsg);
        wrapperInnerMsg.appendChild(usernameMsg);
        wrapperInnerMsg.appendChild(messageMsg);
        wrapperInnerMsg.appendChild(timeMsg);

        elChatMain.appendChild(wrapperMsg);
      }
    });
  }
});
