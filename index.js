// SERVER

const Koa = require('koa');
const router = require('koa-router')();
const mount = require('koa-mount');
var bodyParser = require('koa-body');
const URL = require('./globals')

const app = new Koa();


app.use(mount(require('./router/hamburguesa.js')));
app.use(mount(require('./router/ingrediente.js').app));


app.use(router.routes());

const PORT = process.env.PORT || 3000;

app.listen(PORT, function(){
  console.log('Server running on ' + URL)
})