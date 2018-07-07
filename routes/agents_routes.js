const uuid = require('uuid')
const get_all_agents = require('../RentHeroDB/Queries/AgentsQueries').get_all_agents
const create_agent = require('../RentHeroDB/Queries/AgentsQueries').create_agent

exports.get_agents = (req, res, next) => {

  get_all_agents()
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
  const agent_email = req.body.email

  create_agent(agent_id, agent_email)
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
