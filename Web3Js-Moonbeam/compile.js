const fs = require('fs');
const solc = require('solc');
// Get Path and Load Contract
// const source = fs.readFileSync('storage.sol', 'utf8');
const source = fs.readFileSync('token.sol', 'utf8');

// Compile Contract
const input = {
    language: 'Solidity',
    sources: { 'token.sol': { content: source, }, },
    settings: { outputSelection: { '*': { '*': ['*'], }, }, },
 };
const tempFile = JSON.parse(solc.compile(JSON.stringify(input)));
const contractFile = tempFile.contracts['token.sol']['Token'];
// Export Contract Data
module.exports = contractFile;
