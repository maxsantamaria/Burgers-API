const Koa = require('koa');
const router = require('koa-router')();
var bodyParser = require('koa-body');
const URL = require('../globals')

const app = new Koa();

const ingredientes = [];

router.get('/ingrediente', async (ctx, next) => {
  ctx.body = ingredientes;
  ctx.response.status = 200
  await next();
});

router.get('/ingrediente/:id', async (ctx, next) => {
  if (ctx.params.id != parseInt(ctx.params.id)){
    ctx.response.status = 400
    ctx.body = {message: 'ID inválido'}
  }
  else {
    var currIngrediente = ingredientes.filter(function(ingrediente){
      if(ingrediente.id == ctx.params.id){
        return true;
      }
    })
    if(currIngrediente.length == 1){
      ctx.body = currIngrediente[0]
      ctx.response.status = 200
    } else {
      ctx.response.status = 404  // not found
      ctx.body = {message: 'Not Found'}
    }  
  }
  await next()
})


router.post('/ingrediente', bodyParser(), async (ctx, next) => {
  if(!ctx.request.body.nombre || typeof ctx.request.body.nombre != 'string' || 
     !ctx.request.body.descripcion || typeof ctx.request.body.descripcion != 'string') {
    ctx.response.status = 400
    ctx.body = {message: 'Wrong input'}
  } else {
    var newId = 1
    if(ingredientes.length > 0) {
      newId = ingredientes[ingredientes.length - 1].id + 1  
    } 
    ingredientes.push({
      id: newId,
      nombre: ctx.request.body.nombre,
      descripcion: ctx.request.body.descripcion,
    })
    ctx.body = ingredientes[ingredientes.length - 1]
    ctx.response.status = 200
  }
  
})

/*
router.delete('/ingrediente/:id', async(ctx, next) => {
  console.log('entro', ctx.params.id)
  var removeIndex = ingredientes.map((ingrediente) => {
    return ingrediente.id
  }).indexOf(parseInt(ctx.params.id))


  // FALTA AGREGAR EL RESPONSE 409
  if(removeIndex === -1){
    ctx.body = {message: 'Ingrediente inexistente'}
    ctx.response.status = 404
  } else {
    ingredientes.splice(removeIndex, 1)
    ctx.body = {message: 'Ingrediente id ' + ctx.params.id + ' eliminado'}
    ctx.response.status = 200
  }

})
*/
app.use(router.routes())

module.exports.app = app;
module.exports.ingredientes = ingredientes;