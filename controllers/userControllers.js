const catchAsync = require('./../utils/catchAsync');
const User = require('./../models/userModels');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// exports.getAllUsers = catchAsync(async (req, res, next) => {
//   const users = await User.find();

//   res.status(200).json({
//     status: 'success',
//     result: users.length,
//     data: {
//       users,
//     },
//   });
// });

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'fail,',
  });
};

exports.updateMe = catchAsync(async (req, res, next) => {
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
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getAllUsers = factory.getAll(User);

exports.getUser = factory.getOne(User);

// do not update password with this because in update function no save querry is runned
exports.updateUser = factory.updateOne(User);

exports.deleteUser = factory.deleteOne(User);
