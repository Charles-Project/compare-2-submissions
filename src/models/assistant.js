const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
var uniqueValidator = require('mongoose-unique-validator');

// schema

const assistantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
    },

    password: {
      type: String,
      required: true,
      minlength: 7,
      trim: true,
      validate(value) {
        if (value.toLowerCase().includes("password")) {
          throw new Error('password cannot contain "password"');
        }
      },
    },

    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);


// assistant data to be sent to the client side
assistantSchema.methods.toJSON = function () {
  const assistant = this;
  const assistantObject = assistant.toObject();
  deleteassistantrObject.password;
  delete assistantObject._id;
  return assistantObject;
};

/* this is a method cos the effect 
will be on an instance and an individual assistant(assistant)
*/
assistantSchema.methods.generateAuthToken = async function () {
  const assistant = this;
  const token = jwt.sign({ _id: assistant._id.toString() }, process.env.JWT_SECRET);

  assistant.tokens = assistant.tokens.concat({ token });
  await assistant.save();

  return token;
};



/* this is a static cos the effect
will be on all assistants in the model(assistant)
*/
assistantSchema.statics.findByCredentials = async (email, password) => {
  const assistant = await Assistant.findOne({ email });
  if (!assistant) {
    throw new Error("Unable to login");
  }

  const isMatch = await bcrypt.compare(password, assistant.password);
  if (!isMatch) {
    throw new Error("Unable to login");
  }

  return assistant;
};

// hash the plain text password before saving
assistantSchema.pre("save", async function (next) {
  const assistant = this;

  if (assistant.isModified("password")) {
    assistant.password = await bcrypt.hash(assistant.password, 8);
  }

  next();
});


assistantSchema.plugin(uniqueValidator);

const Assistant = mongoose.model("Assistant", assistantSchema);

module.exports = Assistant;
