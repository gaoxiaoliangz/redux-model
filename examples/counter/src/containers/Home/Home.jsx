import React, { Component } from 'react'
// import PT from 'prop-types'
import model from './homeModel'

class Home extends Component {
  static propTypes = {
  }

  componentDidMount() {
    model.$watch('count', val => {
      console.log('watch through model.watch', val)
    })
    model.updateCount(10)
    model.$set('count', 6)
  }

  render() {
    return (
      <div>
        <button onClick={() => model.updateCount(this.props.count - 1)}>Minus</button>
        {this.props.count}
        <button onClick={() => model.updateCount(this.props.count + 1)}>Add</button>
        <button onClick={() => model.updateCountAsync()}>Add(async)</button>
        <button onClick={() => model.updateCountAsyncQuick()}>Add(async quick)</button>
      </div>
    )
  }
}

export default model.connect(Home)
