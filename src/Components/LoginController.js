import React from 'react';
import SpotifyLogin from 'react-spotify-login';
import { Dimmer, Header, Icon } from 'semantic-ui-react'

const clientId = process.env.REACT_APP_SPOTIFY_CLIENT;
const redirectUri = "http://localhost:3000";
const scopes = 'user-read-private user-read-email';
export default class LoginController extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    loginSuccess = (token) => {
        this.props.onLogin(token);
    }
    loginFail(err) {
        console.error(err);
    }
    render() {
        return (
            <Dimmer active page>
            <Header as='h2' icon inverted>
                <Icon name='heart' />
                Time to find some new jams!
                <Header.Subheader>
                    <SpotifyLogin clientId={clientId}
                        redirectUri={redirectUri}
                        scope={scopes}
                        className={'ui basic button green'}
                        onSuccess={this.loginSuccess}
                        onFailure={this.loginFail} />
                </Header.Subheader>
            </Header>
            </Dimmer> 
            
        )
    }

}