const Image = require('../models/image.model.js');
const User = require('../models/users.model');
const Contest = require('../models/contest.model');
const Transaction = require('../models/transactions.model');

exports.photosLimit = (req, res, next) => {
  const { contest_name } = req.body;
  const { files } = req
  const user_id = req.user._id
  // const { user_id } = req.body

  Contest.findById(contest_name).exec()
    .then(async $contest => {
      if ($contest.users.indexOf(user_id) > -1) {
        if ($contest.type == 'free') {
          Image.find({
            user: user_id,
            contest: contest_name
          }, (err, $images) => {
            if (err) return res.status(500).json(err)
            return $images.length + files.length > 1 ? res.status(403).send('Authorization Error: You can\'t upload more than 1 image to this contest') : next()
          })
        } else {
          try {
            const $transactions = await Transaction.find({ user: user_id, contest: contest_name }).exec()
            const $images = await Image.find({ user: user_id, contest: contest_name }).exec()
            if ($transactions) {
              const reducer = (accumulator, currentValue) => accumulator + currentValue;
              let maxPhotosLength = $transactions.map($transaction => $transaction.maxPhotosLimit).reduce(reducer)
              return $images.length + files.length > maxPhotosLength ? res.status(403).send('Authorization Error: You can\'t upload more images') : next()
            } else {
              return res.status(403).send('Authorization Error: User is not in this paid contest')
            }
          } catch (err) {
            console.log('>> ERROR:', err)
            return res.status(500).json(err)
          }
        }
      } else {
        return res.status(403).send('Authorization Error: User is not in this contest')
      }
    })
    .catch($err => {
      console.log('>> ERROR', $err)
      return res.status(500).json($err)
    })
}