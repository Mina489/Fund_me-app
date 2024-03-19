const { expect } = require("chai");
const { ethers } = require("hardhat");

describe ('Token', () =>{
    let totalsupply='100'
    let Token
    let Price=100
    let owner
    let addr1
    let addr2
    beforeEach(async() =>{
        [owner,addr1,addr2]=await ethers.getSigners()
        const Token=await ethers.getContractFactory('Token')
        token=await Token.deploy(totalsupply)
        const DEX=await ethers.getContractFactory('DEX')
        dex=await DEX.deploy(Token.address,Price)
    })
    describe('Deployment',()=>{
        it('should assign total supply of tokens to the owner/deployer',async () =>{
            const ownerbalance=await token.balanceof(owner.address)
            expect(ownerbalance).equal.to(totalsupply)
        })
        
    })
    describe('sell',()=>{
        it('should fail if contract is not approved',async () =>{
            await expect(dex.sell()).to.be.reverted
        })
        it('should allow dex to transfer tokens',async () =>{
            await token.approve(dex.address,100)
        })
        it('it shouldnot allow non-user to call sell()',async () =>{
            await expect(dex.connect(addr1).sell()).to.be.reverted;
        })
        it('sell should transfer tokens from owner to contract',async () =>{
            await expect(dex.sell()).to.changeTokenBalance(
                token,
                [owner.address,dex.address],
                [-100,100],
            )
        })
    })
    describe('Getters',()=>{
        it('should return correct token balance',async () =>{
            expect(await dex.getTokenBalance()).to.equal(100)
        })
        it('should return correct token balance',async () =>{
            expect(await dex.getPrice(10)).to.equal(Price * 10)
        })
    })
    describe('BUY',()=>{
        it('User can buy tokens',async () =>{
            await expect(dex.connect(addr1).buy(10,{value:10000})).to.changeTokenBalances(token,[dex.address,addr1.address],[10,-10])
        })
        it('it cannot buy invalid number of tokens',async () =>{
            await expect(dex.connect(addr1).buy(5,{value:510})).to.be.reverted
        })
    })
    describe('withdraw tokens',()=>{
        it('non owner cannot withdraw tokens',async () =>{
            await expect(dex.withdrawTokens()).to.changeTokenBalances(token,[dex.address,owner.address],[-90,90])
        })
    })
    describe('withdraw tokens',()=>{
        it('owner can withdraw token procceed',async () =>{
            await expect(dex.withdrawFunds()).to.changeEtherBalances([owner.address,dex.address],[1000,-1000])
        })
        it('Non-owner cannot withdraw token proceeds',async () =>{
            await expect(dex.connect(addr1)).to.reverted
        })
    })
})