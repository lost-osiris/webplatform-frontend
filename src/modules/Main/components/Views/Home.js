import React, { Component } from 'react'
import Utils from '~/utils'

import { Attachment } from '~/components'

export default class Welcome extends Component {
  constructor(props) {
    super(props)
    this.reducer = 'dashboard'
    this.utils = new Utils(this.reducer)

    this.state = {
      uploadedFiles: undefined
    }

  }

  render() {
    var user = JSON.parse(JSON.stringify(this.utils.getUser()))
    var keys = [
      'cn',
      'title',
      'rhatGeo',
      'rhatNickName',
      'rhatCostCenterDesc',
      'mail'
    ]

    for (var i = 0; i < keys.length; i++) {
      if (user.kerberos[keys[i]] == undefined) {
        user.kerberos[keys[i]] = 'Unknown'
      }
    }

    console.log('render home with data:', this.props.data)
    return (
      <div className="row">
        <div className="col-lg-12">
          <Attachment
            db={'support-exceptions'}
            collections={'se'}
            keyword={'attachments'}
            objectType={'array-dict'}
            onChange={ (uploadedFiles) => this.setState({ uploadedFiles }) }
            id={''}
            value={this.state.uploadedFiles}
          />

          <br />
          <br />
          <br />
          <br />
          <br />
        </div>
        <div className="col-lg-12">
          {/* <Card>
            <div id="card-header">
              <h1>Header</h1>
            </div>
            <div id="card-sidenav">
              <p>Sidenav</p>
            </div>
            <div id="card-body">
              <p>Card body</p>
            </div>
            <div id="card-footer">
              <p>Footer</p>
            </div>
          </Card> */}
          {/* <Card>
            <Card.Header>
              <h1>Header</h1>
            </Card.Header>
            <Card.SideNav>
              <p>Sidenav</p>
            </Card.SideNav>
            <Card.Body>
              <p>Card body</p>
            </Card.Body>
            <Card.Footer>
              <p>Footer</p>
            </Card.Footer>
          </Card> */}
          <div className="wrapper wrapper-content">
            <div className="row">
              <div className="col-lg-12">
                <div className="jumbotron">
                  <div className="news-caption">
                    <h2>
                      <b>
                        <i className="fa fa-bullhorn login-annoucement-text"></i>
                        {' '}CEE-Tools has undergone a full front-end migration!</b>
                    </h2>
                    <br />
                    <p>We have migrated the front-end of CEE-Tools to remain up-to-date with current technologies, and provide users with a much more responsive interface.</p>
                    <p>You should notice a significant speed increase across the entire platform.</p>
                    <p>If you have any problems or suggestions please feel free to reach out to Matthew Owens <a href="mailto:mowens@redhat.com">mowens@redhat.com</a>.</p>
                    <p>You can also report an issue on
                      {' '}<a target="_blank"  rel="noopener noreferrer" href="https://gitlab.cee.redhat.com/mowens/cee-tools/issues">gitlab</a>.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-12">
                <div className="wrapper wrapper-content">
                  <dl className="dl-horizontal">
                    <dt>Information:</dt>
                    <dd>
                      <p>The goal for CEE Tools is to provide a collection of tools that have overlaps in data all in one place to better support everyone in CEE.</p>
                      <p>For any new changes or update please stay turn to the announcement board for updates.</p>
                      <p>If you come across any bugs or have any feature requests please click on the report an issue or contact Matthew Owens
                        {' '}<a href="mailto:mowens@redhat.com">mowens@redhat.com</a>
                      </p>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="ibox">
            <div className="ibox-title">
              <h5>User Info</h5>
            </div>
            <div className="ibox-content text-left">
              <p>{user.kerberos.cn}</p>
              <div className="row">
                <div className="col-lg-4">
                  <dl>
                    <dt>Title</dt>
                    <dd>{user.kerberos.title}</dd>
                  </dl>
                </div>
                <div className="col-lg-4">
                  <dl>
                    <dt>GEO</dt>
                    <dd>{user.kerberos.rhatGeo}</dd>
                  </dl>
                </div>
                <div className="col-lg-4">
                  <dl>
                    <dt>IRC</dt>
                    <dd>{user.kerberos.rhatNickName}</dd>
                  </dl>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-4">
                  <dl>
                    <dt>Cost Center</dt>
                    <dd>{user.kerberos.rhatCostCenterDesc}</dd>
                  </dl>
                </div>
                <div className="col-lg-4">
                  <dl>
                    <dt>Email</dt>
                    <dd>{user.kerberos.mail}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
