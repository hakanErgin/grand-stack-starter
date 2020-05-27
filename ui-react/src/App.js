import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import { withRouter } from "react-router";
import Login from "./components/Login";
import UserList from "./components/UserList";

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <Switch>
          <Route exact path="/" component={UserList} />
          <Route exact path="/login" component={Login} />
        </Switch>
      </React.Fragment>
    );
  }
}

export default withRouter(App);
