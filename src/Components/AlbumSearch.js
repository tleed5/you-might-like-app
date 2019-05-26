import React from 'react';
import { Search } from 'semantic-ui-react';
import _ from 'lodash';

const initialState = { isLoading: false, results: [], value: '' }

export default class AlbumSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = initialState
    }
    handleResultSelect = (e, { result }) => {
        this.props.onSearchResult(result);
        this.setState({ value: result.title });
    }
    timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    handleSearchChange = async (e, { value }) => {
        this.setState({ isLoading: true, value });
        if(value.length === 0) this.setState(initialState);
        await this.timeout(500);
        let spotify = this.props.spotify;
        let albums = await spotify.searchAlbums(this.state.value,{limit:5});
        albums = albums.body.albums.items.map(album=>{
            return {
                id:album.artists[0].id+','+album.name,
                title:album.name + ' - ' + album.artists[0].name,
                description: album.release_date,
                image:album.images[0].url,
            }
        });
        albums = _.uniqBy(albums, 'id');
        const re = new RegExp(_.escapeRegExp(this.state.value), 'i');
        const isMatch = albums => re.test(albums.title);
        let filtered =  _.filter(albums, isMatch);
        this.setState({
            isLoading: false,
            results: filtered,
        });
    }

    render() {
        const { isLoading, value, results } = this.state
        return (
            <Search
                fluid
                size={'big'}
                className={'full-width-search'}
                loading={isLoading}
                onResultSelect={this.handleResultSelect}
                onSearchChange={_.debounce(this.handleSearchChange, 500, {
                    leading: true,
                })}
                results={results}
                value={value}
                minCharacters={3}
            />
        )
    }
}