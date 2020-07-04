const express = require('express');

const app = express();

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'fail,',
  });
};

const createUser = (req, res) => {
  res.status(500).json({
    status: 'fail,',
  });
};

const getUser = (req, res) => {
  res.status(500).json({
    status: 'fail,',
  });
};

const updateUser = (req, res) => {
  res.status(500).json({
    status: 'fail,',
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'fail,',
  });
};

const router = express.Router();

router.route('/').get(getAllUsers).post(createUser);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
