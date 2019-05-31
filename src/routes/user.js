const SpotifyWebApi = require('spotify-web-api-node');
const scopes = ['user-read-private', 'user-read-email'];
const redirectUri = 'http://localhost:8888/user/auth';
const clientId = process.env.SPOTIFY_CLIENT;
const secret = process.env.SPOTIFY_SECRET;
const state = 'some-state-of-my-choice';
// var User = require('../models/user');
const spotifyApi = new SpotifyWebApi({
    redirectUri: redirectUri,
    clientId: clientId,
    clientSecret: secret,
});
module.exports = ({ userRouter }) => {
    userRouter.get('/', async (ctx, next) => {
        ctx.body = 'Hello World1231!';
    });

    userRouter.get('/login', (ctx, next) => {
        ctx.body = spotifyApi.createAuthorizeURL(scopes, state);
    });

    userRouter.get('/auth', async (ctx, next) => {
        let authCode = ctx.query.code;
        let data = await spotifyApi.authorizationCodeGrant(authCode);
        spotifyApi.setAccessToken(data.body['access_token']);
        spotifyApi.setRefreshToken(data.body['refresh_token'])

        ctx.body = await spotifyApi.getMe();
    });
};