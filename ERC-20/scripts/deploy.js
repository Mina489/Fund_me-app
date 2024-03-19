const hre = require("hardhat");

async function main() {
  const Token = await hre.ethers.getContractFactory("Token");
  const token = await Token.deploy("100");

  const DEX = await hre.ethers.getContractFactory("DEX");
  const dex = await DEX.deploy(token.address, 100);

  await token.deployed();
  await dex.deployed();
  await writeDeploymentInfo(token, "token.json");
  await writeDeploymentInfo(dex, "dex.json");
}


async function writeDeploymentInfo(contract, filename = "") {
  const data = {
    network: hre.network.name,
    contract: {
      address: contract.address,
      signerAddress: contract.signer.address,
      abi: contract.interface.format(),
    },
  };

  const content = JSON.stringify(data, null, 2);
  await fs.writeFile(filename, content, { encoding: "utf-8" });
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
