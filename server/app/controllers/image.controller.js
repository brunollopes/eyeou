const Image = require('../models/image.model.js');
const User = require('../models/users.model');
const Contest = require('../models/contest.model');
const AWS = require('aws-sdk');
const sharp = require('sharp');
const emailHelper = require('../helpers/mail.helper');

AWS.config.update({
  accessKeyId: process.env.aws_access_key,
  secretAccessKey: process.env.aws_access_secret
});

var s3 = new AWS.S3();

exports.uploadimage = (req, res) => {
  const { files } = req;
  const { contest_name } = req.body;
  const user_id = req.user._id
  // const { user_id } = req.body
  function createParams($files, $contest_name, $user_id) {
    let params = [];
    return new Promise(async (resolve, reject) => {
      $files.forEach(async (file, $i) => {
        try {
          const thumbnailBuffer = await sharp(file.buffer).resize(600, 400).min().toFormat('jpeg').toBuffer()
          params.push(
            {
              Bucket: 'eyeou',
              Body: file.buffer,
              ACL: 'public-read',
              ContentEncoding: 'base64',
              ContentType: file.type,
              Key: `${$contest_name}/${$user_id}/${Date.now()}_${file.originalname}`
            },
            {
              Bucket: 'eyeou',
              Body: thumbnailBuffer,
              ACL: 'public-read',
              ContentEncoding: 'base64',
              ContentType: file.type,
              Key: `${$contest_name}/${$user_id}/${Date.now()}_${file.originalname.substr(0, file.originalname.indexOf('.'))}_thumbnail020GH.jpeg`
            }
          );
          if ($i == $files.length - 1)
            resolve(params)
        } catch (e) {
          reject(e)
        }
      });
    })
  }

  createParams(files, contest_name, user_id)
    .then(params => {
      params.forEach(async (param, i) => {
        if (!param.Key.includes('thumbnail020GH')) {
          s3.upload(param, async (err, data) => {
            if (err) {
              console.log('>> UPLOAD ERROR', err)
              // return res.status(403).json(err)
            }
            const img = new Image({
              contest: contest_name,
              user: user_id,
              image_path: data.Location
            });
            try {
              const imgSaved = await img.save();
              const userUpdate = await User.findByIdAndUpdate(user_id, { $push: { images: imgSaved.id } }).exec();
              const contestUpdate = await Contest.findByIdAndUpdate(contest_name, { $push: { images: imgSaved.id } }).exec();
              s3.upload(params[i + 1], async (errThumb, thumbnail) => {
                if (errThumb) return res.status(203).json(imgSaved)
                Image.findByIdAndUpdate(imgSaved.id, { thumbnail_path: thumbnail.Location }, { new: true })
                  .then(async imgUpdated => {
                    const sentMail = await emailHelper.sendEmail({
                      $mailTo: process.env.owner_email,
                      $subject: `New Image Is Uploaded`,
                      $html: `<p>${userUpdate.email} Uploaded a new image in <strong>${contestUpdate.contest_name}</strong></p>
                              <p>Image URL on AWS: <a href="${data.Location}">Here</a></p>`
                    })
                    if (i == params.length - 1)
                      return res.status(200).send(imgUpdated)
                  })
                  .catch(error => {
                    Image.findByIdAndRemove(imgSaved.id)
                      .then(imgDeleted => {
                        console.log('>> IMAGE DELETED', error)
                        return res.status(403).send("Image Thumbnail Wasn't save, Image has been deleted")
                      })
                  })
              })
            } catch (e) {
              console.log(e)
            }
          })
        } else {
          if (i == params.length - 1)
            return res.status(200).send(true)
        }
      })
    })
    .catch(err => {
      console.log(err)
    })
}

exports.cool = (req, res) => {
  const userId = req.user.id;
  const { id } = req.params

  Image.findById(
    id,
    ['id', 'cools'],
    (err, image) => {
      if (err) return res.status(404).json(err)
      const index = image.cools.indexOf(userId)
      if (index > -1) {
        Image.findByIdAndUpdate(
          id,
          { $pull: { cools: userId } },
          { new: true },
          ($err, info) => {
            if ($err) return res.status(500).json($err)
            return res.status(200).send({ status: false })
          }
        )
      } else {
        Image.findByIdAndUpdate(
          id,
          { $push: { cools: userId } },
          { new: true },
          ($err, info) => {
            if ($err) return res.status(500).json($err)
            return res.status(200).send({ status: true })
          })
      }
    })
}

// Retrieve and return all images from the mongo database.
exports.findAll = (req, res) => {
  const userId = req.user ? req.user.id : null

  Image
    .find({approved: true}, ['cools', 'contest', 'id', 'thumbnail_path', 'approved'])
    .populate({
      path: 'contest',
      select: ['contest_name', 'contest_title', 'bgprofile_image']
    })
    .exec()
    .then(images => {
      let $images = images.map(img => {
        const { cools, contest, id, thumbnail_path } = img
        return { cools, contest, id, thumbnail_path }
      })
      $images.forEach(img => { img.userCooled = img.cools.indexOf(userId) > -1 ? true : false })
      res.status(200).json($images);
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