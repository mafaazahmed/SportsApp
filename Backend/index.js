const express = require('express')
const app = express()
const port = 3000
const mongoose = require('mongoose');
const cors = require('cors');

main().then(console.log('connected to DB')).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/sportsapp');
}
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(express.static('public'));
app.use(cors());
app.use('/user', require('./routes/user'));
app.use('/product', require('./routes/product'));
app.use('/bill', require('./routes/bill'));

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})