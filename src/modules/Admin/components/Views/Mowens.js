import React from 'react'

import { Inputs } from '~/components'
import Utils from '~/utils'

export default class MowensContainer extends React.Component {
  constructor(props) {
    super(props)

    this.utils = new Utils()
  }

  render() {
    // let data = [
    //   {
    //     name: 'mowens',
    //     foo: {
    //       bar: 'mowens'
    //     }
    //   },
    //   {
    //     name: 'ahyder',
    //     foo: {
    //       bar: 'ahyder'
    //     }
    //   }
    // ]
    return (
      <div className="row">
        {/* <Inputs.Autocomplete
          minSearch={1}
          searchKey={'name'}
          data = {data}
          searchText={''}          onChange={() => console.log('CHANGE!')}
        /> */}
        <Inputs.Autocomplete
          minSearch={1}
          api={'users.search'}
          resultsComponent={Results}
          onChange={() => console.log('CHANGE!')}
        />
      </div>
    )
  }
}

class Results extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div onMouseDown={() => this.props.onSelection({toggled: false, text: this.props.uid})}>
        <img className="pull-left autcomplete-user-img" src={this.props.picture} />
        <span>{ this.props.cn } ({ this.props.uid })</span>
      </div>
    )
  }
}
