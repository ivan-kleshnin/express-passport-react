import * as R from "@paqmind/ramda"
import React from "react"
import {fetchJSON} from "../common/helpers"

// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/email
// -- input:invalid does not work in this case (works on that page!) – why?
export default class SignIn extends React.Component {
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
    fetchJSON("/api/sign-in", {
      method: "POST",
      body: this.state.inputs,
    })
    .then(dataOrError => {
      if (dataOrError instanceof Error) {
        alert(dataOrError.status + " " + dataOrError.message)
      } else {
        alert("You've signed in succefully!")
        this.props.signIn(dataOrError)
      }
    })
  }

  render() {
    let {inputs, errors} = this.state
    return <form>
      <div>
        <label>Email</label>
        <input name="email" type="email"
               value={inputs.email}
               onChange={(event) => this.changeEmail(event.target.value)}
               pattern=".+@globex.com"
               required autoComplete="off"/>
      </div>
      <div>
        <label>Password</label>
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