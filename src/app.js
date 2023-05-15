import express from 'express';
import handlebars from 'express-handlebars'
import { productRouter } from './routes/products.routes.js';
import { cartRouter } from './routes/carts.routes.js';
import { viewsRouter } from './routes/views.routes.js';
import { products, configSocketServer } from './utils.js';
import { Server } from 'socket.io';


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.engine('handlebars', handlebars.engine()) 
app.set('views', './views')
app.set('view engine', 'handlebars')
app.use(express.static ('./public'))

app.use('/', viewsRouter)

app.use('/api/products', productRouter )
app.use('/api/carts', cartRouter )


const httpServer = app.listen(8080, ()=> {
    console.log('listening to port 8080')
})

const socketServer = configSocketServer(httpServer);

export { socketServer }
