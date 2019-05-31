require('dotenv').config()
require('./config/database');
let Koa = require('koa');
let logger = require('koa-logger');
let Router = require('koa-router');
let serve = require('koa-static');
let send = require('koa-send');
let path = require('path');
let app = new Koa();

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

const userRouter = new Router({
    prefix: '/api/user'
});
require('./src/routes/user')({ userRouter });
app.use(userRouter.routes());
app.use(userRouter.allowedMethods());

app.use(async (ctx) => { 
    await send(ctx, path.join(__dirname, '/client/build/index.html')); 
});
app.listen(process.env.PORT || 8888);
