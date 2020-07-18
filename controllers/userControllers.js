const catchAsync = require('./../utils/catchAsync');
const User = require('./../models/userModels');

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
