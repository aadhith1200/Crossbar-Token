var expect = require('chai').expect;
CrossbarToken = artifacts.require("./CrossbarToken.sol");

contract("CrossbarToken", (accounts) => {

    it("preliminary testing", async () => {
        let tokenInstance = await CrossbarToken.deployed();
        totalSupply = await tokenInstance.totalSupply();
        name = await tokenInstance.name();
        symbol = await tokenInstance.symbol();
        expect(name).to.be.equal("CrossbarToken");
        expect(symbol).to.be.equal("CBR");
        expect(totalSupply.toNumber()).to.be.equal(1000000);
    })

    it("transfer function works", async () => {
        let tokenInstance = await CrossbarToken.deployed();
        receipt = await tokenInstance.transfer(accounts[1], 10000, { from: accounts[0] });
        acc1bal = await tokenInstance.balanceOf(accounts[1]);
        acc0bal = await tokenInstance.balanceOf(accounts[0]);
        expect(acc1bal.toNumber()).to.be.equal(10000);
        expect(receipt.logs[0].args._from).to.be.equal(accounts[0]);
        expect(receipt.logs[0].args._to).to.be.equal(accounts[1]);
        expect(receipt.logs[0].args._value.toNumber()).to.be.equal(10000);
    })

    it("approve function works", async () => {
        let tokenInstance = await CrossbarToken.deployed();
        receipt = await tokenInstance.approve(accounts[1], 10000, { from: accounts[0] });
        allowance = await tokenInstance.allowance(accounts[0], accounts[1]);
        expect(allowance.toNumber()).to.be.equal(10000);
        expect(receipt.logs[0].args._owner).to.be.equal(accounts[0]);
        expect(receipt.logs[0].args._spender).to.be.equal(accounts[1]);
        expect(receipt.logs[0].args._value.toNumber()).to.be.equal(10000);
    })

    it("transferFrom function works", async () => {
        let tokenInstance = await CrossbarToken.deployed();
        //err = await tokenInstance.transferFrom(accounts[0], accounts[2], 20000, { from: accounts[1] });
        receipt = await tokenInstance.transferFrom(accounts[0], accounts[2], 100, { from: accounts[1] });
        acc2bal = await tokenInstance.balanceOf(accounts[2]);
        expect(acc2bal.toNumber()).to.be.equal(100);
        expect(receipt.logs[0].args._from).to.be.equal(accounts[0]);
        expect(receipt.logs[0].args._to).to.be.equal(accounts[2]);
        expect(receipt.logs[0].args._value.toNumber()).to.be.equal(100);
    })
})

