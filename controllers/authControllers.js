const crypto = require('crypto');
const Email = require('./../utils/email');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModels');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const signInToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signInToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN + 24 * 60 * 60 * 1000
    ),

    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  // This will remove the password
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    // this line of code needs to be deleted because everyone can then register as admin and delete anything
    // role: req.body.role,
  });
  const url = `${req.protocol}://${req.get('host')}/me`;
  await new Email(newUser, url).sendWelcome();
  createSendToken(newUser, 201, res);

  // const token = signInToken(newUser._id);

  // res.status(201).json({
  //   status: 'success',
  //   token,
  //   data: {
  //     user: newUser,
  //   },
  // });
});

exports.login = catchAsync(async (req, res, next) => {
  // 1) check if email and password are present or not
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide Email and Password', 400));
  }
  //2) check if email and password exist and valid or not  // using a "+" sign to make select property to true
  const user = await User.findOne({ email }).select('+password');

  //   console.log(user);

  // 3) compare the password and compare using instance middleware because its availaval

  //   const correct = await user.correctPassword(password, user.password);

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect Email or Password', 401));
  }

  createSendToken(user, 200, res);

  // const token = signInToken(user._id);

  // res.status(200).json({
  //   status: 'success',
  //   token,
  // });
});

exports.logout = async (req, res) => {
  res.cookie('jwt', 'loggedOut', {
    expires: new Date(Date.now() + 5000),
    httpOnly: true,
  });
  res.status(200).json({
    status: 'success',
  });
};

exports.protect = catchAsync(async (req, res, next) => {
  // Getting token and checking if its true
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  // console.log(token);

  if (!token) {
    return next(
      new AppError('You are not logged in ! Please log in to get access', 401)
    );
  }

  // Varification tokens  using promisify ie inbuilt promise returning of node js
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // console.log(decoded);
  //check if user still exists by checking the id still exists or not

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token does not exist', 401)
    );
  }

  // check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        'The user Changed the Id or Password, please log in again',
        401
      )
    );
  }

  //IF the code reaches through this point then its granted the protected route access

  req.user = currentUser;
  res.locals.user = currentUser;

  next();
});

// Only for rendered pages, no errors!
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 3) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles is a array of names passed in userRouter in delete route in restrictTo function
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have Permission to perform this action', 403)
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) check if the user is in DB or not, if no user exist then pass an error
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError('Invalid email', 404));
  }
  // 2) generate random token number
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) send it to user email

  // const message = `Forgot your password ?\ Submit a new PATCH request with a new Password and confirmPassword to \ ${resetURL} \ If you didn't forgot your password, then please ignore this mail.`;

  try {
    // await sendEmail({
    //   email: user.email,
    //   subject: 'Your password reset token (valid for 10 min)',
    //   message,
    // });

    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetPassword/${resetToken}`;

    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    console.log(err);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was an error sending the email. Try again later!',
        500
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1)check for the token to find the user
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) check if the token has expiored and there is user then change the password
  if (!user) {
    return next(new AppError('Token is Invalid or has expired', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 4) Log the user in and send JWT
  createSendToken(user, 200, res);
  // const token = signInToken(user._id);

  // res.status(200).json({
  //   status: 'success',
  //   token,
  // });
});

// exports.updatePassword = catchAsync(async (req, res, next) => {
//   // 1) check for the user in collection

//   const { email, password } = req.body;

//   if (!email || !password) {
//     return next(new AppError('Please provide Email and Password', 400));
//   }

//   // 2) check if current posted password is correct

//   const user = await User.findOne({ email }).select('+password');

//   if (!user || !(await user.correctPassword(password, user.password))) {
//     return next(new AppError('Incorrect Email or Password', 401));
//   }
//   // 3) if user and pass correct update the password

//   user.password = req.body.updatedPassword;
//   user.passwordConfirm = req.body.updatedPasswordConfirm;
//   await user.save();

//   //log user in and send send jwt
// createSendToken(user, 201, res);

//   const token = signInToken(user._id);

//   res.status(200).json({
//     status: 'success',
//     token,
//   });
// });

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select('+password');

  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong.', 401));
  }

  // 3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // User.findByIdAndUpdate will NOT work as intended!

  // 4) Log user in, send JWT
  createSendToken(user, 200, res);
  // const token = signInToken(user._id);

  // res.status(200).json({
  //   status: 'success',
  //   token,
  // });
});
