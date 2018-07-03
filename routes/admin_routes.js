const get_admin_profile = require('../RentHeroAdminDB/Queries/AdminQueries').get_admin_profile
const insert_admin_profile = require('../RentHeroAdminDB/Queries/AdminQueries').insert_admin_profile

exports.retrieve_admin_profile = (req, res, next) => {
  const info = req.body
  const admin_id = info.admin_id
  const profile = info.profile

  get_admin_profile(admin_id)
    .then((adminData) => {
      if (adminData.rowCount === 0) {
        console.log('==> ADMIN PROFILE DOES NOT EXISTS')
        return insert_admin_profile(admin_id, profile)
          .then((data) => {
            return get_admin_profile(admin_id)
          })
          .then((data) => {
            res.json({
              new_entry: true,
              profile: data.rows[0],
            })
          })
          .catch((err) => {
            console.log(err)
            res.status(500).send(err)
          })
      } else {
        console.log('==> ADMIN PROFILE EXISTS')
        res.json({
          new_entry: false,
          profile: adminData.rows[0],
        })
      }
    })

}
