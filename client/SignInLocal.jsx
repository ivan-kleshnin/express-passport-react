import * as R from "@paqmind/ramda"
import React from "react"

export default class SignInLocal extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      inputs: {
        email: "", //"jack@example.com",
        password: "", //"secret",
      },

      errors: {
        email: "",
        password: "",
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

  signIn() {
    // TODO validate then
    this.props.signIn(this.state.inputs)
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
        <button type="button"
                onClick={(event) => this.signIn()}>
          SignIn
        </button>
      </div>
    </form>
  }
}
