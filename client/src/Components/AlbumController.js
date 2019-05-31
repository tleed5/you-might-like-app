import React from 'react';
import AlbumSearch from './AlbumSearch';
import AlbumList from './AlbumList';
import AlbumDisplay from './AlbumDisplay';
import PlaylistSearch from './PlaylistSearch';
import _ from 'lodash';
import { Segment,Icon,Header,Divider} from 'semantic-ui-react'

export default class AlbumController extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loading:false,
            albums:[],
            selectedAlbums:[],
        };
    }
    getRelated = async() =>{
        this.setState({loading:true});
        let selectedIds = this.state.selectedAlbums.map(album=>{
            return album.id.split(',')[0];
        });
        let spotify = this.props.spotify;
        let artistPromises = [];
        selectedIds.forEach(id=>{
            artistPromises.push(spotify.getArtistRelatedArtists(id));
        })
        let relatedArtists = await Promise.all(artistPromises);

        relatedArtists = _.map(relatedArtists,'body.artists');
        relatedArtists = _.sampleSize(_.map(_.flatten(relatedArtists),'id'),12);
        let albumPromises = relatedArtists.map(artistId=>{
            return spotify.getArtistAlbums(artistId,{limit:1});
        });
        

        let artistAlbums =  await Promise.all(albumPromises);
        artistAlbums = _.flatten(_.map(artistAlbums,'body.items'));
        let colors = ['red','blue','yellow','orange','olive','green','teal','violet','purple','pink'];
        // return {
        //         id:album.artists[0].id+','+album.name,
        //         title:album.name,
        //         header:album.name,
        //         href:album.uri,
        //         preview: album.preview,
        //         description: album.artists[0].name,
        //         image:album.images[0].url,
        //         color:_.sample(colors)
        //     }
        let albumIds = artistAlbums.map(album=>album.id);
        let albums = await spotify.getAlbums(albumIds)
        albums = albums.body.albums.map(album =>{
            return {
                id:album.artists[0].id+','+album.name,
                title:album.name,
                header:album.name,
                href:album.uri,
                tracks: album.tracks.items,
                description: album.artists[0].name,
                image:album.images[0].url,
                color:_.sample(colors)
            }
        });
        console.log(albums);
        albums = _.uniqBy(albums, 'title');
        this.setState({albums:albums,loading:false});
    }
    handleSearchResult = async (result) =>{
        let selectedAlbums = this.state.selectedAlbums;
        selectedAlbums.push(result);
        this.setState({selectedAlbums:selectedAlbums});
        this.getRelated();
    }
    handleRemoveAlbum = (id) =>{
        let selected = this.state.selectedAlbums;
        selected.splice(selected.map((e)=> { return e.id; }).indexOf(id),1);
        this.setState({selectedAlbums:selected});
        this.getRelated();
    }
    handleAddToList = (album) =>{
        let selected = this.state.selectedAlbums;
        selected.push(album);

        let currentAlbums = this.state.albums;
        currentAlbums.splice(currentAlbums.map((e)=> { return e.id; }).indexOf(album.id),1);

        this.setState({
            selectedAlbums:selected,
            albums:currentAlbums
        });
        this.getRelated();
    }
    
    render(){
        let noAlbums;
        let albums = this.state.albums;
        let hasAlbums = albums.length > 0;
        if(!hasAlbums){
            noAlbums = 
                <Segment placeholder inverted loading={this.state.loading}>
                    <Header icon>
                        <Icon name='search' />
                        You haven't searched for an album yet!
                    </Header>
                </Segment>
        }
        
        return (
            <div>
                <PlaylistSearch spotify={this.props.spotify}/>
                <AlbumSearch spotify={this.props.spotify} onSearchResult={this.handleSearchResult}/>
                <AlbumDisplay albums={this.state.selectedAlbums} onAlbumRemove={this.handleRemoveAlbum}/>
                {noAlbums}
                <AlbumList albums={albums} onAddToList={this.handleAddToList}/>
            </div>
        )
    }
}