import React from 'react';
import { Dimmer, Header, Icon,Button,Segment } from 'semantic-ui-react'

export default class LoginController extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    loginSuccess = () => {
        this.props.onLogin();
    }
    loginFail(err) {
        console.error(err);
    }
    render() {
        return (
            <Dimmer active={!this.props.isLoggedIn} page>
                <Header as='h2' icon inverted>
                    <Icon name='heart' />
                    Time to find some new jams!
                </Header>
                <Header.Subheader>
                    <Button color='green' basic inverted>
                            <Icon name='spotify' /> Login With Spotify
                    </Button>
                </Header.Subheader>
                <Segment basic textAlign='center'>
                    <Button basic inverted color='teal' onClick={(e) => this.loginSuccess(e)}>Continue Without Logging In</Button>
                </Segment>
            </Dimmer> 
        )
    }

}