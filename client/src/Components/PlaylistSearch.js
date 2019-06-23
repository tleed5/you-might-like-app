import React from 'react';
import _ from 'lodash';
import { Search,Grid,Dropdown,Divider} from 'semantic-ui-react'

const initialState = { isLoading: false, results: [], value: '' }
let source;
export default class PlaylistSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            options:[],
        }
    }
    componentDidMount = async() => {
        let spotify = this.props.spotify;
        let user = await spotify.getMe();
        let playlists = await spotify.getUserPlaylists(user.body.id);

        playlists = playlists.body.items.map(list=>{
            console.log(list);
            return {
                key:list.id,
                text:list.name,
                value:list.tracks.href,
                image:list.images[0].url
            }
        });
        this.setState({options:playlists});
    }

    handleResultSelect = (e, { result }) => this.setState({ value: result.title })
  
    handleSearchChange = (e, { value }) => {
      this.setState({ isLoading: true, value })
  
      setTimeout(() => {
        if (this.state.value.length < 1) return this.setState(initialState)
  
        const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
        const isMatch = result => re.test(result.title)
        this.setState({
          isLoading: false,
          results: _.filter(source, isMatch),
        })
      }, 300)
    }
  
    render() {
      const { isLoading, value, results } = this.state
  
      return (
        <Grid>
          <Grid.Column width={6}>
            <Dropdown 
                placeholder='Select Playlist'
                fluid
                search
                selection
                options={this.state.options}
            />
          </Grid.Column>
        </Grid>
      )
    }
}