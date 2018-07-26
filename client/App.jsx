import React from "react"
import {Link, Route, Switch, withRouter} from "react-router-dom"
import {guest} from "../common/models"
import Home from "./Home"
import About from "./About"
import Account from "./Account"
import NotFound from "./NotFound"

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      me: guest,
    }
  }

  signIn(user) {
    this.setState({
      me: user,
    })
  }

  signUp(user) {
    this.setState({
      me: user,
    })
  }

  signOut() {
    this.setState({
      me: guest,
    })
    this.props.history.push("/")
  }

  render() {
    let {me} = this.state

    return <div>
      <header>
        <h1>Welcome</h1>
        <p>
          <Link to="/">Home</Link>
          {" "}
          <Link to="/about">About</Link>
          {
            me.role != "guest" ? [
              " ",
              <Link to="/account" key="x">Account</Link>
            ] : []
          }
        </p>
      </header>
      <section>
        <Switch>
          <Route path="/" exact render={() => <Home signIn={(user) => this.signIn(user)}
                                                    signUp={(user) => this.signUp(user)}/>}/>
          <Route path="/about" render={() => <About/>}/>
          <Route path="/account" render={() => <Account me={me}
                                                        signOut={() => this.signOut()}/>}/>
          <Route render={() => <NotFound/>}/>
        </Switch>
      </section>
    </div>
  }
}

export default withRouter(App)
