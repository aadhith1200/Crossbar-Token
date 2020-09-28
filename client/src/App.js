import React, { Component } from "react";
import getWeb3 from "./getWeb3";
import CrossbarToken from "./contracts/CrossbarToken.json";
import CrossbarTokenSale from "./contracts/CrossbarTokenSale.json";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css"
import Form from "react-bootstrap/Form"
import Col from "react-bootstrap/Col"

class App extends Component {
  state = { web3: null, accounts: null, contract: null, noOfTokens: 0, tokensSold: 1, tokenPrice: 0, userTokens: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = CrossbarTokenSale.networks[networkId];
      this.tokenSaleInstance = new web3.eth.Contract(
        CrossbarTokenSale.abi,
        deployedNetwork && deployedNetwork.address,
      );

      this.tokenInstance = new web3.eth.Contract(
        CrossbarToken.abi,
        CrossbarToken.networks[networkId] && CrossbarToken.networks[networkId].address
      );

      const _tokensSold = await this.tokenSaleInstance.methods.tokensSold().call();
      const _tokenPrice = await this.tokenSaleInstance.methods.price().call();
      const _userTokens = await this.tokenInstance.methods.balanceOf(accounts[0]).call();

      this.handleSoldEvent();
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: this.tokenSaleInstance, tokensSold: _tokensSold, tokenPrice: _tokenPrice, userTokens: _userTokens });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  handleChange = async (event) => {
    //console.log(event.target.value);
    this.setState({
      noOfTokens: event.target.value
    })
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    if (this.state.noOfTokens <= 0) {
      alert("No of tokens bought should be greater than 0");
    }
    else {
      let receipt = await this.tokenSaleInstance.methods.buyTokens(this.state.noOfTokens).send({ from: this.state.accounts[0], value: this.state.tokenPrice * this.state.noOfTokens })
      console.log(receipt);
    }

  }

  handleSoldEvent = () => {
    this.tokenSaleInstance.events.Sold().on("data", this.updateOnTokenSold);
  }

  updateOnTokenSold = async () => {
    let _userTokens = await this.tokenInstance.methods.balanceOf(this.state.accounts[0]).call();
    const _tokensSold = await this.tokenSaleInstance.methods.tokensSold().call();
    alert("Transaction Completed!! Successfully bought!");
    this.setState({
      userTokens: _userTokens,
      tokensSold: _tokensSold
    });
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Crossbar Token Sale</h1>
        <p>Get your tokens here.</p>
        <p>Tokens Sold: {this.state.tokensSold}</p>
        <p>Token Price: {this.state.tokenPrice}</p>
        <p>Your Tokens: {this.state.userTokens}</p>
        <Form>
          <Form.Row>
            <Col xs={2} justify="center" n>
              <Form.Control placeholder="First name" onChange={this.handleChange} />
            </Col>
          </Form.Row>
        </Form>
        <form onSubmit={this.handleSubmit}>
          <input type="number" value={this.state.noOfTokens} onChange={this.handleChange} />
          <input type="submit" value="Buy" />
        </form>
      </div>
    );
  }
}

export default App;
