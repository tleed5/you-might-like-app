import React from 'react';
import AlbumSearch from './AlbumSearch';
import AlbumList from './AlbumList';
import AlbumDisplay from './AlbumDisplay';

import _ from 'lodash';
import { Segment, Icon,Header} from 'semantic-ui-react'

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
        let albums = artistAlbums.map(album=>{
            return {
                title:album.name,
                header:album.name,
                href:album.uri,
                description: album.artists[0].name,
                image:album.images[0].url,
                color:_.sample(colors)
            }
        });
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
    
    render(){
        let list;
        let selected;
        let albums = this.state.albums;
        if(albums.length > 0){
            selected = <AlbumDisplay albums={this.state.selectedAlbums} onAlbumRemove={this.handleRemoveAlbum}/>
            list = <AlbumList albums={albums}/>
        }else{
            list = 
                <Segment placeholder inverted loading={this.state.loading}>
                    <Header icon>
                        <Icon name='search' />
                        You haven't searched for an album yet!
                    </Header>
                </Segment>
        }
        return (
            <div>
                <AlbumSearch spotify={this.props.spotify} onSearchResult={this.handleSearchResult}/>
                {selected}
                {list}
            </div>
        )
    }
}