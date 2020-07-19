const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

// name , email , photo , password , passwordConfirm

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name.'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email.'],
    lowercase: true,
    unique: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: String,
  role: {
    type: String,
    enum: ['user', 'admin', 'guide', 'lead-guide'],
    default: 'user',
  },
  password: {
    type: String,
    minlength: 8,
    required: [true, 'please provide a password min of 8 charecters'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on SAVE or CREATE
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same',
    },
  },
  passwordChangedAt: Date,
});

userSchema.pre('save', async function (next) {
  //This will check if the password is actuall modified or not
  if (!this.isModified('password')) return next();

  //this will hash the password at the cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  //this will delete the passwordconfirm schema
  this.passwordConfirm = undefined;

  next();
});

// Its a instence middleware so it is availaval everywhere where the User is present
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    // we divided and put base 10 in order to make the time format same on both the function ie JWTTimeStamp and passwordChangedAt
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    // console.log(`the changed time stamp is ${changedTimeStamp},the jwt time stamp is ${JWTTimestamp}`);
    return JWTTimestamp < changedTimeStamp;
  }
  //FAlse means not changed
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
