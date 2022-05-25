import Web3 from "web3"
import ContractABI from "../contract/ContractABI.abi.json"

let contract
let posts = []

const contractAddress = "0xCB6BD76Ab649B8271543d534Dcdf2c5A0f7F9275"

const connectWallet = async () => {
  if(window.ethereum) {
    web3 = new Web3(window.ethereum);

    try {
      window.ethereum.enable()
      contract = new web3.eth.Contract(ContractABI, contractAddress)
    } catch(error) {
      notification(`⚠️ ${error}.`)
    }
  }
  else {
    notification("You have to install Metamask!")
  }
}

const getPosts = async function() {
  const _count = await contract.methods.getPostCount().call()
  const _posts = []

  for(let i=1; i < _count; i++){
    let _post = new Promise(async (resolve, reject) => {
      let p = await contract.methods.displayPost(i).call()
      resolve({
        index:i,
        author:p[0],
        title:p[1],
        content:p[2]
      })
    })
    _posts.push(_post)
    }
  posts = await Promise.all(_posts)
  renderPosts()
}

function notification(_text) {
  document.querySelector(".alert").style.display = "block"
  document.querySelector("#notification").textContent = _text
}
function notificationOff() {
  document.querySelector(".alert").style.display = "none"
}

document.querySelector("#addPost").addEventListener("click", async (e) => {
  try {
    const accounts = await window.ethereum.enable();
    const account = accounts[0]

    const params = [
      document.getElementById("author").value,
      document.getElementById("title").value,
      document.getElementById("content").value
    ]
    notification("⌛ Creating Post...")

    const result = await contract.methods.createPost(...params).send({ from: account});
  } catch(error) {
    notification(`⚠️ ${error}.`)
  }
  getPosts()
})

function renderPosts() {
  document.getElementById("posts").innerHTML = ""
  posts.forEach((_post) => {
    const newDiv = document.createElement("div")
    newDiv.innerHTML = itemTemplate(_post)
    document.getElementById("posts").appendChild(newDiv)
  })
}

function itemTemplate(_post) {
  return`
    <h1>${_post.title}</h1>
    <h3>${_post.author}</h3>
    <p>${_post.content}</p>
  `
}

window.addEventListener("load", () => {
  notification("⌛ Loading...")
  connectWallet()
  getPosts()
  notificationOff()
})
