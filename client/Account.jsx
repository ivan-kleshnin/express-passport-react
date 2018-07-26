import React from "react"
import {Redirect} from "react-router-dom"

export default class Account extends React.Component {
  render() {
    let {me, signOut} = this.props

    if (me.role == "guest") {
      return <Redirect to="/"/>
    } else {
      return <div>
        {JSON.stringify(me, null, 2)}
        <p>
          <button type="button" onClick={signOut}>Sign Out</button>
        </p>
      </div>
    }
  }
}