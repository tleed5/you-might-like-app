import React from 'react';
import { Card, Segment, Divider} from 'semantic-ui-react'

export default class AlbumList extends React.Component {
    render(){
        let albums = this.props.albums;
        return (
            <div>
                <Divider horizontal inverted>You might like...</Divider>
                <Segment inverted>
                    <Card.Group centered itemsPerRow={6} items={albums} />
                </Segment>
            </div>
        )
    }
}
