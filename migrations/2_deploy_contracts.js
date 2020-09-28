const CrossbarToken = artifacts.require("CrossbarToken");
const CrossbarTokenSale = artifacts.require("CrossbarTokenSale");
const BN = web3.utils.BN;

module.exports = async function (deployer) {
  await deployer.deploy(CrossbarToken, 1000000);
  price = new BN('10000000000000000');
  await deployer.deploy(CrossbarTokenSale, CrossbarToken.address, price);
  let instance = await CrossbarToken.deployed();
  await instance.transfer(CrossbarTokenSale.address, 750000);
  // deployer.deploy(CrossbarToken, 1000000).then(() => {

  //   return deployer.deploy(CrossbarTokenSale, CrossbarToken.address, price);
  // })
};
