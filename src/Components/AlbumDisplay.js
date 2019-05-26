import React from 'react';
import { Card,Divider,Segment,Icon } from 'semantic-ui-react'

export default  class AlbumDisplay extends React.Component {

    handleClick(id,e){
        this.props.onAlbumRemove(id);
    }
    render(){
        let albums = this.props.albums;
        const listItems = albums.map((album) =>
            <Card
                key={album.id}
                image={album.image}
                header={album.title}
                description={album.description}
                extra={<a onClick={(e) => this.handleClick(album.id, e)}><Icon name='remove'/>Remove</a>}
            />
        );
        return (
            <div>
                <Divider horizontal inverted>Since you like...</Divider>
                <Segment inverted>
                    <Card.Group centered itemsPerRow={3}> 
                        {listItems}
                    </Card.Group>
                </Segment>
            </div>
        )
    }
}