module.exports = (app) => {
    multer = require('multer')
    upload = multer();

    const contests = require('../controllers/contests.controller.js');
    // Create a new Contests
    app.post('/contests', contests.create);

    // Retrieve all Notes
    app.get('/contests', contests.findAll);

    // Retrieve a single Note with noteId
    app.get('/contests/:contestsId', contests.findOne);

    // Update a Note with noteId
    app.put('/contests/:contestsId', contests.update);

    // Delete a Note with noteId
    app.delete('/contests/:contestsId', contests.delete);


    const users = require('../controllers/users.controller.js');
    // Create a new User
    app.post('/users', users.create);

    // Retrieve all Users
    app.get('/users', users.findAll);

    // Retrieve a single User with usersId
    app.get('/users/:usersId', users.findOne);

    // Retrieve a single User with email
    app.get('/users/email/:email', users.findEmail);

    // Update a User with usersId
    app.put('/users/:usersId', users.update);

    // Delete a User with usersId
    app.delete('/users/:usersId', users.delete);

    // getverification data
    app.post('/users/verify', users.verify);




    const images = require('../controllers/image.controller.js');
    //Upload image to aws and asave data in mongo
    app.post('/images/uploads', upload.array('files', 10), images.uploadimage);

    //find all images
    app.get('/images', images.findAll);

    // Retrieve a single image with contestid
    app.get('/images/:user_id', images.findOne);

    // Update a image with contestid
    app.put('/images/:user_id', images.update);

    // Delete a image with contest_id
    app.delete('/images/:user_id', images.delete);


    const paypal = require('../controllers/paypal.controller');
    //Create New Payment
    app.post('/paypal/pay', paypal.create);
    //Execute Payment
    app.post('/paypal/exec', paypal.execute);
    app.get('/paypal/check/:user/:contest', paypal.check);

}