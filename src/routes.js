const express = require('express')
const routes = express.Router()

const views = __dirname + '/views/'

const profile = {
    name: "Maby",
    avatar: "https://unavatar.now.sh/github/MariaGabrielaReis",
    "monthly-budget": 3000,
    "days-per-week": 5,
    "hours-per-day": 4,
    "vacation-per-year": 10
}

routes.get('/', (req, res) => res.render(views + 'index'))
routes.get('/job', (req, res) => res.render(views + 'job'))
routes.get('/job/edit', (req, res) => res.render(views + 'job-edit'))
routes.get('/profile', (req, res) => res.render(views + 'profile', { profile }))

routes.post('/job', (req, res) => {
    console.log('Salvar dados')
})

module.exports = routes;
