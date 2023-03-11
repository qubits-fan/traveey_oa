const bodyParser = require('body-parser')
      express = require('express'), 
      mysql  = require('mysql'),
      dotenv = require('dotenv')
      util = require('util')
      employeeRouter = require('./routers/employee')
      taskRouter = require('./routers/task')
      app = express()




dotenv.config()

// DATABASE CONNECT


const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME

})

db.connect((err)=>{
    if(err) throw err;
    console.log('Database Connected successful')
})

global.db = db;
global.dbquery = util.promisify(db.query).bind(db)

// MIDDLEWARES
app.use(express.json())
app.use(express.urlencoded({extended: false}))

// Routes
app.use(employeeRouter)
app.use(taskRouter)



// PORT
const port = process.env.PORT || 3000;



// PORT Binding
app.listen(port, ()=>{
    console.log(`Server is listening on ${port}`)
})