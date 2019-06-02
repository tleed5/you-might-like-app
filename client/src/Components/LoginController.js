import React from 'react';
import { Dimmer, Header, Icon,Button } from 'semantic-ui-react'

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
                    <Header.Subheader>
                        <Button basic color='teal' onClick={(e) => this.loginSuccess(e)}>Continue</Button>
                    </Header.Subheader>
                </Header>
            </Dimmer> 
        )
    }

}