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

  signInLocal(form) {
    fetchJSON("/auth/local/sign-in", {
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

  signUpLocal(form) {
    fetchJSON("/auth/local/sign-up", {
      method: "POST",
      body: form,
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
    fetchJSON("/auth/sign-out", {
      method: "POST",
    })
    .then(dataOrError => {
      if (dataOrError instanceof Error) {
        alert(dataOrError.status + " " + dataOrError.message)
      } else {
        alert("You've signed out succefully!")
        this.setState({
          me: guest,
        })
        this.props.history.push("/")
      }
    })
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
          <Route render={() => <Home signInLocal={(user) => this.signInLocal(user)}
                                     signUpLocal={(user) => this.signUpLocal(user)}/>}
                 path="/" exact/>
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
