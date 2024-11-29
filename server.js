const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const bodyParser = require('body-parser');
const SuperAdminRoutes = require('./routes/superAdminRoute')
const empRoutes = require('./routes/employees');
const adminRoutes = require('./routes/admins');
const tempRoutes = require('./routes/templist');
const hostedsitesRoutes = require('./routes/hostedSites')
const performanceRoutes = require('./routes/performance')
const paymentRoutes = require('./routes/payment')
const clientRoutes = require('./routes/clientdetails')
const bugreportRoutes = require('./routes/bugreport')
const taskRoutes = require('./routes/taskReports')


dotenv.config();
const app=express();
const PORT = process.env.PORT || 8000;
const cors = require("cors");


//middle ware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json())
const verifyToken = require('./middleware/superAdminAuth')
//Connect to mongo Db
/* mongoose.connect("mongodb://localhost:27017/super-admin")

.then(()=> console.log('MongoDb Connected'))
.catch(err=> console.error('DB Error',err)); */



mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err));

app.use('/api/auth',SuperAdminRoutes);
app.use('/api/employees',verifyToken, empRoutes);
app.use('/api/templist', tempRoutes);
app.use('/api/hostedsites',hostedsitesRoutes);
app.use('/api/performence',performanceRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/clientdetails',verifyToken, clientRoutes);
app.use('/api/bugreport', bugreportRoutes);
app.use('/api/taskreports', taskRoutes);
app.use('api/admin', SuperAdminRoutes);

// Protected Route (example)

app.listen(PORT ,()=>console.log(`Server Running On PORT  ${PORT}`,process.env.MONGO_URI));

