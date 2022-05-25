import Web3 from "web3"
import ContractABI from ../contract/ContractABI.abi.json
let contract
let candidate = []

const ContractAddress = "0x63d7F6d2712772D85d54e84F28AE774D14EcE28e"

const connectWallet = async () => {
  if(window.ethereum){
    web3 = new Web3(window.ethereum);

    try {
      window.ethereum.enable()
      contract = new web3.eth.Contract(ContractABI, ContractAddress)
    } catch(error) {
      console.log(error);
    }
  } else {
    alert("You have to install MetaMask");
  }
}

const getCandidates = async function() {
  const _count = await contract.methods.getCandidateCount().call()

  const _candidates = []

  for(let i=0; i < _count; i++){
    let _candidate = new Promise(async (resolve, reject) => {
      let p = await contract.methods.displayCandidates(i).call()
      resolve({
        index:i,
        name:p[1],
        image:p[2],
        voteCount:p[3]
      })
    })
    _candidates.push(_candidate)
  }
  candidates = await Promise.all(_candidates)
  renderCandidates()
}


document.querySelector("#addCand").addEventListener("click", async(e) => {
  try {
    const accounts = await window.ethereum.enable();
    const account = accounts[0]

    const params = [
      document.getElementById("candidateName").value,
      document.getElementById("candidateImage").value
    ]

    const result = await contract.methods.addCandidate(...params).send({ from: account})
  } catch(error){
    console.log(error);
  }

  getCandidates()

});


const getBalance = async function () {
  const accounts = await window.ethereum.enable();
    const account = accounts[0];
  const balance = await web3.eth.getBalance(account)

  document.querySelector("#balance").textContent = balance
}

function renderCandidates() {
  document.getElementById("main").innerHTML = ""
  candidates.forEach((_candidate) => {
    const newDiv = document.createElement("div")
    newDiv.className = "col-md-4"
    newDiv.innerHTML = candidateTemplate(_candidate)
    document.getElementById("main").appendChild(newDiv)
  })
}

function candidateTemplate(_candidate){
  return`
  <div class="card mb-4">
    <img class="card-img-top" src="${_candidate.image}" alt="...">
    <div class="card-body text-left p-4 position-relative">

      <h2 class="card-title fs-4 fw-bold mt-2">${_candidate.name} ${_candidate.voteCount}</h2>

    </div>
    <div class="d-grid gap-2">
      <a class="btn btn-lg btn-outline-dark voteBtn fs-6 p-3" id=${
        _candidate.index
      }>
        VOTE
      </a>
    </div>
  </div>
  `
}

document.querySelector("#main").addEventListener("click", async (e) => {
  if (e.target.className.includes("voteBtn")){
    const index = e.target.id
    try {
      const accounts = await window.ethereum.enable();
      const account = accounts[0];

      await contract.methods.castVote(index).send({from:account})
    }catch(error){
      console.log(error);
    }
  }
})

window.addEventListener("load", () => {
  connectWallet()
  alert("Connected")
  getBalance()
  getCandidates()
})








//
