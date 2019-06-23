const spotifyService = require('../services/spotifyService');

module.exports = ({ mainRouter }) => {
    mainRouter.get('/', async (ctx, next) => {
        console.log('main route');
    });
    mainRouter.get('/search', async(ctx, next) => {
        let searchQuery = ctx.query.query;
        ctx.body = await spotifyService.search(searchQuery);
    });
    mainRouter.get('/getRelated',async(ctx,next)=>{
        let artistIds = ctx.query.artists.split(',');
        ctx.body = await spotifyService.getRelated(artistIds);
    });
    mainRouter.get('/getRecommendation',async(ctx,next)=>{
        let artistSeeds = ctx.query.artists.split(',');
        ctx.body = await spotifyService.getRecommendationPlaylist(artistSeeds);
    });
    mainRouter.post('/savePlaylist', async(ctx,next)=>{
        let trackIds =  ctx.request.body['trackIds'];
        let authCode = ctx.request.headers['token']
        console.log(trackIds,authCode);
        await spotifyService.savePlaylist(authCode,trackIds);

        ctx.body = 'doot';
    })
};