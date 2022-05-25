// document.querySelector("#clicked").addEventListener("click", function(){alert("Clicked")})
import Web3 from "web3"
import ContractABI  from "../contract/ContractABI.abi.json"

let contract
let tasks = []
const ContractAddress = "0x40d0a5E102ab4417b547DdDe3Eb9A7819B077B21"
const connectWallet = async () => {

  if (window.ethereum) {
     web3 = new Web3(window.ethereum);
     try {
        window.ethereum.enable()

           contract = new web3.eth.Contract(ContractABI, ContractAddress)
     } catch(error) {
       notification(`⚠️ ${error}.`)
     }
  }
  else {
      notification('You have to install MetaMask !');
  }
}


const getItems = async function() {
  const _count = await contract.methods.getCount().call()
  const _tasks = []

  for (let i = 1; i < _count; i++) {
      let _task = new Promise(async (resolve, reject) => {
        let p = await contract.methods.viewTasks(i).call()
        resolve({
          index: i,
          content: p
        })
      })
      _tasks.push(_task)
    }
  tasks = await Promise.all(_tasks)
  renderTasks()
}

function notification(_text) {
  document.querySelector(".alert").style.display = "block"
  document.querySelector("#notification").textContent = _text
}
function notificationOff() {
  document.querySelector(".alert").style.display = "none"
}

window.addEventListener("load", () => {
  notification("⌛ Loading...")
  connectWallet()
  getItems()
  notificationOff()
})

document.querySelector("#addTask").addEventListener("click", async (e) => {
  try{
    const accounts = await window.ethereum.enable();
    const account = accounts[0];
    const newT = document.getElementById("newTask").value;

    const result = await contract.methods
      .createTask(newT)
      .send({ from: account});
    console.log(result);
  } catch(error) {
    notification(`⚠️ ${error}.`)
  }
  getItems()

});

function renderTasks() {
  document.getElementById("items").innerHTML = ""
  tasks.forEach((_task) => {
    const newDiv = document.createElement("ul")
    newDiv.innerHTML = itemTemplate(_task)
    document.getElementById("items").appendChild(newDiv)
  })
}

function itemTemplate(_task){
  return`
    <li>${_task.content}</li>
  `
}
