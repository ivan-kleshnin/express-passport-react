import React from "react"
import SignIn from "./SignIn"
import SignUp from "./SignUp"

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
    let {signIn, signUp} = this.props
    let {display} = this.state

    return <div>
      {
        display == "sign-in"
          ? <div>
              <SignIn signIn={signIn}/>
              <p>
                Don't have an account yet? <button type="button" onClick={() => this.showSignUp()}>Sign Up</button>
              </p>
            </div>
          : <div>
              <SignUp signUp={signUp}/>
              <p>
                Already have an account? <button type="button" onClick={() => this.showSignIn()}>Sign In</button>
              </p>
            </div>
      }
    </div>
  }
}
