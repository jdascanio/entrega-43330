import express from 'express';
import { productRouter } from './routes/products.routes.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.send('hola mundo')
})

app.use('/api/products', productRouter )

app.listen(8080, ()=> {
    console.log('listening to port 8080')
})