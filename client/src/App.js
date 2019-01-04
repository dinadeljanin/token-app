import React, { Component } from "react";
import { Nav, NavItem, Navbar } from 'react-bootstrap';
import "./App.css";
import CreateToken from "./components/createTokenComponents/createToken";
import LandingPage from "./components/landingPageComponent/landingPage";
import { Switch, Route } from 'react-router-dom';

class App extends Component {
  constructor() {
    super()
    this.state = {

    }
  }

  handleChangePage = (key) => {
    if (key === 1) { return this.props.history.push("/") }
    if (key === 2) { return this.props.history.push("/createtoken") }
  }

  render() {
    
    return (
      <div className="App">
        <Navbar inverse staticTop="true" >
          <Navbar.Header>
            <Navbar.Brand>
              The Blockchain Project
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>

          <Nav pullRight activeKey={1} onSelect={this.handleChangePage}>
            <NavItem eventKey={2}>
              Create Token
            </NavItem>
            <NavItem eventKey={1}>
              Businesses
            </NavItem>
            <NavItem eventKey={1}>
              Communities
            </NavItem>
            <NavItem eventKey={1}>
              Use Casses
            </NavItem>
            <NavItem eventKey={1}>
              Contact
            </NavItem>
          </Nav>
        </Navbar>
        <Switch>
          <Route exact path="/" render={(props) => (<LandingPage
            
          />)} />
          <Route exact path="/createtoken" render={(props) => (<CreateToken

          />)} />
        </Switch>
        
      </div>
    );
  }
}

export default App;
