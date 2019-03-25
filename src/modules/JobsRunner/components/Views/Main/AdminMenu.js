import React from 'react'
import { Button, DropDown } from '~/components'
// import Utils from '~/utils';

const AdminMenu = (props) => {
  if (props.admin) {
    return (
      <DropDown bgm="bgm-green" icon="zmdi zmdi-menu">
        <li onMouseDown={ () => props.action('add') }>
          <a>
               Add Job
               </a>
        </li>
        <li onMouseDown={ () => props.action('update') }>
          <a>
               Update APIs
               </a>
        </li>
        <li onMouseDown={ () => props.action('stop') }>
          <a>
               Stop Scheduler
               </a>
        </li>
        <li onMouseDown={ () => props.action('recover') }>
          <a>
               Recover Jobs
               </a>
        </li>
      </DropDown>
    )
  }

  return (
    <Button
      icon
      color="bgm-blue"
      onClick={() => props.action('add')}
    >
      <i className="zmdi zmdi-plus"></i>
    </Button>
  )
}

export default AdminMenu
