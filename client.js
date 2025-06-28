const net = require('net');

//creating a new connection socket
const client = new net.Socket();
const HOST = '196.42.66.161';
const PORT = 3003;

client.connect(PORT, HOST, () =>{
    console.log('Connected to server');

    
  
    const sendWallet = "$ilp.interledger-test.dev/thimzar";
    const receiverWallet = "$ilp.interledger-test.dev/thimusd";
    const amountMoney = "300";
})