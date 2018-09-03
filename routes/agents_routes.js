const uuid = require('uuid')
const AgentsQueries = require('../RentHeroDB/Queries/AgentsQueries')

exports.get_agents = (req, res, next) => {

  AgentsQueries.get_all_agents()
    .then((agentData) => {
      res.json(agentData.rows)
    })
    .catch((err) => {
      console.log(err)
      res.status(500).send('Failed to get agents')
    })
}

exports.insert_agent = (req, res, next) => {
  const agent_id = uuid.v4()
  const friendly_name = req.body.friendly_name
  const agent_email = req.body.email

  AgentsQueries.create_agent(agent_id, friendly_name, agent_email)
    .then((message) => {
      res.json({
        message,
      })
    })
    .catch((err) => {
      console.log(err)
      res.status(500).send('Failed to insert agent')
    })
}
