import React from 'react';
import { Card, Divider, Segment, Icon, Transition,Image } from 'semantic-ui-react'

export default class AlbumDisplay extends React.Component {

    handleClick(id, e) {
        this.props.onAlbumRemove(id);
    }
    render() {
        let albums = this.props.albums;
        const listItems = albums.map((album) => {
            let description = album.genres ? album.genres.join(', ') : album.artist.name;

            return <Card raised key={album.id}>
                    <Image src={album.images[0].url} />
                <Card.Content textAlign={'center'}>
                    <Card.Header>{album.name}</Card.Header>
                    <Card.Description>
                        {description}
                    </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <a onClick={(e) => this.handleClick(album.id, e)}><Icon name='remove'/>Remove</a>
                </Card.Content>
            </Card>
        });
        let divider = albums.length > 0 ? <Divider horizontal inverted>Since you like</Divider> : <Divider horizontal inverted></Divider>;
        return (
            <div>
                {divider}
                <Segment basic>
                    <Transition.Group centered stackable as={Card.Group} duration={1000} itemsPerRow={5}>
                        {listItems}
                    </Transition.Group>
                </Segment>
            </div>
        )
    }
}