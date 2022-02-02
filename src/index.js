import express from 'express'
import frouter from './routers/forum';
import bodyParser from 'body-parser'
const app = express();
const port = process.env.PORT || 8080
// Body parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.get('/', (req, res) => {
  return res.status(200).json({
    status: 200,
    message: 'Welcome to Forum',
  });
})
app.use('/api/v3', frouter);
const server = app.listen(port);
console.log('app running on port ', port);
export default server;