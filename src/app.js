const express = require('express');
const adminRoute = require('./routes/admin')
const userRoute = require('./routes/user')
require('./db/mongoose')

const app = express();

const port = process.env.PORT;

app.use(express.json())
app.use(adminRoute)
app.use(userRoute)



app.listen(port, () => {
    console.log('server listening on port ' + port);
})