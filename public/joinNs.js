async function joinNs(endPoint) {
  console.log(nsSocket, "<<><<");
  if (nsSocket) {
    //check its actual a socket
    // console.log(nsSocket ,"<<>111<<")
    nsSocket.close();
    //remove event listener before it added again
    document
      .querySelector("#user-input")
      .removeEventListener("submit", formSubmit);
  }
  nsSocket = await io(`http://localhost:3001${endPoint}`);

  nsSocket.on("nsRoomLoad", (nsRooms) => {
    let roomList = document.querySelector(".room-list");
    roomList.innerHTML = "";
    nsRooms.forEach((room) => {
      let glyph;
      if (room.privateRoom) {
        glyph = "lock";
      } else {
        glyph = "globe";
      }
      roomList.innerHTML += `<li class='room' > 
            <span class="glyphicon glyphicon-${glyph}" ></span> ${room.roomTitle} </li>`;
    });

    let roomNodes = document.getElementsByClassName("room");
    Array.from(roomNodes).forEach((elem) => {
      elem.addEventListener("click", (e) => {
        joinRoom(elem.innerText);
      });
    });
  });

  document
    .querySelector(".message-form")
    .addEventListener("submit", formSubmit);

  nsSocket.on("messageToClients", (msg) => {
    console.log(msg);
    document.querySelector("#messages").innerHTML += buildHtml(msg);
  });

  function formSubmit(event) {
    event.preventDefault();
    const newMessage = document.querySelector("#user-message").value;
    // console.log(newMessage)
    nsSocket.emit("newMessageToServer", { text: newMessage, endPoint });
  }
}

function buildHtml(msg) {
  // console.log(msg)
  const convertedTime = new Date(msg.time).toLocaleString();
  const newhtml = `<li>
    <div class="user-image">
       <img src =${msg.avatar} />
    </div>
    <div class="user-message">
        <div class="user-name-time">${msg.username} <span>${convertedTime}</span></div>
        <div class="message-text">${msg.text}</div>
    </div>
</li>`;

  return newhtml;
}

// module.exports= joinNs;
