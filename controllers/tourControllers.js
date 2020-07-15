// const fs = require('fs');
const router = require('../Routes/tourRouter');
const Tour = require('../models/tourModels');
const { Error } = require('mongoose');

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

class APIFeatures {
  constructor(query, queryString) {
    query = this.query;
    queryString = this.queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);

    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    // console.log(JSON.parse(queryStr));

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      console.log(sortBy);
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

exports.getAllTours = async (req, res) => {
  try {
    // const tours = await Tour.find();

    // Build a query
    // const queryObj = { ...req.query };
    // const excludedFields = ['page', 'sort', 'limit', 'fields'];
    // excludedFields.forEach((el) => delete queryObj[el]);

    //advance filtering
    // let queryStr = JSON.stringify(queryObj);

    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    // console.log(JSON.parse(queryStr));

    // let query = Tour.find(JSON.parse(queryStr));

    //Sorting
    // if (req.query.sort) {
    //   const sortBy = req.query.sort.split(',').join(' ');
    //   console.log(sortBy);
    //   query = query.sort(sortBy);
    // } else {
    //   query = query.sort('-createdAt');
    // }

    //Limit fields
    // if (req.query.fields) {
    //   const fields = req.query.fields.split(',').join(' ');
    //   query = query.select(fields);
    // } else {
    //   query = query.select('-__v');
    // }

    //Pagination
    // const page = req.query.page * 1 || 1;
    // const limit = req.query.limit * 1 || 100;
    // const skip = (page - 1) * limit;

    // query = query.skip(skip).limit(limit);

    // if (req.query.page) {
    //   const numTours = await Tour.countDocuments();
    //   if (skip >= numTours) {
    //     throw new Error(`This page doesn't exists`);
    //   }
    // }

    // exicute query
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;

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
