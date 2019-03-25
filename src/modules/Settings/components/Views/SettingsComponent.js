import React, { Component } from 'react'
import { Tabs } from '~/components'
import Section from './Section'

export default class Settings extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this.user = this.props.user
  }

  renderTabs() {
    return (
      <Tabs current={this.props.tab || 'profile'}>
        <div type="nav">
          <a target="profile">Profile</a>
          <a target="general">General</a>
          <a target="notifications">Notifications</a>
          <a target="advanced">Advanced</a>
        </div>
        <div type="content">
          <div id="profile">
            {this.renderProfile()}
          </div>
          <div id="notifications">
            <Section
              applicationSettings={this.props.templates.settings['notifications'] || {}}
              applicationTitles={this.props.templates.appTitles}
              settings={this.props.settings}
            />
          </div>
          <div id="general">
            <Section
              applicationSettings={this.props.templates.settings['general'] || {}}
              applicationTitles={this.props.templates.appTitles}
              settings={this.props.settings}
            />
          </div>
          <div id="advanced">
            <Section
              applicationSettings={this.props.templates.settings['advanced'] || {}}
              applicationTitles={this.props.templates.appTitles}
              settings={this.props.settings}
            />
          </div>
        </div>
      </Tabs>
    )
  }

  renderProfile() {
    return (
      <div className="card">
        <div className="card-header ch-alt">
          <div className="row">
            <div className="col-lg-12 text-left">
              <img src={this.user.picture} className="pull-left lgi-img" />
              <h3
                style={{
                  marginTop: '5px',
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '9px',
                }}
              >
                <span style={{ marginLeft: '10px' }}>
                  {this.user.kerberos.cn}
                </span>
              </h3>
              <small style={{ marginLeft: '10px' }} className="text-muted">
                Profile Settings
              </small>
            </div>
          </div>
        </div>
        <div className="card-body card-padding">
          <h1>Profile Picture</h1>
          <br />
          <p style={{ fontSize: '15px' }}>
            We use{' '}
            <a target="_blank" href="https://gravatar.com/">
              gravatar
            </a>{' '}
            for all of our profile pictures. Your current gravatar is displayed beside your name
            above.
            <br />
            <br />
            If you do not have an account with gravatar you will see an{' '}
            <a href="https://en.wikipedia.org/wiki/Identicon" target="_blank">
              identicon
            </a>{' '}
            that looks similar to this:
            <br />
            <br />
            <img src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=identicon" />
            <br />
            <br />
            Gravatar creates a hash using your red hat email, so in order for us to grab your
            profile picture you will need to either link your gravatar account to
            your-uid@redhat.com email address, or create a new gravatar account using your redhat
            email address.
            <br />
            <br />
            <a target="_blank" href="https://en.gravatar.com/connect/">
              Click here to create your gravatar account!
            </a>
          </p>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="animated fadeInRight row wrapper wrapper-content">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body card-padding">
              {this.renderTabs()}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
