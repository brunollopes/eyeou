const Image = require('../models/image.model.js');
const AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: process.env.aws_access_key,
    secretAccessKey: process.env.aws_access_secret
});

var s3 = new AWS.S3();

//upload image to aws and save imagepath and contest_id to mongo db
exports.uploadimage = (req, res) => {
    req.body.files.forEach(file => {

        var base64Data = file.src.replace(/^data:image\/[a-z]+;base64,/, "");
        console.log(base64Data);
        var binaryData = new Buffer(base64Data, 'base64');
        var params = {
            Bucket: 'eyeou',
            Body: binaryData,
            ACL: 'public-read',
            ContentEncoding: 'base64',
            ContentType: file.type,
            Key: req.body.contest_name + "/" + req.body.user_id + "/" + Date.now() + "_" + file.name
        };

        s3.upload(params, function (err, data) {
            //handle error
            if (err) {
                console.log("AWS Error ", err);
            }

            //success
            if (data) {
                console.log("Uploaded in:", data.Location);
                const img = new Image({
                    contest_name: req.body.contest_name,
                    user_id: req.body.user_id,
                    image_path: data.Location
                });

                // Save contest in the database
                img.save()
                    .then(savedimagedata => {
                        res.send(savedimagedata);

                    }).catch(err => {
                        res.status(500).send({
                            message: err.message || "Some error occurred while creating the Contests."
                        });
                    });

            }
        })

    });

}

// Retrieve and return all images from the mongo database.
exports.findAll = (req, res) => {

    Image.find()
        .then(images => {
            res.send(images);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving images."
            });
        });

};

// Find a single image with a imageid
exports.findOne = (req, res) => {

    Image.find({
        user_id: req.params.user_id
    })
        .then(images => {
            if (!images) {
                return res.status(404).send({
                    message: "Image not found with user_id " + req.params.user_id
                });
            }
            res.send(images);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Image not found with user_id " + req.params.user_id
                });
            }
            return res.status(500).send({
                message: "Error retrieving image with user_id " + req.params.user_id
            });
        });

};

// Update a image identified by the contest_id in the request
exports.update = (req, res) => {

    // Validate Request
    if (!req.body.user_id) {
        return res.status(400).send({
            message: "user_email cannot be empty"
        });
    }

    // Find image and update it with the request body
    Image.findByIdAndUpdate(req.params.user_id, {
        user_id: req.body.user_id,
    }, {
            new: true
        })
        .then(images => {
            if (!images) {
                return res.status(404).send({
                    message: "user_email not found with user_id " + req.params.user_id
                });
            }
            res.send(images);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "user_email not found with user_id " + req.params.user_id
                });
            }
            return res.status(500).send({
                message: "Error updating user_id with user_id " + req.params.user_id
            });
        });

};

// Delete a image with the specified contestId in the request
exports.delete = (req, res) => {

    Image.find({
        user_id: req.params.user_id
    }).then((data) => {

        var objects = [];
        data.forEach(element => {
            var str = element.image_path;
            var res = str.substring(str.indexOf("m/"));
            var a = res.replace("m/", "");
            objects.push({ Key: a });
        });
        console.log("Objests", objects);
        var options = {
            Bucket: 'eyeou',
            Delete: {
                Objects: objects
            }
        };

        //delete images from aws storage
        s3.deleteObjects(options, function (err, data) {
            if (data) {
                console.log("File successfully deleted", data);
            } else {
                console.log("Check with error message " + err);
            }
        });


        //delete images from mongodb
        data.forEach(element => {

            Image.findByIdAndRemove(element._id)
                .then(images => {
                    if (!images) {
                        return res.status(404).send({
                            message: "Images not found with id " + element._id
                        });
                    }

                }).catch(err => {
                    if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                        return res.status(404).send({
                            message: "Images not found with id " + element._id
                        });
                    }
                    return res.status(500).send({
                        message: "Could not delete images with id " + element._id
                    });
                });

        });

        res.send({
            message: "Images deleted successfully!"
        });

    });

};