const get_assistant_profile = require('../Postgres/Queries/AssistantQueries').get_assistant_profile
const insert_assistant_profile = require('../Postgres/Queries/AssistantQueries').insert_assistant_profile

exports.retrieve_assistant_profile = (req, res, next) => {
  const info = req.body
  const assistant_id = info.assistant_id
  const profile = info.profile

  get_assistant_profile(assistant_id)
    .then((assistantData) => {
      if (assistantData.rowCount === 0) {
        console.log('==> ASSISTANT PROFILE DOES NOT EXISTS')
        return insert_assistant_profile(assistant_id, profile)
          .then((data) => {
            return get_assistant_profile(assistant_id)
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
        console.log('==> ASSISTANT PROFILE EXISTS')
        res.json({
          new_entry: false,
          profile: assistantData.rows[0],
        })
      }
    })

}
