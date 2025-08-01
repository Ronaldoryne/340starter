function handleErrors(err, req, res, next) {
  console.error(err.stack);
  res.status(500).render('errors/500', {
    title: 'Server Error',
    message: 'An unexpected error occurred. Please try again later.',
  });
}

module.exports = handleErrors;
