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

const jobs = []

routes.get('/', (req, res) => res.render(views + 'index'))
routes.get('/job', (req, res) => res.render(views + 'job'))
routes.get('/job/edit', (req, res) => res.render(views + 'job-edit'))
routes.get('/profile', (req, res) => res.render(views + 'profile', { profile }))

routes.post('/job', (req, res) => {
    // pra ver a última posição do array, ? = se existir, pega o id (não existe posição -1)
    const lastId = jobs[jobs.length - 1]?.id || 1;
    
    jobs.push({
        id: lastId + 1,
        name: req.body.name,
        "daily-hours": req.body["daily-hours"],
        "total-hours": req.body["total-hours"],
        created_at: Date.now()
    })
    
    return res.redirect('/')
})

module.exports = routes;
