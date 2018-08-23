const Users = require('../models/users.model.js');
const Contests = require('../models/contest.model');
var nodemailer = require("nodemailer");

// Create and Save a new User
exports.create = (req, res) => {

    // Validate request
    if (!req.body.email) {
        return res.status(400).send({
            message: "email name cannot be empty"
        });
    }
    // Create a User
    const users = new Users({
        email: req.body.email,
        access_code: ''
    });

    Users.find({
        email: req.body.email
    }).then((data) => {
        if (data == '') {
            // Save User in the database
            users.save()
                .then(data => {
                    res.send(data);
                }).catch(err => {
                    res.status(500).send({
                        message: err.message || "Some error occurred while creating the Users."
                    });
                });

        } else {
            console.log("Data ", data);
            return res.status(404).send({
                message: "Email already exists with emailId = " + data[0].email
            });
        }

    });



};

// Retrieve and return all Users from the database.
exports.findAll = (req, res) => {

    Users.find()
        .then(Users => {
            res.send(Users);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Users."
            });
        });

};

// Find a single User with a UserId
exports.findOne = (req, res) => {

    Users.findById(req.params.usersId)
        .then(Users => {
            if (!Users) {
                return res.status(404).send({
                    message: "Users not found with id " + req.params.usersId
                });
            }
            res.send(Users);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "User not found with id " + req.params.usersId
                });
            }
            return res.status(500).send({
                message: "Error retrieving Users with id " + req.params.usersId
            });
        });

};

// Find a single User with a UserId
exports.findEmail = (req, res) => {
    const { lang } = req.params;
    Users.find({
        email: req.params.email
    })
        .then(Usersres => {
            if (Usersres == '') {
                // return res.status(404).send({
                //   message: "Email not exists "
                // });

                var valnew = Math.floor(1000 + Math.random() * 9000);
                // Create a User
                var newusers = new Users({
                    email: req.params.email,
                    acess_code: valnew
                });

                // Save User in the database
                newusers.save()
                    .then(data => {
                        console.log("Email not exits", data);
                        res.send(data);
                    }).catch(err => {
                        res.status(500).send({
                            message: err.message || "Some error occurred while creating the Users."
                        });
                    });


                var smtpTransport = nodemailer.createTransport({
                    service: 'gmail',
                    secure: false,
                    port: 25,
                    auth: {
                        user: process.env.gmail_user,
                        pass: process.env.gmail_pass
                    },
                    tls: {
                        rejectUnauthorized: false
                    },
                    from: `'EYEOU' <${process.env.gmail_user}`,
                    to: req.params.email,
                    host: 'smtp.gmail.com'
                });
                const html = {
                    en: `
                    <div>
                        <h2>Hello!</h2> <br>
                        <p>Your verification code to verify your email is: ${valnew}</p>
                        <p>Great Shots!</p>
                        <img 
                            src="https://lh5.googleusercontent.com/YVZbtwcEGhhTTLRn5ekI852WwZ-_3rhg5wi1dRN67CkobT_NM3X59k0pmCjTOWRlT0UHAAG059EF-8xAVkYbueeOVeXNPLpk0UwlZNFbvyRIsFPxgWIsCTiEEtfUkTa-vT_kAQP2"
                            style="width: 25%"
                        />
                    </div>
                    `,
                    pt: `
                    <div>
                        <h2>Hello!</h2> <br>
                        <p>Your verification code to verify your email is: ${valnew}</p>
                        <p>Great Shots!</p>
                        <img 
                            src="https://lh5.googleusercontent.com/YVZbtwcEGhhTTLRn5ekI852WwZ-_3rhg5wi1dRN67CkobT_NM3X59k0pmCjTOWRlT0UHAAG059EF-8xAVkYbueeOVeXNPLpk0UwlZNFbvyRIsFPxgWIsCTiEEtfUkTa-vT_kAQP2"
                            style="width: 25%"
                        />
                    </div>
                `
                }
                const subject = {
                    en: 'EYEOU email contest validation',
                    pt: 'EYEOU validação de e-mail'
                }
                mailOptions = {
                    to: req.params.email,
                    subject: lang == 'en' ? subject.en : subject.pt,
                    html: lang == 'en' ? html.en : html.pt,
                    host: 'smtp.gmail.com'
                }

                smtpTransport.sendMail(mailOptions, function (error, response) {
                    if (error) {
                        console.log(error);
                        res.end("error");
                    } else {
                        console.log("Message sent: " + response);
                        res.end("sent");
                    }
                });

            } else {

                var val = Math.floor(1000 + Math.random() * 9000);
                const html = {
                    en: `
                    <div>
                        <h2>Hello!</h2> <br>
                        <p>Your verification code to verify your email is: ${val}</p>
                        <p>Great Shots!</p>
                        <img 
                            src="https://lh5.googleusercontent.com/YVZbtwcEGhhTTLRn5ekI852WwZ-_3rhg5wi1dRN67CkobT_NM3X59k0pmCjTOWRlT0UHAAG059EF-8xAVkYbueeOVeXNPLpk0UwlZNFbvyRIsFPxgWIsCTiEEtfUkTa-vT_kAQP2"
                            style="width: 25%"
                        />
                    </div>
                    `,
                    pt: `
                    <div>
                        <h2>Olá!</h2> <br>
                        <p>O código de verificação do seu email é: ${val}</p>
                        <p>Bons disparos!</p>
                        <img 
                            src="https://lh5.googleusercontent.com/YVZbtwcEGhhTTLRn5ekI852WwZ-_3rhg5wi1dRN67CkobT_NM3X59k0pmCjTOWRlT0UHAAG059EF-8xAVkYbueeOVeXNPLpk0UwlZNFbvyRIsFPxgWIsCTiEEtfUkTa-vT_kAQP2"
                            style="width: 25%"
                        />
                    </div>
                `
                }
                const subject = {
                    en: 'EYEOU email contest validation',
                    pt: 'EYEOU validação de e-mail'
                }
                Users.findByIdAndUpdate(Usersres[0]._id, {
                    email: Usersres[0].email,
                    acess_code: val
                }, {
                        new: true
                    })
                    .then(data => {
                        res.send(data);

                        var smtpTransport = nodemailer.createTransport({
                            service: 'gmail',
                            secure: false,
                            port: 25,
                            auth: {
                                user: process.env.gmail_user,
                                pass: process.env.gmail_pass
                            },
                            tls: {
                                rejectUnauthorized: false
                            },
                            from: `'EYEOU' <${process.env.gmail_user}`,
                            host: 'smtp.gmail.com'
                        });
                        mailOptions = {
                            to: data.email,
                            subject: lang == 'en' ? subject.en : subject.pt,
                            html: lang == 'en' ? html.en : html.pt,
                            host: 'smtp.gmail.com'
                        }

                        smtpTransport.sendMail(mailOptions, function (error, response) {
                            if (error) {
                                console.log(error);
                                res.end("error");
                            } else {
                                console.log("Message sent: " + JSON.stringify(response));
                                res.end("sent");
                            }
                        });

                    });

            }

        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Email not exists with " + req.params.email
                });
            }
            return res.status(500).send({
                message: "Email not exists  with" + req.params.email
            });
        });

};



// Update a User identified by the UserId in the request
exports.update = (req, res) => {

    // Validate Request
    if (!req.body.email) {
        return res.status(400).send({
            message: "useremail can not be empty"
        });
    }

    // Find User and update it with the request body
    Users.findByIdAndUpdate(req.params.usersId, {
        email: req.body.email,
        // password: req.body.password,
        // access_id: req.body.access_id,
        // access_secret: req.body.access_secret,
        // console_link: req.body.console_link,

    }, {
            new: true
        })
        .then(Users => {
            if (!Users) {
                return res.status(404).send({
                    message: "User not found with id " + req.params.usersId
                });
            }
            res.send(Users);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "User not found with id " + req.params.usersId
                });
            }
            return res.status(500).send({
                message: "Error updating User with id " + req.params.usersId
            });
        });

};

// Delete a User with the specified UserId in the request
exports.delete = (req, res) => {

    Users.findByIdAndRemove(req.params.usersId)
        .then(Users => {
            if (!Users) {
                return res.status(404).send({
                    message: "User not found with id " + req.params.usersId
                });
            }
            res.send({
                message: "User deleted successfully!"
            });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "User not found with id " + req.params.usersId
                });
            }
            return res.status(500).send({
                message: "Could not delete User with id " + req.params.usersId
            });
        });


};

exports.verify = (req, res) => {
    console.log(req.body)
    if (!req.body.email) {
        return res.status(400).send({
            message: "email name cannot be empty"
        })
    } else {
        Users.findOne({
            email: req.body.email
        })
            .then((data) => {
                if (!data) {
                    return res.status(404).send({
                        message: "Email not exists "
                    });
                } else {
                    if (data.acess_code == req.body.acess_code) {
                        res.status(200).json({
                            message: true
                        });

                    } else {
                        res.status(200).json({
                            message: false
                        });
                    }
                }
            });
    }
}

exports.getUserImages = (req, res) => {
    Users
        .findById(req.params.id)
        .populate('images')
        .exec()
        .then(user => res.status(200).json(user))
        .catch(err => res.status(403).json(err));
}

exports.joinFreeContest = (req, res) => {
    const { userId, contestId } = req.body;
    Promise
        .all([
            Users.findByIdAndUpdate(userId, { $push: { contests: contestId } }).exec(),
            Contests.findByIdAndUpdate(contestId, { $push: { users: userId } }).exec()
        ])
        .then(info => res.status(200).json(info))
        .catch(err => res.status(403).json(err));
}

exports.notify = (req, res) => {
    const { email, full_name } = req.body;
    Users.findOne({ email }).exec()
        .then(async $user => {
            if ($user) {
                const user = await Users.findOneAndUpdate({ email }, { notify: true }).exec()
                res.status(200).json(user)
            } else {
                const user = await new Users({ email, full_name, notify: true }).save()
                res.status(200).json(user)
            }
        })
        .catch(error => res.status(500).json(error))
}