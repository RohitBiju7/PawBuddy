//Now that we know who the user is, check if they are allowed to access this route

const authorizeRoles = (...allowedRoles) => {    //...allowedRoles is a javascript rest parameter that allows us to pass in any number of roles as arguments. It will be an array of allowed roles.
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied"
      });
    }

    next();
  };
};

module.exports = {
  authorizeRoles
};