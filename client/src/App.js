import React from 'react';
import './App.css';
import Cookies from 'universal-cookie';
import AlbumController from './Components/AlbumController';
import LoginController from './Components/LoginController';
import { Container} from 'semantic-ui-react'

var SpotifyWebApi = require('spotify-web-api-node');

const cookies = new Cookies();
const clientId = process.env.REACT_APP_SPOTIFY_CLIENT;

const redirectUri = "http://localhost:3000";
const spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    redirectUri: redirectUri
});

class App extends React.Component {
    constructor(props) {
        super(props);
        let token = cookies.get('authToken') ? cookies.get('authToken') : false;
        let isLoggedIn = false;
        if (token) {
            spotifyApi.setAccessToken(token);
            isLoggedIn = true;
        }
        this.state = {
            token: token,
            isLoggedIn:isLoggedIn,
            searchRes: null
        };
    }
    handleLogin = (token) =>{
        let expiry = new Date();
        expiry.setTime(expiry.getTime() + (1 * 60 * 60 * 1000));
        cookies.set('authToken', token.access_token, { path: '/', expires: expiry });
        spotifyApi.setAccessToken(token.access_token);
        this.setState({
            token:token.access_token, 
            isLoggedIn:true
        });
    }
    render() {
        const isLoggedIn = this.state.isLoggedIn;
        let view;
        if (isLoggedIn) {
            view = 
                <Container>
                    <ProfileInfo />
                    <AlbumController spotify={spotifyApi}/>
                </Container>
        } else {
            view = <LoginController onLogin={this.handleLogin} />
        }
        return (
            <div className="App">
                {view}
            </div>
        )
    }
}


class ProfileInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
        }
    }
    fetchTest = async() =>{
        const response = await fetch(`/user/`)
        console.log('response',response);
        this.setState({ response:response.statusText })
    }
    componentDidMount = () => {
        this.fetchTest();
        // spotifyApi.getMe().then(data => {
        //     this.setState({ user: data.body });
        // });
    }
    render() {
        return (
            <div>
                {this.state.response}
                {this.state.user ? this.state.user.display_name : 'Nope'}
            </div>
        )
    }
}
export default App;
