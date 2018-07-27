import React from "react"
import SignInLocal from "./SignInLocal"
import SignUpLocal from "./SignUpLocal"
import SignInGitHub from "./SignInGitHub"
import SignUpGitHub from "./SignUpGitHub"

export default class Home extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      display: "sign-in" // "sign-in" | "sign-up"
    }
  }

  showSignIn() {
    this.setState({
      display: "sign-in",
    })
  }

  showSignUp() {
    this.setState({
      display: "sign-up",
    })
  }

  render() {
    let {signInLocal, signUpLocal, signInGitHub, signUpGitHub} = this.props
    let {display} = this.state

    return <div>
      {
        display == "sign-in"
          ? <div>
              <SignInLocal signIn={signInLocal}/>
              <SignInGitHub/>
              <p>
                Don't have an account yet? <button type="button" onClick={() => this.showSignUp()}>Sign Up</button>
              </p>
            </div>
          : <div>
              <SignUpLocal signUp={signUpLocal}/>
              <SignUpGitHub/>
              <p>
                Already have an account? <button type="button" onClick={() => this.showSignIn()}>Sign In</button>
              </p>
            </div>
      }
    </div>
  }
}
