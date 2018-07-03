const get_all_ads = require('../RentHeroDB/Queries/AdsQueries').get_all_ads

exports.get_ads = (req, res, next) => {

  get_all_ads()
    .then((adsData) => {
      res.json(adsData.rows)
    })
    .catch((err) => {
      console.log(err)
      res.status(500).send('Failed to get ads')
    })
}
