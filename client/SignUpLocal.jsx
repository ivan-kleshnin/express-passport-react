import * as R from "@paqmind/ramda"
import React from "react"

export default class SignUpLocal extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      inputs: {
        email: "",
        password: "",
        displayName: "",
      },

      errors: {
        email: "",
        password: "",
        displayName: "",
      },
    }
  }

  changeEmail(email) {
    this.setState(state => {
      return R.mergeDeep(state, {
        inputs: {email}
      })
    })
  }

  changePassword(password) {
    this.setState(state => {
      return R.mergeDeep(state, {
        inputs: {password}
      })
    })
  }

  changeDisplayName(displayName) {
    this.setState(state => {
      return R.mergeDeep(state, {
        inputs: {displayName}
      })
    })
  }

  signUp() {
    // TODO validate then
    this.props.signUp(this.state.inputs)
  }

  render() {
    let {inputs, errors} = this.state
    return <form>
      <div>
        <label>Email</label>
        {" "}
        <input name="email" type="email"
               value={inputs.email}
               onChange={(event) => this.changeEmail(event.target.value)}
               pattern=".+@globex.com"
               required autoComplete="off"/>
      </div>
      <div>
        <label>Password</label>
        {" "}
        <input name="password" type="password"
               value={inputs.password}
               onChange={(event) => this.changePassword(event.target.value)}
               required autoComplete="off"/>
      </div>
      <div>
        <label>Display Name</label>
        {" "}
        <input name="displayName" type="text"
               value={inputs.displayName}
               onChange={(event) => this.changeDisplayName(event.target.value)}
               required autoComplete="off"/>
      </div>
      <div>
        <button type="button"
                onClick={(event) => this.signUp()}>
          SignUp
        </button>
      </div>
    </form>
  }
}
