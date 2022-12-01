
const username = prompt('What is your user name ')
const socket = io('http://localhost:3001',{
    query :{
        username 
    }
})
let nsSocket = ''
// const socket1 = io('http://localhost:3001/wiki')
// const socket2 = io('http://localhost:3001/mozilla')
// const socket3 = io('http://localhost:3001/linux')


socket.on('nsList',(nsData)=>{

    let namespaceDiv = document.querySelector('.namespaces');
    namespaceDiv.innerHTML =''
    nsData.forEach((ns)=>{
        namespaceDiv.innerHTML += `<div class='namespace' ns=${ns.endPoint}><img src ="${ns.img}" /> </div>`
    })
 
    Array.from(document.getElementsByClassName('namespace')).forEach((elem)=>{
        elem.addEventListener('click' ,(e)=>{
         const nsEndPoint = elem.getAttribute('ns');
         joinNs(nsEndPoint);
        })
    })
    
    
    
   
})





 