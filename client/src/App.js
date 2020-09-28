import React, { Component } from "react";
import getWeb3 from "./getWeb3";
import CrossbarToken from "./contracts/CrossbarToken.json";
import CrossbarTokenSale from "./contracts/CrossbarTokenSale.json";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css"
import Form from "react-bootstrap/Form"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"
import Navbar from "react-bootstrap/Navbar"
import Jumbotron from "react-bootstrap/Jumbotron"
import ProgressBar from "react-bootstrap/ProgressBar"
import Row from "react-bootstrap/Row"

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

      const _tokenPrice = await this.tokenSaleInstance.methods.price().call();
      const _tokensSold = await this.tokenSaleInstance.methods.tokensSold().call();
      const _userTokens = await this.tokenInstance.methods.balanceOf(accounts[0]).call();

      this.handleSoldEvent();
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: this.tokenSaleInstance, tokensSold: _tokensSold, userTokens: _userTokens, tokenPrice: _tokenPrice });
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
    console.log(typeof this.state.noOfTokens)
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
      return <div>
        Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand href="/">
            Crossbar Token Crowdsale
          </Navbar.Brand>
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              Your Account: {this.state.accounts[0]}
            </Navbar.Text>
          </Navbar.Collapse>
        </Navbar>

        <Jumbotron>
          <h3>Introducing Crossbar Token (CBR). Get yours here!</h3>
          <div class="container">
            <Row>
              <Col >
                <p>Token Price: 0.01 ETH</p>
              </Col>
              <Col>
                <p>Your have {this.state.userTokens} CBR</p>
              </Col>
            </Row>
          </div>
          <div class="container" >
            <Form onSubmit={this.handleSubmit}>
              <Form.Row className="align-items-center">
                <Col xs="auto" >
                  <Form.Control placeholder="No of Tokens" onChange={this.handleChange} type="number" />
                </Col>

                <Col>
                  <Button variant="primary" type="submit">
                    Buy
                  </Button>
                </Col>
              </Form.Row>
            </Form>
          </div>
        </Jumbotron>
        <div class="container" >
          <ProgressBar xs={2} now={this.state.tokensSold * 100 / 750000} />
          <br></br>
          <h6>{this.state.tokensSold}/750000 Tokens Sold</h6>
        </div>


        {/* <form onSubmit={this.handleSubmit}>
          <input type="number" value={this.state.noOfTokens} onChange={this.handleChange} />
          <input type="submit" value="Buy" />
        </form> */}

      </div>
    );
  }
}

export default App;
