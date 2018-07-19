const uuid = require('uuid')
const CorpQueries = require('../RentHeroDB/Queries/CorpQueries')

exports.get_all_corporations = (req, res, next) => {
  CorpQueries.get_all_corporations()
    .then((data) => {
      res.json(data)
    })
    .catch((err) => {
      console.log(err)
      res.status(500).send(err)
    })
}
