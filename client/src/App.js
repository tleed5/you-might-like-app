import React from 'react';
import AlbumController from './Components/AlbumController';
import LoginController from './Components/LoginController';
import {Container, Menu,Icon,Modal,Header,Button,Image} from 'semantic-ui-react';
import Cookie from 'universal-cookie';
import './App.css';
const cookie = new Cookie();

class App extends React.Component {
    constructor(props) {
        super(props);
        let isLoggedIn = cookie.get('auth') ? true : false;
        this.state = {
            isLoggedIn:isLoggedIn,
            aboutOpen:false,
        };
    }

    //TODO create a session for the user
    handleLogin = () =>{
        this.setState({
            isLoggedIn:true
        });
    }
    handleLogout = () =>{
        this.setState({
            isLoggedIn:false,
        });
        cookie.remove('auth');
    }
    handleOpenAbout = (e)=>{
        this.setState({aboutOpen:true})
    }
    handleCloseAbout = (e)=>{
        this.setState({aboutOpen:false})
    }
    componentDidMount = async()=>{
        let token = cookie.get('auth');

        if(!token){
            return;
        }
        let getUser = await fetch('/api/user/me',{
            method: 'GET',
            headers:{
                'Content-Type': 'application/json',
                'token':token
            }
        }); 

        let foundUser = await getUser.json();
        this.setState({user:foundUser});
    }
    render() {
        const isLoggedIn = this.state.isLoggedIn;
        let view;
        let loginButton;
        if (isLoggedIn) {
            let user = this.state.user;
            console.log(user)
            view = 
                <Container>
                    <AlbumController/>
                </Container>
            if(user){
                // console.log(user)
                // let userImage = user.images[0].url;
                // loginButton=
                // <Menu.Menu position='right'>
                //     <Button color='green' basic inverted animated onClick={(e) => this.handleLogout()}>                        
                //         <Button.Content visible>
                //             <Image src={userImage} avatar />
                //             {user.id}
                //         </Button.Content>
                //         <Button.Content hidden>
                //             Logout?
                //         </Button.Content>
                //     </Button>
                // </Menu.Menu>
            }
        } else {
            view = <LoginController onLogin={this.handleLogin} isLoggedIn={this.state.isLoggedIn} />
            // loginButton = <Menu.Menu position='right'>
            //             <Menu.Item>
            //                 <Button color='green' basic inverted>
            //                     <Icon name='spotify' /> Login With Spotify
            //                 </Button>
            //             </Menu.Item> 
            //         </Menu.Menu>
        }
        return (
            <div className="App">
                <Menu icon inverted secondary borderless>
                    <Menu.Item header>You Might Like App</Menu.Item>
                    <Menu.Item link href='https://github.com/Zyruis11/you-might-like-app' name='github'>
                        <Icon name='github' />
                    </Menu.Item>
                    <Menu.Item link name='about' onClick={(e)=>this.handleOpenAbout(e)}>
                        <Icon name='question circle outline' />
                    </Menu.Item>
                    {loginButton}
                </Menu>
                {view}
                <Modal open={this.state.aboutOpen} basic size='small' onClose={this.handleCloseAbout}>
                    <Header icon='question circle outline' content='About' />
                    <Modal.Content>
                    <p>
                        Stuff about me and this softwaaaaaare
                    </p>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color='green' inverted  onClick={(e)=>this.handleCloseAbout(e)}>
                            <Icon name='close' /> Close
                        </Button>
                    </Modal.Actions>
                </Modal>
            </div>
        )
    }
}
export default App;
