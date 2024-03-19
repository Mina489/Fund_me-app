const {ethers} = require('hardhat')

const provider=new ethers.Providers.WebProvider(window.ethereum)
let signer
const tokenabi=[]
const tokenAddress=''
let tokenContract=null
const dexAbi=[]
const dexAddress=''
let dexContract=null
async function getAccess() {
    if (tokenContract) return
    await provider.send('eth_requestAccounts',[])
    signer=provider.getSigner()
    tokenContract=new ethers.Contract(tokenAddress,tokenabi,signer)
    dexContract=new ethers.Contract(dexAddress,dexAbi,signer)
}

async function getPrice() {
    await getAccess()
    const price= await dexContract.getPrice(1)
    document.getElementById('tokenPrice').innerHTML=price
    return price
}


async function getTokenBalance() {
    await getAccess()
    const TokenBalance= await tokenContract.balanceOf(await signer.getAddress())
    document.getElementById('tokensBalance').innerHTML=TokenBalance
    return TokenBalance
}

async function getavailabletokens() {
    await getAccess()
    const availabletokens= await dexContract.getTokenBalance()
    document.getElementById('tokenavailable').innerHTML=availabletokens
    return availabletokens
}


async function grantAccess() {
    await getAccess()
    const value=document.getElementById('tokenGrant').value
    await tokenContract.approve(dexAddress,value).then(() => alert('success')).catch((error) => alert(error))
}

async function sell() {
    await getAccess()
    await dexContract.sell().then(() => alert('success')).catch((error) => alert(error))
}

async function buy() {
    await getAccess()
    const tokenAmount = document.getElementById('tokensToBuy').value
    const value=(await getPrice()) * tokenAmount
    await dexContract.buy(tokenAmount,{value:value}).then(() => alert('success')).catch((error) => alert(error))
}
