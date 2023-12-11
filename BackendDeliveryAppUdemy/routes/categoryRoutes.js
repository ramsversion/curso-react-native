const categoriesController = require('../controllers/categoriesController');
const passport = require('passport');

module.exports = (app, upload) => {

    app.post('/api/categories/create', passport.authenticate('jwt', { session: false }), upload.array('image', 1), categoriesController.create);
}