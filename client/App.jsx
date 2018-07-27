import React from "react"
import {Link, Route, Switch, withRouter} from "react-router-dom"
import {fetchJSON} from "../common/helpers"
import {guest} from "../common/models"
import Home from "./Home"
import About from "./About"
import Account from "./Account"
import NotFound from "./NotFound"

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      me: window.me || guest,
    }
  }

  signIn(form) {
    fetchJSON("/api/sign-in", {
      method: "POST",
      body: form,
    })
    .then(dataOrError => {
      if (dataOrError instanceof Error) {
        alert(dataOrError.status + " " + dataOrError.message)
      } else {
        alert("You've signed in succefully!")
        this.setState({
          me: dataOrError,
        })
      }
    })
  }

  signUp(user) {
    fetchJSON("/api/sign-up", {
      method: "POST",
      body: this.state.inputs,
    })
    .then(dataOrError => {
      if (dataOrError instanceof Error) {
        alert(dataOrError.status + " " + dataOrError.message)
      } else {
        alert("You've signed up succefully!")
        this.setState({
          me: dataOrError,
        })
      }
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
