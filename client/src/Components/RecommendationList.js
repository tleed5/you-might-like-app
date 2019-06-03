import React from 'react';
import _ from 'lodash';
import { Divider, Item,Transition,Segment } from 'semantic-ui-react'

export default class RecomendationList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        let tracks = this.props.recommendation;
        let divider = tracks.length > 0 ? <Divider horizontal inverted>Tasty Jam</Divider> : <Divider horizontal inverted></Divider>;
        const colors = ['red', 'blue', 'yellow', 'orange', 'olive', 'green', 'teal', 'violet', 'purple', 'pink'];
        const listItems = tracks.map((track) => {
            let image = track.album.images && track.album.images.length > 0 ? track.album.images[0].url : '';
            return <Item className={'track-background'}>
                <Item.Image size={'tiny'} src={image} />
                <Item.Content verticalAlign='middle'>
                    <Item.Header as='a' >{track.name}</Item.Header>
                    <Item.Meta>{track.album.name}</Item.Meta>
                    <Item.Extra>{track.artist.name}</Item.Extra>
                </Item.Content>
            </Item>
        });
        return (
            <div>
                {divider}
                <Segment>
                    <Item.Group divided unstackable>
                        {listItems}
                    </Item.Group>
                </Segment>
            </div>
        )
    }

}