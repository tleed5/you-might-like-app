import React from 'react';
import { Card, Segment, Divider, Transition,Icon,Image} from 'semantic-ui-react'
import Sound from 'react-sound';

export default class AlbumList extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            previewUrl:null,
            previewStatus: Sound.status.STOPPED,
            albumClicked: null,
        }
    }
    handleAddToList(album,e){
        this.props.onAddToList(album);
    }
    handleAlbumClick(album,e){
        let track = album.tracks[0];
        let status = this.state.previewStatus;
        let prevAlbumClicked = this.state.albumClicked;
        let newAlbumClicked = album.id;
        this.setState({albumClicked:album.id});
        if(status === 'PLAYING' && prevAlbumClicked === newAlbumClicked){
            this.setState({
                previewStatus:Sound.status.STOPPED
            });
        }else{
            this.setState({
                previewUrl:track.preview_url,
                previewStatus:Sound.status.PLAYING
            });
        }
        this.setState({albumClicked:album.id});

    }
    render(){
        let albums = this.props.albums;
        let divider = albums.length > 0 ? <Divider horizontal inverted>You might like...</Divider> : <Divider horizontal inverted></Divider>;
        const listItems = albums.map((album) =>
            <Card key={album.id} color={album.color}>
                
                <Image src={album.image} onClick={(e)=>this.handleAlbumClick(album,e)}/>
                <Card.Content>
                    <Card.Header>{album.title}</Card.Header>
                    <Card.Meta>
                        <span className='date'>Joined in 2015</span>
                    </Card.Meta>
                    <Card.Description>
                        {album.description}
                    </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <a onClick={(e) => this.handleAddToList(album, e)}><Icon name='add'/>Add to List</a> <br/>
                </Card.Content>
                <Card.Content extra>
                    <a href={album.href}><Icon name='spotify' />Listen To On Spotify</a>
                </Card.Content>
            </Card>
        );
        let player
        if(this.state.previewUrl){
            player = <Sound 
                url={this.state.previewUrl}
                playStatus={this.state.previewStatus}
            />
        } 
        return (
            <div>
                {divider}
                <Segment inverted>
                    {player};
                    
                    <Transition.Group centered stackable as={Card.Group} animation={'fade down'} duration={1000} itemsPerRow={4}>
                        {listItems}
                    </Transition.Group>
                </Segment>
            </div>
        )
    }
}
