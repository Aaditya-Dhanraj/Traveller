// const fs = require('fs');
const router = require('../Routes/tourRouter');
const Tour = require('../models/tourModels');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// exports.checkId = (req, res, next, val) => {
//   console.log(`The id is ${val}`);
//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid id',
//     });
//   }
//   next();
// };

// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'Bad Request price or name is not avail',
//     });
//   }
//   next();
// };

exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();

    res.status(200).json({
      timeRequested: req.requestedTime,
      status: 'success',
      result: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.send.status(404).json({
      status: 'fail',
      message: 'Invalid request',
    });
  }
};

exports.getTour = async (req, res) => {
  //   const id = req.params.id * 1;
  //   console.log(req.params);
  // const tour = tours.find((el) => el.id === id);
  // if (!tour) {
  //   return res.status(404).json({
  //     status: 'fail',
  //     message: 'Invalid id',
  //   });
  // }
  try {
    const tour = await Tour.findById(req.params.id);
    // const tour = await Tour.findOne({_id: req.params.id});
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.send.status(404).json({
      status: 'fail',
      message: 'Invalid request',
    });
  }
};

exports.createTour = async (req, res) => {
  //   const newId = tours[tours.length - 1].id + 1;
  //   const newTour = Object.assign({ id: newId }, req.body);

  //   tours.push(newTour);
  //   fs.writeFile(
  //     `${__dirname}/dev-data/data/tours-simple.json`,
  //     JSON.stringify(tours),
  //     (err) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(200).json({
      status: 'success',
      data: {
        data: newTour,
      },
    });
  } catch (err) {
    res.send.status(404).json({
      status: 'fail',
      message: 'Failed due to some error in submitted',
    });
  }

  //         data: {
  //           tour: newTour,
  //         },
};
//   );
// };

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.send.status(404).json({
      status: 'fail',
      message: 'Failed due to some error in submitted',
    });
  }
};

exports.deleteTour = async (req, res) => {
  //   if (req.params.id * 1 > tours.length) {
  // res.status(404).json({
  //   status: 'fail',
  //   message: 'Invalid Id',
  // });
  //   }
  try {
    await Tour.findByIdAndDelete(req.params.id, req.body);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch {
    res.send.status(404).json({
      status: 'fail',
      message: 'err',
    });
  }
};
