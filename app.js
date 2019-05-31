require('dotenv').config()
const Koa = require('koa');
const logger = require('koa-logger');
const Router = require('koa-router');
const app = new Koa();

// log all events to the terminal
app.use(logger());

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
    prefix: '/user'
});
require('./routes/user')({ userRouter });
app.use(userRouter.routes());
app.use(userRouter.allowedMethods());
app.listen(process.env.PORT || 8888);
