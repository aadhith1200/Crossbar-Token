CrossbarTokenSale = artifacts.require("./CrossbarTokenSale.sol");
CrossbarToken = artifacts.require("./CrossbarToken.sol");
let chai = require("chai");
const BN = web3.utils.BN;
const chai_bn = require("chai-bn")(BN);
chai.use(chai_bn);
const chai_promise = require("chai-as-promised");
chai.use(chai_promise);
const expect = chai.expect;

contract("CrossbarTokenSale", (accounts) => {

    it("preliminary tests", async () => {
        instance = await CrossbarTokenSale.deployed();
        price = await instance.price();
        bn_price = new BN('10000000000000000')
        expect(price).to.be.a.bignumber.equal(bn_price)
    })

    it("buy token works", async () => {
        tokenInstance = await CrossbarToken.deployed();
        tokenSaleInstance = await CrossbarTokenSale.deployed();
        let admin = accounts[0];
        price = new BN('10000000000000000');
        // await tokenInstance.transfer(tokenSaleInstance.address, 750000, { from: admin });
        // tokensInTokenSale = new BN(750000);
        // expect(tokenInstance.balanceOf(tokenSaleInstance.address)).to.eventually.be.a.bignumber.equal(tokensInTokenSale);
        receipt = await tokenSaleInstance.buyTokens(1, { from: accounts[1], value: price });
        expect(receipt.logs[0].args.buyer).to.be.equal(accounts[1]);
        expect(receipt.logs[0].args.value.toNumber()).to.be.equal(1);
        tokensBought = await tokenInstance.balanceOf(accounts[1]);
        // err = await tokenSaleInstance.buyTokens(900000, { from: accounts[1], value: 1 });
    })

    it("end Sale works", async () => {
        instance = await CrossbarTokenSale.deployed();
        tokenInstance = await CrossbarToken.deployed();
        //reverts endSale
        //await instance.endSale({ from: accounts[1] });
        await instance.endSale();
        tokensInTokenSale = await tokenInstance.balanceOf(instance.address);
        expect(tokensInTokenSale.toNumber()).to.be.equal(0);
        //sold = new BN(0);
        //expect(instance.tokensSold).to.eventually.be.a.bignumber.equal(sold);


    })
})