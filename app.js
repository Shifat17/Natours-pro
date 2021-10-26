const express = require('express');
const morgan = require('morgan');
const path = require('path');
const AppError = require('./utils/appError');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cors = require('cors');
const hpp = require('hpp');

const cookieParser = require('cookie-parser');
const viewRouter = require('./routes/viewRoutes');
const tourRouter = require('./routes/tourRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const errorController = require('./controllers/errorController');

const app = express();

const corsOptions = {
  credentials: true,
  origin: 'http://localhost:3000',
};

//views
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
//serving static files
app.use(express.static(path.join(__dirname, 'public')));

//Middlewares

app.use(helmet());

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100,
});

app.use('/api', limiter);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cors(corsOptions));
app.use(cookieParser());

//Data sanitization against NoSql query injection attack
app.use(mongoSanitize());
//Data sanitization against xss attack
app.use(xss());
//Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'difficulty',
      'price',
    ],
  })
);

if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev'));
}

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

/*app.get("/", (req, res) => {
  res.status(200).json({
    message: "Hello from the server side",
    app: "natours",
  });
});
app.post("/", (req, res) => {
  res.send("You can Post to this endpoint");
});
*/
/*app.get("/api/v1/tours", getTours);
app.post("/api/v1/tours", createTour);
app.get("/api/v1/tours/:id", getTour);
app.patch("/api/v1/tours/:id", updateTour);
app.delete("/api/v1/tours/:id", deleteTour);
*/
//Routers

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/bookings', bookingRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: "FAiled",
  //   message: `could not find the ${req.originalUrl} on this server`,
  // });
  const err = new AppError(
    `could not find the ${req.originalUrl} on this server`
  );

  next(err);
});

app.use(errorController.errorHandler);
//Start listening to the server
module.exports = app;
