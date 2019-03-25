import React, {Component} from 'react'
import Utils from '~/utils'
import ReactMarkdown from 'react-markdown-it'
import {Button, FormatDate, Card } from '~/components'
import classnames from 'classnames'

/*
#TODO component should be able to take in a color, title, api end point and
role to be able to be able to support every applications comments.
*/

/**
  Props:
    - color
    - comment
      - created
      - creator
        - firstname
        - lastname
        - picture
        - uid
      - id
      - text
    - onRemove
    - onEdit

  Optional Props:
    - editable
    - removable
    - headerTextStyle
    - role
*/
class Comment extends Component {
  constructor(props) {
    super(props)
    this.utils = new Utils()
    this.state = {
      user: this.utils.getUser(),
      editedText: this.props.comment.text,
      editing: false,
      error: false,
    }
  }

  componentDidRecieveProps(nextProps) {
    this.setState({
      editedText: nextProps.comment.text,
    })
  }

  shouldShowMenu() {
    const {user} = this.state
    const {uid} = this.props.comment.creator
    const {editable, removable} = this.props
    let showMenu = 'hide'
    let showEdit = 'hide'

    if (user.uid === uid || user.permissions.is_seAdmin) {
      if (editable) {
        showEdit = 'show'
      }

      if (removable) {
        showMenu = 'show'
      }
    }

    return {showMenu, showEdit}
  }

  getCreatorTitle() {
    const {uid, firstname, lastname} = this.props.comment.creator
    return uid === 'SE-Admin' ? uid : `${firstname} ${lastname}`
  }

  cancelEdit() {
    this.setState({
      editedText: this.props.comment.text,
      editing: false,
    })
  }

  submitEdit() {
    if (this.state.editedText !== '') {
      this.props.onEdit(this.props.comment.id, this.state.editedText)
      this.setState({error: false})
    } else {
      this.setState({error: true})
    }
  }

  renderEdit() {
    const editClass = classnames({
      'fg-line': true,
      'has-error': this.state.error,
    })

    return (
      <div className={editClass}>
        <textarea
          className="form-control"
          rows="5"
          value={this.state.editedText}
          onChange={e => this.setState({editedText: e.target.value})}
        />
        <br />
        <Button
          btnStyle="primary"
          style={{marginRight: '5px'}}
          onClick={() => this.submitEdit()}
        >
          Submit
        </Button>
        <Button
          btnStyle="danger"
          style={{marginRight: '5px'}}
          onClick={() => this.cancelEdit()}
        >
          Cancel
        </Button>
      </div>
    )
  }

  renderImage(picture) {
    if (picture === undefined) {
      return <div />
    }

    return <img src={picture} className="pull-left lgi-img" />
  }

  renderBody() {
    if (this.state.editing) {
      return this.renderEdit()
    } else {
      return <ReactMarkdown source={this.props.comment.text} escapeHtml={true} />
    }
  }

  renderHeader() {
    const {picture, uid} = this.props.comment.creator
    const {role} = this.props
    const headerStyle = picture !== undefined ? {paddingLeft: '50px'} : {}
    const roleStyle = picture !== undefined ? {paddingLeft: '11px'} : {}

    return (
      <div>
        {this.renderImage(picture)}
        <h4 style={headerStyle}>
          {this.getCreatorTitle()}
        </h4>
        <span className="text-muted" style={roleStyle}>
          {uid} {role}
        </span>
      </div>
    )
  }

  render() {
    const {comment, color, onRemove} = this.props
    const {id, created} = comment
    const {showMenu, showEdit} = this.shouldShowMenu()

    return (
      <Card>
        <Card.Title className={`${color} card-comment`}>
          <div className="row">
            <div className="col-lg-4">
              {this.renderHeader()}
            </div>
            {this.props.renderTitle()}
            <div className="col-lg-4 text-right">
              <Button
                icon="zmdi zmdi-close"
                color="red"
                otherClasses={`pull-right ${showMenu}`}
                onClick={() => onRemove(id)}
              />
              <Button
                icon="zmdi zmdi-edit"
                color="amber"
                otherClasses={`pull-right ${showEdit}`}
                style={{marginLeft: '5px', marginRight: '5px'}}
                onClick={() => this.setState({editing: true})}
              />
            </div>
          </div>
        </Card.Title>
        <Card.Body className={`card-padding ${color}-body card-comment`}>
          {this.renderBody()}
          <div className="text-right">
            <small>
              <i>
                Created <FormatDate date={created} />
              </i>
            </small>
          </div>
        </Card.Body>
      </Card>
    )
  }
}

Comment.defaultProps = {
  editable: true,
  removable: true,
  headerTextStyle: {},
  role: '',
  renderTitle: () => {
    const title = <div className="col-lg-4" />

    return title
  },
}

export default Comment
