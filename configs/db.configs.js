require('dotenv').config()
const mongoose = require('mongoose')

MONGODB_URI = process.env.MONGO_URI


mongoose.connect(MONGODB_URI)
   .then(() => {
       console.info(`Connected to the database: ${MONGODB_URI}`)
   })
   .catch(error => {
       console.error('Database connection error:', error);
   });