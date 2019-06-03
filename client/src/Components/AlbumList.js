import React from 'react';
import { Card, Segment, Divider, Transition,Icon,Image,Dimmer,Header} from 'semantic-ui-react'
import Sound from 'react-sound';
import _ from 'lodash';
export default class AlbumList extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            previewUrl:null,
            previewStatus: Sound.status.STOPPED,
            selectedAlbum:{
                isPlaying:false,
            }
        }
    }
    handleAddToList(album,e){
        this.props.onAddToList(album);
    }
    handleAlbumClick(album,e){
        let tracks = album.tracks.items;

        let previewUrls = _.map(tracks,'preview_url');
        let status = this.state.previewStatus;
        let prevAlbumClicked = this.state.selectedAlbum;
        let newAlbumClicked = album;
        newAlbumClicked.isPlaying = true;
        prevAlbumClicked.isPlaying = false;

        this.setState({
            selectedAlbum:newAlbumClicked,
        });
        if(status === 'PLAYING' && prevAlbumClicked.id === newAlbumClicked.id){
            this.setState({
                previewStatus:Sound.status.STOPPED
            });
        }else{
            this.setState({
                previewUrl:_.sample(previewUrls),
                previewStatus:Sound.status.PLAYING
            });
        }
    }
    render(){
        let albums = this.props.albums;
        let divider = albums.length > 0 ? <Divider horizontal inverted>You might like</Divider> : <Divider horizontal inverted></Divider>;
        const colors = ['red','blue','yellow','orange','olive','green','teal','violet','purple','pink'];
        let columnCount = this.props.hasRecommendation ? 3 : 5;
        const listItems = albums.map((album) =>{
            let artist = album.artist ? album.artist.name : '';
            let image = album.images && album.images.length > 0 ? album.images[0].url : '';

            return <Card raised key={album.id} color={_.sample(colors)}>                
                <Dimmer.Dimmable dimmed={album.isPlaying}  onClick={(e)=>this.handleAlbumClick(album,e)}>
                    <Image src={image}/>
                    <Dimmer active={album.isPlaying} >
                        <Header as='h2' icon inverted>
                            <Icon name='play circle outline' />
                            <Header.Subheader>Playing Preview</Header.Subheader>
                        </Header>
                    </Dimmer>
                </Dimmer.Dimmable>
                <Card.Content textAlign={'center'}>
                    <Card.Header>{album.name}</Card.Header>
                    <Card.Meta>
                        <span className='date'>{artist}</span>
                    </Card.Meta>
                </Card.Content>
                <Card.Content extra>
                    <a onClick={(e) => this.handleAddToList(album, e)}><Icon name='add'/>Add to List</a> <br/>
                </Card.Content>
                <Card.Content extra>
                    <a href={album.uri}><Icon name='spotify' />Listen To On Spotify</a>
                </Card.Content>
            </Card>
        });
        let player
        if(this.state.previewUrl){
            player = <Sound 
                url={this.state.previewUrl}
                playStatus={this.state.previewStatus}
                volume={10}
            />
        } 
        return (
            <div>
                {divider}
                <Segment basic>
                    {player}
                    <Transition.Group centered stackable as={Card.Group} animation={'fade down'} duration={1000} itemsPerRow={columnCount}>
                        {listItems}
                    </Transition.Group>
                </Segment>
            </div>
        )
    }
}
