import React, { Component } from "react";
import { abi, bytecode } from "./TokenERC20.json";
import getWeb3 from "./utils/getWeb3";
import { Button,Nav, NavItem, Navbar, Alert, PageHeader, FormControl, FormGroup, ControlLabel, Grid, Row, Col, Table } from 'react-bootstrap';
import "./App.css";

class App extends Component {
  state = { 
    web3: null,
    accounts: null,
    params: {
      initialSupply: 0,
      tokenName: null,
      tokenSymbol: null,
      decimals: 0
    },
    tokenAddress: null,
    isLoading: false,
    isLoaded: false,
    web3Connect: false
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, web3Connect: true });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.log(error);
    }
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      params: {
        ...prevState.params,
        [name]: value
      }
    }));
  }

  runExample = async (e) => {
    e.preventDefault();
    const { accounts, web3, params } = this.state;
    console.log(params.initialSupply, params.tokenName, params.tokenSymbol, params.decimals)
    // const Contract = truffleContract(TokenContract);
    // Contract.setProvider(web3.currentProvider);
    // const instance = await Contract.deployed();
    const TokenContract = new web3.eth.Contract(abi);// web3 contract instance
    this.setState({isLoading: true});
    const deployParameters = {
      // TODO: fill in the arguments and bytecode parameters
      data: bytecode,
      arguments: [params.initialSupply, params.tokenName, params.tokenSymbol, params.decimals]
    }
    return TokenContract.deploy(deployParameters).estimateGas().then((gas) => {
      return TokenContract.deploy(deployParameters).send({
        // TODO: fill in the from address and gas estimate
        from: accounts[0],
        gas: gas
      })
      .then(res => {
        this.setState({
          tokenAddress: res._address,
          isLoading: false,
          isLoaded: true
        })
      });
    })
  };

  render() {
    const loader = (<div className="lds-dual-ring"></div>);
    const acceptMetamask = (<div className='accept-metamask-container'><div className="lds-dual-ring"></div><h3>Connecting to metamask</h3><p>If you don't have Metamask. <strong>Please</strong>, download <a target='_blank' href='https://metamask.io/'> MetaMask </a> to use this application.</p></div>);
    if (!this.state.web3) {
      return acceptMetamask;
    }
    const warning = (<Alert bsStyle="danger" style={{'margin': '0'}}>
      <strong>Please</strong>, download <a target='_blank' href='https://metamask.io/'> MetaMask </a> to use this application.
</Alert>)
  
    const tokenInfo = (<div>
      <Table bordered >
        <tbody >
          <tr>
            <td >Token Address</td>
            <td>{this.state.tokenAddress}</td>
          </tr>
          <tr>
            <td>Token Symbol</td>
            <td>{this.state.params.tokenSymbol}</td>
          </tr>
          <tr>
            <td>Amount Of Decimals</td>
            <td>{this.state.params.decimals}</td>
          </tr>
        </tbody>
      </Table>
    </div>)
    const formDiv = (<div><form onSubmit={this.runExample}>
      <FormGroup>
        <ControlLabel>Token name</ControlLabel>
        <FormControl name='tokenName' type='text' onChange={this.handleChange} placeholder="token name" />
        <ControlLabel>Token symbol</ControlLabel>
        <FormControl name='tokenSymbol' type='text' onChange={this.handleChange} placeholder="token symbel eg: CEB" />
        <ControlLabel>Total supply</ControlLabel>
        <FormControl name='initialSupply' type="number" onChange={this.handleChange} placeholder="total supply" />
        <ControlLabel>Decimals</ControlLabel>
        <FormControl name='decimals' type="number" onChange={this.handleChange} placeholder="amount of decimals" />
      </FormGroup>
    </form>
      <Button bsStyle="success" onClick={this.runExample}>
        Create your token!
        </Button></div>)

    return (
      <div className="App">
        {!this.state.web3Connect && warning}
        <Navbar inverse staticTop="true" >
          <Navbar.Header>
            <Navbar.Brand>
              The Blockchain Project
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>

          <Nav pullRight>
            <NavItem eventKey={1}>
              Create Token
            </NavItem>
            <NavItem eventKey={2}>
              Businesses
            </NavItem>
            <NavItem eventKey={3}>
              Communities
            </NavItem>
            <NavItem eventKey={4}>
              Use Casses
            </NavItem>
            <NavItem eventKey={5}>
              Contact
            </NavItem>
          </Nav>
        </Navbar>
        <PageHeader>
          Start making your own token!
        </PageHeader>
        <div className='grid-container'>
        <Grid>
          <Row className="show-grid">
              <Col xs={12} md={6}>
              {!this.state.isLoaded && !this.state.isLoading && formDiv}
              {this.state.isLoading && loader}
              {this.state.isLoaded && tokenInfo}
            </Col>
              <Col xs={12} md={6}>
                <h3>Steps to creating your own token:</h3>
                <ul className='instructions-list'>
                  <li>1. Think of an awesome name and symbol.</li>
                  <li>2. Set the token supply and the amount of decimals.</li>
                  <li>3. Press the create token button.</li>
                  <li>4. Submit the transaction.</li>
                  <li>5. <big>IMPORTANT</big> save your contract address.</li>
                  <li>6. open metamask, open menu, add token and paste your address in.</li>
                  <li>7. You did it! You have your own token!</li>
                </ul>

            </Col>
          </Row>
        </Grid>
        </div>
      </div>
    );
  }
}

export default App;
