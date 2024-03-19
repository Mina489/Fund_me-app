const provider=new ethers.providers.Web3Provider(window.ethereum)
let signer
const tokenAbi = [
    "constructor(uint256 initialSupply)",
    "event Approval(address indexed owner, address indexed spender, uint256 value)",
    "event Transfer(address indexed from, address indexed to, uint256 value)",
    "function allowance(address owner, address spender) view returns (uint256)",
    "function approve(address spender, uint256 amount) returns (bool)",
    "function balanceOf(address account) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function decreaseAllowance(address spender, uint256 subtractedValue) returns (bool)",
    "function increaseAllowance(address spender, uint256 addedValue) returns (bool)",
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function tokenByIndex(uint256 index) view returns (uint256)",
    "function totalSupply() view returns (uint256)",
    "function transfer(address to, uint256 amount) returns (bool)",
    "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  ];
const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
let tokenContract = null;

async function getAccess() {
    if (tokenContract) return;
    await provider.send('eth_requestAccounts',[])
    signer=provider.getSigner()
    tokenContract=new ethers.Contract(tokenAddress,tokenAbi,signer)
}
async function getALLNFTS(){
    await getAccess()
    const numNFTS=await tokenContract.balanceof(await signer.getAddress())
    document.getElementById('numNFTS').innerHTML=numNFTS
    const nfts=[]
    const promises=[]
    for (let idx=0;idx <numNFTS;idx++){
        const promise=tokenContract.tokenByindex(idx).then((nftId) => {
        const id = nftId.toNumber()
        return tokenContract.tokenURI(id).then((uri) => nfts.push(uri))
        })
        promises.push(promise)
    }
    await Promise.all(promises)
    promises=[]
    for (const nft of nfts) {
        const link=getUrl(nft)
        const json=await fetch(link)
        const promise=fetch(link).then((data) => data.json()).then((json) => console.log(json))
        promises.push(promise)
    }
    await Promise.all(promises)
}
function getUrl(ipfs){
    return 'http://localhost:8080/ipfs' + ipfs.split(':').slice(1)
}