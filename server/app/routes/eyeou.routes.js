const multer = require('multer');
const passport = require('passport');
const contestMiddlewares = require('../middlewares/contests.middleware');
const userMiddlewares = require('../middlewares/users.middleware');
const imagesMiddlewares = require('../middlewares/images.middleware');
const emailHelper = require('../helpers/mail.helper');

module.exports = (app) => {
    const upload = multer();

    const contests = require('../controllers/contests.controller.js');
    // Create a new Contests
    app.post('/contests', contests.create);
    // Retrieve all Contests
    app.get('/contests', contests.findAll);
    // Retrieve a single Contest with ContestId
    app.get('/contests/findById/:contestId', userMiddlewares.isUserInContest, contests.findOne);
    // Retrieve a single Contest with Contest SlugName
    app.get('/contests/findBySlug/:slug', userMiddlewares.isUserInContest, contests.findSlug)
    // Update a Note with ContestId
    app.put('/contests/:contestsId', contests.update);
    // Delete a Note with ContestId
    app.delete('/contests/:contestsId', contests.delete);
    // Find Contest ID By Slug
    app.get('/contests/findIdBySlug/:slug', userMiddlewares.isLoggedId, contests.findIdBySlug);


    const users = require('../controllers/users.controller.js');
    // User Location
    app.get('/users/location', users.location);
    // Create a new User
    app.post('/users', users.create);
    // Retrieve all Users
    app.get('/users', users.findAll);
    // Retrieve a single User with usersId
    app.get('/users/:usersId', users.findOne);
    // Retrieve a single User with email
    app.get('/users/email/:email/:lang', users.findEmail);
    // Update a User with usersId
    app.put('/users/:usersId', users.update);
    // Delete a User with usersId
    app.delete('/users/:usersId', users.delete)
    // getverification data
    app.post('/users/verify', users.verify);
    // Get User Images
    app.get('/users/:id/images', users.getUserImages);
    // Join Free Contest
    app.post('/users/joinFreeContest', contestMiddlewares.isFreeContest, userMiddlewares.isLoggedId, userMiddlewares.isUserInContest, users.joinFreeContest);
    // Notify user
    app.post('/users/notify', users.notify);
    // Authenticate With Google
    app.get('/auth/google', passport.authenticate('google', {
        scope: ['profile', 'email']
    }));
    // Google Redirect URL
    app.get('/auth/google/redirect', passport.authenticate('google'), (req, res) => { res.redirect('/') });
    // Authenticate With Facebook
    app.get('/auth/facebook', passport.authenticate('facebook', { 
        scope: ['public_profile', 'email']
    }));
    // Facebook Redirect URL
    app.get('/auth/facebook/redirect', passport.authenticate('facebook'), (req, res) => { res.redirect('/') });
    // Login with email and password
    app.post('/auth/login', passport.authenticate('local'), (req, res) => res.status(200).json(req.user))
    // Signup with email and password
    app.post('/auth/signup', passport.authenticate('local-signup'), (req, res) => {
        res.send(true)
    })
    // Get Authenticated User
    app.get('/auth/me', (req, res) => res.status(200).json(req.user));
    // Logout
    app.get('/auth/logout', (req, res) => {
        req.logout();
        return res.redirect('/')
    });
    // Forget Password
    app.post('/auth/forget', users.forget);
    // Reset Password
    app.post('/auth/reset', users.reset);
    // Send Email
    app.post('/email/send', emailHelper.sendEmailExpress);
    // Is User In Contest
    app.get('/users/isInContest/:slug', userMiddlewares.isLoggedId ,users.isInContest);
    app.get('/users/me', userMiddlewares.isLoggedId, users.me);
    app.post('/users/me/update', userMiddlewares.isLoggedId, users.updateMe);


    const images = require('../controllers/image.controller.js');
    //Upload image to aws and asave data in mongo
    app.post('/images/uploads', upload.array("images", 30), userMiddlewares.isLoggedId, imagesMiddlewares.photosLimit, images.uploadimage);
    //find all images
    app.get('/images', images.findAll);
    // Retrieve a single image with contestid
    app.get('/images/:id', images.findOne);
    // Update a image with contestid
    app.put('/images/:user_id', userMiddlewares.isLoggedId, images.update);
    // Delete a image with contest_id
    app.delete('/images/:user_id', userMiddlewares.isLoggedId, images.delete);
    // Cool an image
    app.post('/images/:id/cool', userMiddlewares.isLoggedId, images.cool);
    app.post('/images/comment', userMiddlewares.isLoggedId, images.addComment)
    app.get('/images/comment/:id/replies', images.getCommentReplies)
    // Random 50% of contest Images
    // app.get('/images/random', images.random);


    const paypal = require('../controllers/paypal.controller');
    // Create New Payment
    app.post('/paypal/pay', userMiddlewares.isLoggedId, paypal.create);
    // Execute Payment
    app.post('/paypal/exec', userMiddlewares.isLoggedId, paypal.execute);
    // Check User Transaction For Contest
    app.get('/paypal/check/:contest', userMiddlewares.isLoggedId, paypal.check);

    const stripe = require('../controllers/stripe.controller');
    // Pay With Stripe
    app.post('/stripe/pay', userMiddlewares.isLoggedId, stripe.pay)

    const voucher = require('../controllers/vouchers.controller')
    app.post('/voucher/activate', userMiddlewares.isLoggedId ,voucher.activate)
    // app.post('/voucher/create', voucher.create)
}