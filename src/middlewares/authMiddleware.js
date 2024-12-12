/**
 * Middleware to check if the user is authenticated.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
exports.isAuthenticated = (req, res, next) => {
    if (req.session.user?.email) next();
    else res.redirect('/api/users/login');
  };
  
  /**
   * Middleware to check if the user is elderly.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {Function} next - The next middleware function.
   */
  exports.isElderly = (req, res, next) => {
    if (req.session.user?.role === 'elderly') next();
    else res.status(403).send('Access Denied');
  };
  
  /**
   * Middleware to check if the user is staff.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {Function} next - The next middleware function.
   */
  exports.isStaff = (req, res, next) => {
    if (req.session.user?.role === 'staff') next();
    else res.status(403).send('Access Denied');
  };
  