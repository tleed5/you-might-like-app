import React from 'react';
import { Search,Input } from 'semantic-ui-react';
import _ from 'lodash';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
const initialState = { isLoading: false, results: [], value: '' }

const searchApi = async(query) => fetch('/api/main/search?query='+encodeURIComponent(query));
const search = AwesomeDebouncePromise(searchApi,500);
export default class AlbumSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = initialState
    }
    handleResultSelect = (e, { result }) => {
        this.props.onSearchResult(result.data);
        this.setState({ value: result.title });
    }
    handleSearchChange = async (e, { value }) => {
        this.setState({ isLoading: true, value });
        if(value.length === 0) this.setState(initialState);
        const searchRes = await search(value);
        const parsed = await searchRes.json();
        
        let results = _.flatMap(parsed.body,(element)=>{
           return element; 
        });
        results = results.map(e=>{
            let artist = e.artist ? e.artist.name : '';
            let description = e.genres ? e.genres.join(', ') : artist;
            let image = e.images && e.images.length > 0 ? e.images[0].url : '';
            return {
                id:e.id,
                key:e.id,
                title:e.name,
                image:image,
                description:description,
                data:e,
            };
        });
        if (this.state.value.length < 1) return this.setState(initialState)

        const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
        const isMatch = result => re.test(result.title)

        this.setState({
            isLoading: false,
            results: _.filter(results, isMatch),
        });
    }

    render() {
        const { isLoading, value, results } = this.state
        return (
            <Search
                fluid
                centered
                className={'full-width-search'}
                loading={isLoading}
                onResultSelect={this.handleResultSelect}
                onSearchChange={this.handleSearchChange}
                results={results}
                value={value}
                minCharacters={3}
            />
        )
    }
}