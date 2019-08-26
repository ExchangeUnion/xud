var password = "";
var account = personal.newAccount(password);
miner.setEtherbase(account)
miner.start(500);
console.log("account:", account.slice(2));
