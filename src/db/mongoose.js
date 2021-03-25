const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

// MONGODB_URL=mongodb+srv://linkvee:computer123@cluster0.rvy15.azure.mongodb.net/lykvee?retryWrites=true&w=majority