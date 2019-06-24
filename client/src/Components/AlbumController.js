import React from 'react';
import AlbumSearch from './AlbumSearch';
import AlbumList from './AlbumList';
import AlbumDisplay from './AlbumDisplay';
import PlaylistSearch from './PlaylistSearch';
import RecomendationList from './RecommendationList';
import _ from 'lodash';
import AwesomeDebouncePromise from 'awesome-debounce-promise';

import { Segment,Icon,Header,Dimmer,Loader,Button,Grid} from 'semantic-ui-react'

const getRelatedApi = async(query) => fetch('/api/main/getRelated?artists='+encodeURI(query));
const getRelatedDebounce = AwesomeDebouncePromise(getRelatedApi,500);

const getRecomendationApi = async(query) => fetch('/api/main/getRecommendation?artists='+encodeURI(query));

export default class AlbumController extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loadingAlbums:false,
            loadingRecomendations:false,
            relatedAlbums:[],
            recommendation:[],
            selected:[],
        };
    }
    getRelated = async() =>{
        this.setState({loadingAlbums:true});
        let selectedIds = this.state.selected.map(e=>{
            if(e.type === 'album') return e.artist.id;

            return e.id;
        });
        const relatedRes = await getRelatedDebounce(selectedIds.join(','));
        const parsed = await relatedRes.json();
        let relatedAlbums = _.uniqBy(parsed.body.albums,'id');
        this.setState({relatedAlbums:relatedAlbums,loadingAlbums:false});
    }
    getRecomendation = async() =>{
        this.setState({loadingRecomendations:true});
        let relatedAlbums = this.state.relatedAlbums;
        let artistIds = _.map(relatedAlbums,'artist.id');
        if(artistIds.length > 5){
            artistIds = _.sampleSize(artistIds,5);
        }
        const recommendation = await getRecomendationApi(artistIds);
        const parsed = await recommendation.json();
        this.setState({recommendation:parsed.body.recommendation,loadingRecomendations:false});
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
        let recommendation = this.state.recommendation;
        let hasRecommendation = recommendation.length > 0;
        let albumListSize = hasRecommendation ? 10 : 16;
        let playlist;
        if(hasRecommendation){
            playlist = 
            <Grid.Column>
                <RecomendationList recommendation={recommendation}/>
            </Grid.Column>
        }
        if(!hasAlbums){
            noAlbums = 
                <Segment basic>
                    <Dimmer inverted active={this.state.loadingAlbums}>
                        <Loader inverted active={this.state.loadingAlbums}></Loader>
                    </Dimmer>
                    <Header inverted textAlign='center' icon>
                        <Icon name='search' />
                        Try Searching for an Artist Or Album!
                    </Header>
                </Segment>
        }
        return (
            <div>
                <Grid columns='equal' stackable doubling divided inverted padded>
                    <Grid.Row centered>
                        <Grid.Column width={10}>
                            <AlbumSearch onSearchResult={this.handleSearchResult}/>
                        </Grid.Column>
                        <Grid.Column>
                            <Button basic inverted color='green' animated fluid disabled={!hasAlbums} onClick={this.getRecomendation} loading={this.state.loadingRecomendations}>
                                <Button.Content visible>Get Reccomendation Playlist</Button.Content>
                                <Button.Content hidden>
                                    <Icon name='arrow right' />
                                </Button.Content>
                            </Button>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row centered>
                        <Grid.Column width={16}>
                            <AlbumDisplay albums={this.state.selected} onAlbumRemove={this.handleRemoveAlbum}/>
                        </Grid.Column>
                        
                    </Grid.Row>
                    <Grid.Row centered>
                        <Grid.Column width={albumListSize}>
                            <AlbumList albums={relatedAlbums} onAddToList={this.handleAddToList} hasRecommendation={hasRecommendation}/>
                            {noAlbums}
                        </Grid.Column>
                        {playlist}
                    </Grid.Row>
                    {/* <PlaylistSearch spotify={this.props.spotify}/> */}
                </Grid>
            </div>
        )
    }
}