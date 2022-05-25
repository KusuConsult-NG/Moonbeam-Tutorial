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
const contractAddress = 'Contract Addr';
// Send Function
// Create Contract Instance
const token = new web3.eth.Contract(abi, contractAddress);
// Build Increment Tx
const tokenTx = token.methods.mint(0x2871C6dE7A339a359Ed552C9c91f1A71692B7804, 600000000000000000);
// const retrieveTX = storage.methods.retrieve();
const mint = async () => {
   console.log( `
   Calling the store function in contract at
   address: ${contractAddress}
  `);
   // Sign Tx with PK
 const createTransaction = await web3.eth.accounts.signTransaction({
    to: contractAddress,
    data: tokenTx.encodeABI(),
    gas: await tokenTx.estimateGas(),
    }, account_from.privateKey );
  // Send Tx and Wait for Receipt
  const createReceipt = await web3.eth.sendSignedTransaction(
   createTransaction.rawTransaction
  );
  console.log(`
     Tx successful with hash: ${createReceipt.transactionHash}
  `);
};
mint();
