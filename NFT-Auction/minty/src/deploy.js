const fs = require("fs/promises");
const { F_OK } = require("fs");

const inquirer = require("inquirer");
const { BigNumber } = require("ethers");
const config = require("getconfig");

const CONTRACT_NAME = "Minty";

async function deployContract(name, symbol) {
  const hardhat = require("hardhat");
  const network = hardhat.network.name;

  const Minty = await hardhat.ethers.getContractFactory(CONTRACT_NAME);
  const minty = await Minty.deploy(name, symbol);

  const Auction = await hardhat.ethers.getContractFactory("Auction");
  const auction = await Auction.deploy();

  await minty.deployed();
  await auction.deployed();

  await writeDeploymentInfo(auction, "auction.json");
  return deploymentInfo(hardhat, minty);
}

async function writeDeploymentInfo(contract, filename = "") {
  const data = {
    contract: {
      address: contract.address,
      signerAddress: contract.signer.address,
      abi: contract.interface.format(),
    },
  };
  
  const content = JSON.stringify(data, null, 2);
  await fs.writeFile(filename, content, { encoding: "utf-8" });
}

function deploymentInfo(hardhat, minty) {
  return {
    network: hardhat.network.name,
    contract: {
      name: CONTRACT_NAME,
      address: minty.address,
      signerAddress: minty.signer.address,
      abi: minty.interface.format(),
    },
  };
}






