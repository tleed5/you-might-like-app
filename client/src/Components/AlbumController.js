import React from 'react';
import AlbumSearch from './AlbumSearch';
import AlbumList from './AlbumList';
import AlbumDisplay from './AlbumDisplay';
import PlaylistSearch from './PlaylistSearch';
import _ from 'lodash';
import AwesomeDebouncePromise from 'awesome-debounce-promise';

import { Segment,Icon,Header,Dimmer,Loader} from 'semantic-ui-react'

const getRelatedApi = async(query) => fetch('/api/main/getRelated?artists='+encodeURI(query));
const getRelatedDebounce = AwesomeDebouncePromise(getRelatedApi,500);

export default class AlbumController extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loading:false,
            relatedAlbums:[],
            selected:[],
        };
    }
    getRelated = async() =>{
        this.setState({loading:true});
        let selectedIds = this.state.selected.map(e=>{
            if(e.type === 'album') return e.artist.id;

            return e.id;
        });
        const relatedRes = await getRelatedDebounce(selectedIds.join(','));
        const parsed = await relatedRes.json();
        let relatedAlbums = _.uniqBy(parsed.body.albums,'id');
        this.setState({relatedAlbums:relatedAlbums,loading:false});
    }
    handleSearchResult = async (result) =>{
        let selected = this.state.selected;        
        selected.push(result);
        this.setState({selected:selected});
        this.getRelated();
    }
    handleRemoveAlbum = (id) =>{
        let selected = this.state.selected;
        let relatedAlbums = this.state.relatedAlbums;
        selected.splice(selected.map((e)=> { return e.id; }).indexOf(id),1);
        if(selected.length === 0){
            relatedAlbums = [];
        }
        this.setState({selected:selected,relatedAlbums:relatedAlbums});
        if(selected.length > 0){
            this.getRelated();
        }
    }
    handleAddToList = (album) =>{
        let selected = this.state.selected;
        selected.push(album);
        let currentAlbums = this.state.relatedAlbums;
        currentAlbums.splice(currentAlbums.map((e)=> { return e.id; }).indexOf(album.id),1);
        this.setState({
            selected:selected,
            relatedAlbums:currentAlbums
        });
        this.getRelated();
    }
    
    render(){
        let noAlbums;
        let relatedAlbums = this.state.relatedAlbums;
        let hasAlbums = relatedAlbums.length > 0;
        if(!hasAlbums){
            noAlbums = 
                <Segment inverted>
                    <Dimmer inverted active={this.state.loading}>
                        <Loader inverted active={this.state.loading}></Loader>
                    </Dimmer>
                    <Header icon>
                        <Icon name='search' />
                        You haven't searched for an album yet!
                    </Header>
                </Segment>
        }
        
        return (
            <div>
                <AlbumSearch onSearchResult={this.handleSearchResult}/>
                <AlbumDisplay albums={this.state.selected} onAlbumRemove={this.handleRemoveAlbum}/>
                {/* <PlaylistSearch spotify={this.props.spotify}/> */}
                {noAlbums}
                <AlbumList albums={relatedAlbums} onAddToList={this.handleAddToList}/>
            </div>
        )
    }
}