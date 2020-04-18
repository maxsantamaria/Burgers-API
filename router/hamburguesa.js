const Koa = require('koa');
const router = require('koa-router')();
var bodyParser = require('koa-body');
const URL = require('../globals')

const app = new Koa();

const hamburguesas = [
  {
    id: 1,
    nombre: 'Cangreburger',
    precio: 5000,
    descripcion: 'muy buena',
    imagen: null,
    ingredientes: [
      {
        path: 'http://localhost/3000/ingrediente/1'
      }
    ]
  },
  {
    id: 2,
    nombre: 'Cangreburger',
    precio: 5000,
    descripcion: 'muy buena',
    imagen: null,
    ingredientes: [
      {
        path: 'http://localhost/3000/ingrediente/1'
      }
    ]
  }
];

const ingredientes = require('./ingrediente').ingredientes

router.get('/hamburguesa', async (ctx, next) => {
  console.log('hola')
  ctx.body = hamburguesas;
  ctx.response.status = 200
  await next();
});

router.get('/hamburguesa/:id', async (ctx, next) => {
  if (ctx.params.id != parseInt(ctx.params.id)){
    ctx.response.status = 400
    ctx.body = {message: 'ID inválido'}
  }
  else {
    var currHamburguesa = hamburguesas.filter(function(hamburguesa){
      if(hamburguesa.id == ctx.params.id){
        return true;
      }
    })
    if(currHamburguesa.length == 1){
      ctx.body = currHamburguesa[0]
      ctx.response.status = 200
    } else {
      ctx.response.status = 404  // not found
      ctx.body = {message: 'Not Found'}
    }  
  }
  await next()
})


router.post('/hamburguesa', bodyParser(), async (ctx, next) => {
  if(!ctx.request.body.nombre ||
     !ctx.request.body.precio ||
     ctx.request.body.precio != parseInt(ctx.request.body.precio) ||
     !ctx.request.body.descripcion ||
     !ctx.request.body.imagen) {
    ctx.response.status = 400
    ctx.body = {message: 'Wrong input'}
  } else {
    var newId = 1
    if(hamburguesas.length > 0) {
      newId = hamburguesas[hamburguesas.length - 1].id + 1  
    } 
    hamburguesas.push({
      id: newId,
      nombre: ctx.request.body.nombre,
      precio: ctx.request.body.precio,
      descripcion: ctx.request.body.descripcion,
      imagen: ctx.request.body.imagen,
      ingredientes: []
    })
    ctx.body = hamburguesas[hamburguesas.length - 1]
    ctx.response.status = 200
  }
  
})

router.delete('/hamburguesa/:id', async(ctx, next) => {
  console.log('entro', ctx.params.id)
  var removeIndex = hamburguesas.map((hamburguesa) => {
    return hamburguesa.id
  }).indexOf(parseInt(ctx.params.id))

  if(removeIndex === -1){
    ctx.body = {message: 'Hamburguesa inexistente'}
    ctx.response.status = 404
  } else {
    hamburguesas.splice(removeIndex, 1)
    ctx.body = {message: 'Hamburguesa id ' + ctx.params.id + ' eliminado'}
    ctx.response.status = 200
  }
})

router.put('/hamburguesa/:id_hamburguesa/ingrediente/:id_ingrediente',
  async(ctx, next) => {
    var editIndex = hamburguesas.map((hamburguesa) => {
      return hamburguesa.id
    }).indexOf(parseInt(ctx.params.id_hamburguesa))

    if (editIndex === -1) {
      ctx.body = {message: 'Id de hamburguesa invalido'}
      ctx.response.status = 400
    } else {
      var ingredienteIndex = ingredientes.map((ingrediente) => {
        return ingrediente.id
      }).indexOf(parseInt(ctx.params.id_ingrediente))

      if (ingredienteIndex === -1) {
        ctx.body = {message: 'Ingrediente inexistente'}
        ctx.response.status = 404
      } else {
        hamburguesas[editIndex].ingredientes.push({
          'path': URL + '/ingrediente/' + ctx.params.id_ingrediente
        })
        ctx.body = {message: 'Ingrediente agregado'}
        ctx.response.status = 200
      }
    }
  }
)

router.delete('/hamburguesa/:id_hamburguesa/ingrediente/:id_ingrediente',
  async(ctx, next) => {
    var deleteIndex = hamburguesas.map((hamburguesa) => {
      return hamburguesa.id
    }).indexOf(parseInt(ctx.params.id_hamburguesa))

    if (deleteIndex === -1) {
      ctx.body = {message: 'Id de hamburguesa invalido'}
      ctx.response.status = 400
    } else {
      var ingredienteIndex = hamburguesas[deleteIndex].ingredientes.map((ingrediente) => {
        var n = ingrediente.path.lastIndexOf('/')
        console.log(ingrediente.path.slice(n + 1))
        return ingrediente.path.slice(n + 1)
      }).indexOf(ctx.params.id_ingrediente)

      if (ingredienteIndex === -1) {
        ctx.body = {message: 'Ingrediente inexistente en la hamburguesa'}
        ctx.response.status = 404
      } else {
        hamburguesas[deleteIndex].ingredientes.splice(ingredienteIndex, 1)
        ctx.body = {message: 'Ingrediente retirado'}
        ctx.response.status = 200
      }
    }
  }
)

router.patch('/hamburguesa/:id', bodyParser(), async (ctx, next) => {
  if(!ctx.request.body.nombre ||
     !ctx.request.body.precio ||
     ctx.request.body.precio != parseInt(ctx.request.body.precio) ||
     !ctx.request.body.descripcion ||
     !ctx.request.body.imagen) {
    ctx.response.status = 400
    ctx.body = {message: 'Parametros invalidos'}
  } else {
    var editIndex = hamburguesas.map((hamburguesa) => {
      return hamburguesa.id
    }).indexOf(parseInt(ctx.params.id))

    if (editIndex === -1) {
      ctx.body = {message: 'Hamburguesa inexistente'}
      ctx.response.status = 404
    } else {
      hamburguesas.splice(editIndex, 1, {
        ...hamburguesas[editIndex],
        nombre: ctx.request.body.nombre,
        precio: ctx.request.body.precio,
        descripcion: ctx.request.body.descripcion,
        imagen: ctx.request.body.imagen  
      })
      ctx.body = hamburguesas[editIndex]
      ctx.response.status = 200
    }
  }
})

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
    var exists = false;
    for (var i = 0; i < hamburguesas.length; i++) {
      for (var j = 0; j < hamburguesas[i].ingredientes.length; j++) {
        let path = hamburguesas[i].ingredientes[j].path
        if (path.slice(path.lastIndexOf('/') + 1) == parseInt(ctx.params.id)) {
          exists = true
          break
        }
      }
    }
    if (exists) {
      ctx.body = {message: 'Ingrediente no se puede borrar, se encuentra presente en una hamburguesa'}
      ctx.response.status = 409  
    } else{
      ingredientes.splice(removeIndex, 1)
      ctx.body = {message: 'Ingrediente id ' + ctx.params.id + ' eliminado'}
      ctx.response.status = 200  
    }
  }

})


app.use(router.routes())

module.exports = app;