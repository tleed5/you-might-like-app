import React from 'react';
import { Card,Divider,Segment,Icon,Transition } from 'semantic-ui-react'

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
        let divider = albums.length > 0 ? <Divider horizontal inverted>Since you like...</Divider> : <Divider horizontal inverted></Divider>;
        return (
            <div>
                {divider}
                <Segment inverted>
                    <Transition.Group as={Card.Group} centered itemsPerRow={3} duration={1000} size='huge'>
                        {listItems}
                    </Transition.Group>
                </Segment>
            </div>
        )
    }
}