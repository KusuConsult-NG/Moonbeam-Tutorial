const Web3 = require('web3');
const contractFile = require('./compile');
// Define Provider & Variables
// Provider
const providerRPC = {
     development: 'http://localhost:9933',
     moonbase: 'https://rpc.testnet.moonbeam.network',
};
//Change to correct network
const web3 = new Web3(providerRPC.development);
// Variables
const account_from = {
     privateKey: '0x5fb92d6e98884f76de468fa3f6278f8807c48bebc13595d45af5bdc4da702133',
     address: '0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac',
 };
const bytecode = contractFile.evm.bytecode.object;
const abi = contractFile.abi;
//Deploy Contract
const deploy = async () => {
 console.log(`
   Attempting to deploy from account ${account_from.address}
 `);
// Create Contract Instance
  const myToken = new web3.eth.Contract(abi);
// Create Constructor Tx
   const myTokenTx = myToken.deploy({
   data: bytecode,
   });
// Sign Transacation and Send
   const createTransaction = await
      web3.eth.accounts.signTransaction({
       data: myTokenTx.encodeABI(),
       gas: await myTokenTx.estimateGas(),
       },
      account_from.privateKey
     );
// Send Tx and Wait for Receipt
   const createReceipt = await web3.eth.sendSignedTransaction(
    createTransaction.rawTransaction
    );
console.log(
    `Contract deployed at address: ${createReceipt.contractAddress}`
   );
};
deploy();
