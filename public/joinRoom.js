function joinRoom(roomName) {
  nsSocket.emit("joinRoom", roomName);

  nsSocket.on("roomHistory", (historyData) => {
    console.log(historyData);

    const messageUl = document.querySelector("#messages");
    messageUl.innerHTML = "";
    historyData.forEach((msg) => {
      const newMsg = buildHtml(msg);
      const currentMessages = messageUl.innerHTML;
      messageUl.innerHTML = currentMessages + newMsg;
    });
    messageUl.scrollTo(0, messageUl.scrollHeight);
  });


  nsSocket.on("updatedNumberOfUser", (numberOfUser) => {
    console.log(numberOfUser)
    document.querySelector(
      ".curr-room-num-users"
    ).innerHTML = `${numberOfUser.size} <span class="glyphicon glyphicon-user" > </span>`;
    document.querySelector(
        ".curr-room-text"
      ).innerText = `${roomName}`;
  });


  let searchBox= document.querySelector('#search-box');

  searchBox.addEventListener('input',(e)=>{
      
      let messages = Array.from(document.getElementsByClassName("message-text"))
      
      console.log(messages)
    messages.forEach((msg)=>{
        console.log(msg)
        if(msg.innerText.toLowerCase().indexOf(e.target.value) === -1){
            msg.getElementsByClassName.display = "none"
        }else{
            msg.style.display ="block"
        }
    })
  })
}
