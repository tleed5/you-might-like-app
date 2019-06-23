const userController = require('../controllers/userController');
const spotifyService = require('../services/spotifyService');


module.exports = ({ userRouter }) => {
    userRouter.get('/', async (ctx, next) => {

    });

    userRouter.get('/login', (ctx, next) => {
        ctx.body = spotifyService.getLoginUrl();
    });

    userRouter.post('/auth', async (ctx, next) => {
        let authCode = ctx.request.body['code'];
        let tokens = await spotifyService.createUserTokens(authCode);
        let user = await spotifyService.getCurrentUser(tokens['access_token']);
        await userController.CreateUser(user.id,tokens['access_token'],tokens['refresh_token'])
        ctx.body = {auth:tokens.access_token};
    });

    userRouter.get('/me',async(ctx,next)=>{
        let authCode = ctx.request.headers['token']
 
        let user = await spotifyService.getCurrentUser(authCode);
        ctx.body = user;
    })
};