"use strict";

const btn = document.getElementById("btn");

btn.addEventListener("click", function () {
  const inputString = document.getElementById("txnId").value;
  parseTxn(inputString).then((data) => {
    const mintAcc = data.events.nft.nfts[0].mint;
    const saleAmt = data.events.nft.amount;
    const nativeTrf = data.nativeTransfers;
  
    let arr = [];
    arr.push(data);

    let tableData = "";
    arr.map((values) => {
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

    const getMetadata = async (mintaddress) => {
      const { data } = await axios.post(
        `https://api.helius.xyz/v0/tokens/metadata?api-key=${apiKey}`,
        { mintAccounts: mintaddress }
      );
      console.log(data);
      let newTable = "";
      data.map((values) => {
        console.log(values);
        newTable = `
      <p>Royalty Fee: ${values.onChainData.data.sellerFeeBasisPoints}</p>
      `;
      });
      document.getElementById("nft__container2").innerHTML = newTable;
      console.log(
        `Royalty Fee: ${data[0].onChainData.data.sellerFeeBasisPoints}`
      );

      const creators = data[0].onChainData.data.creators;
      let thirdtableData = "";
      for (const creator of creators) {
        if (creator.share > 0) {
          console.log(`Checking paymentsfor creator ${creator.address}`);
          const royalitypayment = nativeTrf.filter(
            (trf) => trf.toUserAccount === creator.address
          );
          console.log(royalitypayment);
          thirdtableData = `
              <p>Checking paymentsfor creator ${creator.address}</p>
            `;

          if (royalitypayment.length > 0) {
            const payentAmt = royalitypayment[0].amount;
            console.log(`${payentAmt}was paid to ${creator.address}`);
          } else {
            console.log(`Royalties not paid to ${creator.address}`);
            thirdtableData += `<p>Royalties not paid to ${creator.address}</p>`;
          }
        }
      }
      document.getElementById("nft__container3").innerHTML = thirdtableData;
    };

    getMetadata(nftAddresses);
  });
});

const apiKey = //ENTER YOUR API KEY HERE//;
  async function parseTxn(txnStr) {
    const { data } = await axios.post(
      `https://api.helius.xyz/v0/transactions/?api-key=${apiKey}`,
      {
        transactions: [txnStr],
      }
    );
    return data[0];
  };


const getMetadata = async (mintaddress) => {
  const { data } = await axios.post(
    `https://api.helius.xyz/v0/tokens/metadata?api-key=${apiKey}`,
    { mintAccounts: nftAddresses }
  );
  console.log("metadata: ", data);
};
