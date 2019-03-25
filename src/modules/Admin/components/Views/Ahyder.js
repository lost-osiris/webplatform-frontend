import React from 'react'

import { Inputs } from '~/components'

export default class AhyderContainer extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="row">
        <Inputs.NewAutocomplete
          minSearch={4}
          // data={['alpha', 'beta', 'charlie', 'delta']}
          // data = {
          //   [
          //     {
          //       'name': 'alpha',
          //       'foo': 'bar',
          //     } ,
          //     {
          //       'name':  'beta',
          //       'foo': 'bar',
          //     } ,
          //     {
          //       'name': 'charlie',
          //       'foo': 'bar',
          //     } ,
          //     {
          //       'name': 'delta',
          //       'foo': 'bar',
          //     }
          //   ]
          // }
          searchKey={'name'}
          data = {this.props.data.products}
          // searchKey={'id'}
          // searchText={this.newUser.uid}
          searchText={''}
          onChange={() => console.log('CHANGE!')}
          // onChange={(result) => {
          //   this.newUser = ''
          //   if (result.result !== undefined) {
          //     this.newUser = result.result
          //   }
          // }}
        />
      </div>
    )
  }
}
