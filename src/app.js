const express = require('express');
const adminRoute = require('./routes/admin')
require('./db/mongoose')

const app = express();

const port = process.env.PORT;

app.use(express.json())
app.use(adminRoute)



app.listen(port, () => {
    console.log('server listening on port ' + port);
})