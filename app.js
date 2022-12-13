"use strict";

const btn = document.getElementById("btn");

btn.addEventListener("click", function () {
  const inputString = document.getElementById("txnId").value;
  parseTxn(inputString).then((data) => {
    const mintAcc = data.events.nft.nfts[0].mint;
    const saleAmt = data.events.nft.amount;
    console.log(saleAmt);
    console.log(data);
    console.log(data.description);
    let arr = [];
    arr.push(data);
    console.log(arr);
    let tableData = "";
    arr.map((values) => {
      console.log(values);
      tableData = `
      <p>Description: ${values.description}</p>
      <p>Type: ${values.type}</p>
      <p>Sale Amount: ${values.events.nft.amount}</p>
      <p>Seller: ${values.events.nft.seller}</p>
      <p>Mint: ${values.events.nft.nfts[0].mint}</p>
      `;
    });
    document.getElementById("nft__container").innerHTML = tableData;

    const nftAddresses = [mintAcc];
    console.log(nftAddresses); // Monkes
    const getMetadata = async (mintaddress) => {
      const { data } = await axios.post(
        `https://api.helius.xyz/v0/tokens/metadata?api-key=${apiKey}`,
        { mintAccounts: nftAddresses }
      );
      console.log(data);
      console.log(
        `Royalty Fee: ${data[0].onChainData.data.sellerFeeBasisPoints}`
      );
      const creators = data[0].onChainData.data.creators;
      const creatorsArr = [];
      for (let i = 0; i < creators.length; i++) {
        creatorsArr.push(creators[i]);
      }
    };

    getMetadata();
  });
});

const apiKey = "2865692e-2c75-42e5-ba5a-4fa45f213a41";
async function parseTxn(txnStr) {
  const { data } = await axios.post(
    `https://api.helius.xyz/v0/transactions/?api-key=${apiKey}`,
    {
      transactions: [txnStr],
    }
  );
  return data[0];
}

const nftAddresses = [
  "BAAzgRGWY2v5AJBNZNFd2abiRXAUo56UxywKEjoCZW2",
  "8s6kQUZfdm7GSaThAcsmSs56wMinXrbk6SdNVngutrz5",
]; // Monkes
const getMetadata = async (mintaddress) => {
  const { data } = await axios.post(
    `https://api.helius.xyz/v0/tokens/metadata?api-key=${apiKey}`,
    { mintAccounts: nftAddresses }
  );
  console.log("metadata: ", data);
};
getMetadata();
