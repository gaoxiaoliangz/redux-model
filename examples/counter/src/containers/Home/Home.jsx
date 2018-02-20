import React, { Component } from 'react'
// import PT from 'prop-types'
import model from './homeModel'

class Home extends Component {
  static propTypes = {
  }

  componentDidMount() {
    model.updateCount(10)
  }

  render() {
    return (
      <div>
        <button onClick={() => model.updateCount(this.props.count - 1)}>Minus</button>
        {this.props.count}
        <button onClick={() => model.updateCount(this.props.count + 1)}>Add</button>
        <button onClick={() => model.updateCountAsync(this.props.count + 1)}>Add(async)</button>
      </div>
    )
  }
}

export default model.connect(Home)
