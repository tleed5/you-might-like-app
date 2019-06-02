const userController = require('../controllers/userController');
const spotifyService = require('../services/spotifyService');


module.exports = ({ userRouter }) => {
    userRouter.get('/', async (ctx, next) => {

    });

    userRouter.get('/login', (ctx, next) => {
        
    });

    userRouter.get('/auth', async (ctx, next) => {
        // let authCode = ctx.query.code;
        spotifyService.Authenticate();
    });
};