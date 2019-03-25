import React, { Component } from 'react'
import ReactMarkdown from 'react-markdown-it'
import { Button, Tabs, Inputs, Card } from '~/components'

export default class CommentBox extends Component {
  constructor(props) {
    super(props)
    this.state = {
      error: false,
      preview: false,
      value: props.value || 'text'
    }
  }

  componentDidMount() {
    this.setState({value: this.props.value || 'test'})
  }

  onSubmit() {
    this.props.onSubmit(this.state.value)
    this.setState({value: ''})
  }

  onChange(text) {
    if (this.props.onChange) {
      this.props.onChange(text)
    }

    this.setState({value: text})
  }

  render() {
    return (
      <Card>
        <Card.Body className="card-padding">
          <Tabs fill current="comment">
            <Tabs.Nav>
              <a target="comment">
                <i className="fa fa-commenting-o text-info"></i> Comment
              </a>
              <a target="preview">
                <i className="fa fa-ellipsis-h"></i> Preview
              </a>
            </Tabs.Nav>
            <Tabs.Content>
              <div key="comment">
                <div className="form-group">
                  <div className="fg-line">
                    <Inputs.Text
                      type="textarea"
                      rows="10"
                      value={this.state.value}
                      testValue={this.state.value}
                      onChange={(text) => this.onChange(text)}
                      error={this.state.error}
                    />
                  </div>
                </div>
              </div>
              <div key="preview" style={ {minHeight: '206px'} }>
                <ReactMarkdown source={ this.state.value } escapeHtml={ true } />
              </div>
            </Tabs.Content>
          </Tabs>
          <Button
            btnStyle="primary"
            onClick={(e) => this.onSubmit(e)}
          >
            Submit
          </Button>
        </Card.Body>
      </Card>
    )
  }
}
