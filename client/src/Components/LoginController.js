import React from 'react';
import { Dimmer, Header, Icon,Button,Segment } from 'semantic-ui-react';
import Cookie from 'universal-cookie';
const cookie = new Cookie();
const getLoginUrlApi = async() => fetch('/api/user/login');

export default class LoginController extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        console.log(this.props)
    }
    loginSuccess = () => {
        this.props.onLogin();
    }
    loginFail(err) {
        console.error(err);
    }
    handleLogin = async() =>{
        let loginUrl = await getLoginUrlApi();
        let url = await loginUrl.json();
        window.open(url.body['url'],"_self");
    }
    startAuth = async() =>{        
        let params = new URLSearchParams(window.location.search);
        let code = params.get('code');
        if(!code){
            return;
        }
        let auth = await fetch('/api/user/auth',{
                    method: 'POST',
                    body:JSON.stringify({
                        code:code,
                    }),
                    headers:{
                        'Content-Type': 'application/json'
                    }
                });
        
        let parsed = await auth.json();
        cookie.set('auth',parsed.auth);
        this.loginSuccess();
    }
    componentDidMount = async()=>{
        await this.startAuth();
    }
    render() {
        return (
            <Dimmer active={!this.props.isLoggedIn} page>
                <Header as='h2' icon inverted>
                    <Icon name='heart' />
                    Time to find some new jams!
                </Header>
                <Header.Subheader>
                    {/* <Button color='green' basic inverted onClick={(e) => this.handleLogin(e)}>
                            <Icon name='spotify' /> Login With Spotify
                    </Button> */}
                </Header.Subheader>
                <Segment basic textAlign='center'>
                    <Button basic inverted color='teal' onClick={(e) => this.loginSuccess(e)}>Continue Without Logging In</Button>
                </Segment>
            </Dimmer>
        )
    }
}