const { expect } = require("chai");
const { ethers } = require("hardhat");

describe ('Token', () =>{
    let totalsupply='100'
    let Token
    let owner
    let addr1
    let addr2
    beforeEach(async() =>{
        [owner,addr1,addr2]=await ethers.getSigners()
        const Token=await ethers.getContractFactory('Token')
        token=await Token.deploy(totalsupply)

    })
    describe('Deployment',()=>{
        it('should assign total supply of tokens to the owner/deployer',async () =>{
            const ownerbalance=await token.balanceof(owner.address)
            expect(ownerbalance).equal.to(totalsupply)
        })
    })
    describe('Transactions',()=>{
        it('should transfer tokens between accounts',async () =>{
            await token.transfer(addr1.address,50)
            const addr1Balance=await token.balanceof(addr1.address)
            expect(addr1Balance).to.equal(50)
            
        })
        it('should transfer tokens between accounts',async () =>{
            await excpect(token.connect(addr1).transfer(addr2.address,51)).to.be.reverted
            
        })
    })
})