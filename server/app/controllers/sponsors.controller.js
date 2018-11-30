const Contest = require('../models/contest.model.js');
const Sponsor = require('../models/sponsor.model.js');

exports.sponsorContests = (req, res) => {
  const { id } = req.params

  Sponsor
    .findById(id)
    .populate({
      path: 'contests'
    })
    .exec()
    .then(sponsor => res.status(200).json(sponsor))
    .catch(err => res.status(500).json(err))

} 