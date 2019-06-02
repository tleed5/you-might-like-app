import React from 'react';
import AlbumController from './Components/AlbumController';
import LoginController from './Components/LoginController';
import {Container, Menu,Icon,Modal,Header,Button} from 'semantic-ui-react'
import './App.css';

class App extends React.Component {
    constructor(props) {
        super(props);
        let isLoggedIn = true;
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
    handleOpenAbout = (e)=>{
        this.setState({aboutOpen:true})
    }
    handleCloseAbout = (e)=>{
        this.setState({aboutOpen:false})
    }
    render() {
        const isLoggedIn = this.state.isLoggedIn;
        let view;
        if (isLoggedIn) {
            view = 
                <Container>
                    <AlbumController/>
                </Container>
        } else {
            view = <LoginController onLogin={this.handleLogin} isLoggedIn={this.state.isLoggedIn} />
        }
        return (
            <div className="App">
                <Menu icon inverted borderless size='massive'>
                    <Menu.Item header>You Might Like App</Menu.Item>
                    <Menu.Item link href='https://github.com/Zyruis11/you-might-like-app' name='github'>
                        <Icon name='github' />
                    </Menu.Item>
                    <Menu.Item link name='about' onClick={(e)=>this.handleOpenAbout(e)}>
                        <Icon name='question circle outline' />
                    </Menu.Item>
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
