const SpotifyWebApi = require('spotify-web-api-node');
const _ = require('lodash')

const scopes = ['user-read-private', 'user-read-email'];
const redirectUri = 'http://localhost:8888/user/auth';
const clientId = process.env.SPOTIFY_CLIENT;
const secret = process.env.SPOTIFY_SECRET;
const state = 'some-state-of-my-choice';
const spotifyApi = new SpotifyWebApi({
    redirectUri: redirectUri,
    clientId: clientId,
    clientSecret: secret,
});

module.exports = {
    isAuthenticated: false,

    getLoginUrl() {
        return spotifyApi.createAuthorizeURL(scopes, state);
    },
    //Creates a user authentication token.
    async createUserTokens() {
        let data = await spotifyApi.authorizationCodeGrant(authCode);
    },
    //Authenticates a user using their ID.
    async authenticateUser(id) {

        console.log('TODO');
        // spotifyApi.setAccessToken(data.body['access_token']);
        // spotifyApi.setRefreshToken(data.body['refresh_token']);
    },
    async authenticate() {
        console.log('authenticating...')
        let data = await spotifyApi.clientCredentialsGrant();
        spotifyApi.setAccessToken(data.body['access_token']);
        this.isAuthenticated = true;
        setTimeout(() => {
            console.log('time to reset token');
            this.isAuthenticated = false;
        }, data.body['expires_in'] * 1000); 
    },
    async getCurrentUser() {
        let me = await spotifyApi.getUser('zyruis');
        console.log(me)
    },

    async search(query) {
        try{
            if(!query){
                return {
                    statusCode:400,
                    body:'No Query'
                }
            }
            if(!this.isAuthenticated){
                await this.authenticate();
            }
            let search = await spotifyApi.search(query, ['album', 'artist'],{ limit : 10 });
            
            let albumsArray = search.body['albums']['items'];
            let artistArray = search.body['artists']['items'];

            //Format the data into a format we want
            albumsArray = albumsArray.map(album=>{
                return {
                    id: album.id,
                    name:album.name,
                    artist:{
                        id:album.artists[0].id,
                        name: album.artists[0].name,
                        uri:album.artists[0].uri,
                        url: album.artists[0].external_urls
                    },
                    images:album.images,
                    uri: album.uri,
                    url: album.external_urls,
                    type:'album',
                }
            });

            artistArray = artistArray.map(artist=>{
                return {
                    id: artist.id,
                    name: artist.name,
                    genres: artist.genres,
                    images: artist.images,
                    uri: artist.uri,
                    url:artist.external_urls,
                    type:'artist'
                }
            });

            let returnObject = {
                body:{
                    artists:artistArray,
                    albums:albumsArray,
                },
                artistCount:artistArray.length,
                albumCount:albumsArray.length,
                statusCode:200
            }

            return returnObject;
        }catch(err){
            console.log(err);
        }  
    },
    //ArtistIds = array of strings of artist ids.
    async getRelated(artistIds){
        try{
            if(!this.isAuthenticated){
                await this.authenticate();
            }
            let artistPromises = [];
            if(artistIds.length === 0){
                return {
                    statusCode:400,
                    body:'No Query'
                }
            }
            artistIds.forEach(id=>{
                artistPromises.push(spotifyApi.getArtistRelatedArtists(id));
            });

            let resolved = await Promise.all(artistPromises);
            let artistsArray = _.sampleSize(_.flatten(_.map(resolved,'body.artists')),10);
            let artistAlbumsPromises = [];
            artistsArray = artistsArray.map(artist=>{
                artistAlbumsPromises.push(spotifyApi.getArtistAlbums(artist.id,{album_type : 'album',limit:1}));
                return {
                    id: artist.id,
                    name: artist.name,
                    genres: artist.genres,
                    images: artist.images,
                    uri: artist.uri,
                    url:artist.external_urls,
                    type:'artist'
                }
            });
            
            let resolvedAlbums = await Promise.all(artistAlbumsPromises);
            let albumIds = _.map(_.flatten(_.map(resolvedAlbums,'body.items')),'id');
            let albums = await spotifyApi.getAlbums(albumIds);

            let albumsArray = albums.body['albums'];
            albumsArray = albumsArray.map(album=>{
                return {
                    id: album.id,
                    name:album.name,
                    artist:{
                        id:album.artists[0].id,
                        name: album.artists[0].name,
                        uri:album.artists[0].uri,
                        url: album.artists[0].external_urls
                    },
                    images:album.images,
                    uri: album.uri,
                    url: album.external_urls,
                    tracks:album.tracks,
                    type:'album'
                }   
            });
            return {
                body:{
                    artists:artistsArray,
                    albums:albumsArray
                },
                artistCount:artistsArray.length,
                albumCount:albumsArray.length,
                statusCode:200
            }
        }catch(err){
            console.error(err);
        }
    },
    async getRecommendationPlaylist(artistSeeds,trackSeeds,genreSeeds){
        //TODO creates a playlist based on seeded data
        if(!this.isAuthenticated){
            await this.authenticate();
        }
        let recommendation = await spotifyApi.getRecommendations({seed_artists:artistSeeds});
        recommendation = recommendation.body['tracks'].map(track=>{
            return {
                id:track.id,
                name:track.name,
                album: {
                    id:track.album.id,
                    name:track.album.name,
                    uri:track.album.uri,
                    url:track.album.external_urls,
                    images:track.album.images
                },
                artist:{
                    id:track.artists[0].id,
                    name: track.artists[0].name,
                    uri:track.artists[0].uri,
                    url: track.artists[0].external_urls
                },
                preview_url:track.preview_url,
                url: track.external_urls,
                uri: track.uri,
                type:'track',
            }
        })
        return {
            body:{
                recommendation:recommendation
            },
            trackCount:recommendation.length,
            statusCode:200,
        }
        //Uses the spotify https://developer.spotify.com/documentation/web-api/reference/browse/get-recommendations/
    }
}