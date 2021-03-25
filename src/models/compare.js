const mongoose = require("mongoose");
var uniqueValidator = require('mongoose-unique-validator');

//Student Schema

const compareSchema = new mongoose.Schema(
  {
  Student1:{
    name: {
      type: String,
      required: true,
      trim: true,
    //   unique: true,
    },
    txt:{
         type: String,
         default: "",
    },
  },

 Student2:{
    name: {
      type: String,
      required: true,
      trim: true,
    //   unique: true,
    },
    txt:{
        type: String,
        default: "",
    },
  },

  compareResult:{
     type: String,
     default: "",
  },

  percentage:{
      type: Number,
      default: 0
  }


  },
  {
    timestamps: true,
  }
);


// user data to be sent to the client side
// studentSchema.methods.toJSON = function () {
//   const student = this;
//   const studentObject = student.toObject();
//   delete studentObject._id;

//   return studentObject;
// };


compareSchema.plugin(uniqueValidator);

const Compare = mongoose.model("Compare", compareSchema);

module.exports = Compare;
