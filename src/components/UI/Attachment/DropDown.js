import React, { Component } from 'react'
import onClickOutside from 'react-onclickoutside'
import classnames from 'classnames'
import { Button } from '~/components'

class DropDown extends Component {
  constructor(props) {
    super(props)
  }

  handleClickOutside() {
    this.props.toggle(false)
  }

  renderDropdownIcon() {
    const buttonClassName = classnames({
      'zmdi zmdi-arrow-left': this.props.showBackButton,
      'zmdi zmdi-menu': !this.props.showBackButton,
    })
    return <i className={buttonClassName} style={{ color: 'white' }} />
  }

  render() {
    let classNames = classnames({
      'dropdown open': this.props.open,
      dropdown: !this.props.open,
    })

    return (
      <ul className="actions">
        <li className={classNames}>
          <Button
            icon
            color="bgm-blue"
            onClick={() => this.props.handleDropdownClick()}
          >
            {this.renderDropdownIcon()}
          </Button>
          <ul className="dropdown-menu dropdown-menu-right">
            <li className={classNames}>
              <a
                className="shown-file-browser"
                onClick={() => this.props.handleUploadUrlMenuClick()}
              >
                <i className="zmdi zmdi-link" />
                {' '}Upload URL
              </a>
            </li>
            <li>
              <a
                className="shown-file-browser"
                onClick={() => this.props.handleListAttachmentsMenuClick()}
              >
                <i className="zmdi zmdi-folder" />
                {' '}List Existing Attachments
              </a>
            </li>
          </ul>
        </li>
      </ul>
    )
  }
}

export default onClickOutside(DropDown)
