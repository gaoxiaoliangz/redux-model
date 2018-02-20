import React, { Component } from 'react'
// import PT from 'prop-types'
import model from './homeModel'
import { connect } from 'react-redux'

console.log(model)

class Home extends Component {
  static propTypes = {
  }

  componentDidMount() {
    model.init()
    model.sayyes()
    model.test()
  }

  render() {
    return (
      <div>
        {this.props.state.home.init}
      </div>
    )
  }
}

export default connect(state => ({ state }))(Home)
