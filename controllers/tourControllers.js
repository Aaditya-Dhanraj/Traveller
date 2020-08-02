// const fs = require('fs');
// const router = require('../Routes/tourRouter');
const Tour = require('./../models/tourModels');
const factory = require('./handlerFactory');
// const APIFeatures = require('./../utils/apiFeatures');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
// const { Error } = require('mongoose');

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

//ALIAS ROUTS

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,summary,difficulty,ratingsAverage';
  next();
};

// exports.getAllTours = catchAsync(async (req, res, next) => {
//   // exicute query
//   const features = new APIFeatures(Tour.find(), req.query)
//     .filter()
//     .sort()
//     .limitFields()
//     .paginate();

//   const tours = await features.query;

//   res.status(200).json({
//     timeRequested: req.requestedTime,
//     status: 'success',
//     result: tours.length,
//     data: {
//       tours,
//     },
//   });

//   // try {
//   //   // exicute query
//   //   const features = new APIFeatures(Tour.find(), req.query)
//   //     .filter()
//   //     .sort()
//   //     .limitFields()
//   //     .paginate();

//   //   const tours = await features.query;

//   //   res.status(200).json({
//   //     timeRequested: req.requestedTime,
//   //     status: 'success',
//   //     result: tours.length,
//   //     data: {
//   //       tours,
//   //     },
//   //   });
//   // } catch (err) {
//   //   res.send.status(404).json({
//   //     status: 'fail',
//   //     message: 'Invalid request',
//   //   });
//   // }
// });

// exports.getTour = catchAsync(async (req, res, next) => {
//   //   const id = req.params.id * 1;
//   //   console.log(req.params);
//   // const tour = tours.find((el) => el.id === id);
//   // if (!tour) {
//   //   return res.status(404).json({
//   //     status: 'fail',
//   //     message: 'Invalid id',
//   //   });
//   // }

//   const tour = await Tour.findById(req.params.id).populate('reviews');
//   // const tour = await Tour.findOne({_id: req.params.id});
//   if (!tour) {
//     return next(new AppError('No tour found with that ID', 404));
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour,
//     },
//   });
//   // try {
//   //   const tour = await Tour.findById(req.params.id);
//   //   // const tour = await Tour.findOne({_id: req.params.id});
//   //   res.status(200).json({
//   //     status: 'success',
//   //     data: {
//   //       tour,
//   //     },
//   //   });
//   // } catch (err) {
//   //   res.send.status(404).json({
//   //     status: 'fail',
//   //     message: 'Invalid request',
//   //   });
//   // }
// });

// exports.createTour = catchAsync(async (req, res, next) => {
//   //   const newId = tours[tours.length - 1].id + 1;
//   //   const newTour = Object.assign({ id: newId }, req.body);

//   //   tours.push(newTour);
//   //   fs.writeFile(
//   //     `${__dirname}/dev-data/data/tours-simple.json`,
//   //     JSON.stringify(tours),
//   //     (err) => {

//   const newTour = await Tour.create(req.body);
//   res.status(200).json({
//     status: 'success',
//     data: {
//       data: newTour,
//     },
//   });
//   // try {
//   //   const newTour = await Tour.create(req.body);
//   //   res.status(200).json({
//   //     status: 'success',
//   //     data: {
//   //       data: newTour,
//   //     },
//   //   });
//   // } catch (err) {
//   //   res.send.status(404).json({
//   //     status: 'fail',
//   //     message: 'Failed due to some error in submitted',
//   //   });
//   // }

//   //         data: {
//   //           tour: newTour,
//   //         },
// });
//   );
// };

// exports.updateTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//   });
//   if (!tour) {
//     return next(new AppError('No tour found with that ID', 404));
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour,
//     },
//   });
//   // try {
//   //   const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//   //     new: true,
//   //     runValidators: true,
//   //   });
//   //   res.status(200).json({
//   //     status: 'success',
//   //     data: {
//   //       tour,
//   //     },
//   //   });
//   // } catch (err) {
//   //   res.send.status(404).json({
//   //     status: 'fail',
//   //     message: 'Failed due to some error in submitted',
//   //   });
//   // }
// });

// using factory functions
exports.getAllTours = factory.getAll(Tour);
exports.getTour = factory.getOne(Tour, { path: 'reviews' });
exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);

// exports.deleteTour = catchAsync(async (req, res, next) => {
//   //   if (req.params.id * 1 > tours.length) {
//   // res.status(404).json({
//   //   status: 'fail',
//   //   message: 'Invalid Id',
//   // });
//   //   }

//   const tour = await Tour.findByIdAndDelete(req.params.id, req.body);

//   if (!tour) {
//     return next(new AppError('No tour found with that ID', 404));
//   }

//   res.status(204).json({
//     status: 'success',
//     data: null,
//   });
//   // try {
//   //   await Tour.findByIdAndDelete(req.params.id, req.body);
//   //   res.status(204).json({
//   //     status: 'success',
//   //     data: null,
//   //   });
//   // } catch {
//   //   res.send.status(404).json({
//   //     status: 'fail',
//   //     message: 'err',
//   //   });
//   // }
// });

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    // {
    //   $match: { _id: { $ne: 'EASY' } }
    // }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
  // try {
  //   const stats = await Tour.aggregate([
  //     {
  //       $match: { ratingsAverage: { $gte: 4.5 } },
  //     },
  //     {
  //       $group: {
  //         _id: { $toUpper: '$difficulty' },
  //         numTours: { $sum: 1 },
  //         numRatings: { $sum: '$ratingsQuantity' },
  //         avgRating: { $avg: '$ratingsAverage' },
  //         avgPrice: { $avg: '$price' },
  //         minPrice: { $min: '$price' },
  //         maxPrice: { $max: '$price' },
  //       },
  //     },
  //     {
  //       $sort: { avgPrice: 1 },
  //     },
  //     // {
  //     //   $match: { _id: { $ne: 'EASY' } }
  //     // }
  //   ]);

  //   res.status(200).json({
  //     status: 'success',
  //     data: {
  //       stats,
  //     },
  //   });
  // } catch (err) {
  //   res.status(404).json({
  //     status: 'fail',
  //     message: err,
  //   });
  // }
});

exports.getMonthlyPlans = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: { _id: 0 },
    },
    {
      $sort: { numTourStarts: -1 },
    },
    {
      $limit: 12,
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
  // try {
  //   const year = req.params.year * 1;
  //   const plan = await Tour.aggregate([
  //     {
  //       $unwind: '$startDates',
  //     },
  //     {
  //       $match: {
  //         startDates: {
  //           $gte: new Date(`${year}-01-01`),
  //           $lte: new Date(`${year}-12-31`),
  //         },
  //       },
  //     },
  //     {
  //       $group: {
  //         _id: { $month: '$startDates' },
  //         numTourStarts: { $sum: 1 },
  //         tours: { $push: '$name' },
  //       },
  //     },
  //     {
  //       $addFields: { month: '$_id' },
  //     },
  //     {
  //       $project: { _id: 0 },
  //     },
  //     {
  //       $sort: { numTourStarts: -1 },
  //     },
  //     {
  //       $limit: 12,
  //     },
  //   ]);

  //   res.status(200).json({
  //     status: 'success',
  //     data: {
  //       plan,
  //     },
  //   });
  // } catch (err) {
  //   console.log(err);
  //   res.status(404).json({
  //     status: 'fail',
  //     message: err,
  //   });
  // }
});

exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  // radius here is radions which distance divided by radius of earth in miles and kilometer
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
  const [lat, lng] = latlng.split(',');
  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide valid location data in format of latitude, longitude.',
        400
      )
    );
  }
  const tour = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    status: 'success',
    result: tour.length,
    data: {
      data: tour,
    },
  });
});

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  // converting meters into miles and kilometer
  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;
  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide valid location data in format of latitude, longitude.',
        400
      )
    );
  }

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      data: distances,
    },
  });
});
