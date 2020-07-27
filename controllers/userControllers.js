const catchAsync = require('./../utils/catchAsync');
const User = require('./../models/userModels');
const AppError = require('../utils/appError');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    result: users.length,
    data: {
      users,
    },
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'fail,',
  });
};

exports.updateMe = async (req, res, next) => {
  // 1) check if anything irrelevent present or not like password
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route can only change names if you wish to change the password then please go to /changepassword route',
        400
      )
    );
  }

  // 2) filter out data that are not allowed to be there
  const filteredBody = filterObj(req.body, 'name', 'email');
  // 3) update the document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
};

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'fail,',
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'fail,',
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'fail,',
  });
};
