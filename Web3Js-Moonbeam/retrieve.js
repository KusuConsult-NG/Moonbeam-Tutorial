const Web3 = require('web3');
const { abi } = require('./compile');
//Define Provider & Variables
// Provider
const providerRPC = {
   development: 'http://localhost:9933',
   moonbase: 'https://rpc.testnet.moonbeam.network',
};
const web3 = new Web3(providerRPC.development); //Change to correct network


// Variables
const account_from = {
   privateKey: '0x5fb92d6e98884f76de468fa3f6278f8807c48bebc13595d45af5bdc4da702133',
};
const contractAddress = '0xc01Ee7f10EA4aF4673cFff62710E1D7792aBa8f3';


//call Function
const storage = new web3.eth.Contract(abi, contractAddress);

const retrieveTX = storage.methods.retrieve();


const retrieve = async () => {
   console.log(
      `Calling the reset function in contract at address: ${contractAddress}`
   );

   // Sign Tx with PK
   const createTransaction = await web3.eth.accounts.signTransaction(
      {
         to: contractAddress,
         data: retrieveTX.encodeABI(),
         gas: await retrieveTX.estimateGas(),
      },
      account_from.privateKey
   );

   // Send Tx and Wait for Receipt
   const createReceipt = await web3.eth.sendSignedTransaction(
      createTransaction.rawTransaction
   );
   console.log(`Tx successful with hash: ${createReceipt.transactionHash}`);

   const num = await storage.methods.retrieve().call();
   console.log(`The current number stored is: ${num}`);
};

retrieve();
