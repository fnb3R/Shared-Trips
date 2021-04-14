const errorHandler = (err, req, res, next) => {
    err.message = err.message || 'Something went wrong';
   err.status = err.status || 500; // ако грешката, която идва в errorHandler-a има статус тогава го вземи и го сложи на променливата status; но ако няма || тогава взем съседната стойност
    console.log(err);
    //TODO Add page to render
    res.status(err.status).render('404', {error: err})
};

module.exports = errorHandler;