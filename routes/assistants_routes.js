const uuid = require('uuid')
const get_all_assistants = require('../RentHeroDB/Queries/AssistantsQueries').get_all_assistants
const create_assistant = require('../RentHeroDB/Queries/AssistantsQueries').create_assistant

exports.get_assistants = (req, res, next) => {

  get_all_assistants()
    .then((assistantData) => {
      res.json(assistantData.rows)
    })
    .catch((err) => {
      console.log(err)
      res.status(500).send('Failed to get assistants')
    })
}

exports.insert_assistant = (req, res, next) => {
  const assistant_id = uuid.v4()
  const assistant_email = req.body.email

  create_assistant(assistant_id, assistant_email)
    .then((message) => {
      res.json({
        message,
      })
    })
    .catch((err) => {
      console.log(err)
      res.status(500).send('Failed to insert assistant')
    })
}
