require('dotenv').config()
require('./config/database');
let koa = require('koa'),
logger = require('koa-logger'),
router = require('koa-router'),
serve = require('koa-static'),
send = require('koa-send'),
path = require('path');

let app = new koa();

// log all events to the terminal
app.use(logger());
app.use(serve(path.join(__dirname, 'client/build')));
// error handling
app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        ctx.status = err.status || 500;
        ctx.body = err.message;
        ctx.app.emit('error', err, ctx);
    }
});
const mainRouter = new router({
    prefix:'/api/main'
})
const userRouter = new router({
    prefix: '/api/user'
});
require('./src/routes/main')({ mainRouter });
app.use(mainRouter.routes());
app.use(mainRouter.allowedMethods());


require('./src/routes/user')({ userRouter });
app.use(userRouter.routes());
app.use(userRouter.allowedMethods());

app.use(async (ctx) => { 
    await send(ctx, path.join(__dirname, '/client/build/index.html')); 
});
app.listen(process.env.PORT || 8888);
