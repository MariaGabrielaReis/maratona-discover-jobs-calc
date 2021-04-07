const express = require('express')
const routes = express.Router()

const views = __dirname + '/views/'

const Profile = {
    data: {
        name: "Maby",
        avatar: "https://unavatar.now.sh/github/MariaGabrielaReis",
        "monthly-budget": 3000,
        "days-per-week": 5,
        "hours-per-day": 4,
        "vacation-per-year": 10,
        "value-hour": 75
    },

    controllers: {
        index(req, res){
           return res.render(views + 'profile', { profile: Profile.data })
        },

        update(req, res) {
            const data = req.body
            // quantas semanas tem um ano
            const weeksPerYear = 52
            //remover semana de férias do ano e dividir por 12 pra saber semanas trabalhadas por mês
            const weeksPerMonth = (weeksPerYear - data['vacation-per-year']) / 12
            // quantas horas por semana estão sendo trabalhadas
            const weekTotalHours = data['hours-per-day'] * data['days-per-week']
            //total de horas trabalhadas no mês
            const monthlyTotalHours =weekTotalHours * weeksPerMonth
            // valor da hora
            const valueHour = data['monthly-budget'] / monthlyTotalHours

            Profile.data = {
                ... Profile.data,
                ... req.body,
                "value-hour": valueHour
            }

            return res.redirect('/profile')
        }
    }
}

const Job = {
    data : [
        {
            id: 1,
            name: "Padaria Pãozinho Quente",
            "daily-hours": 2,
            "total-hours": 1,
            created_at: Date.now()
        },
        {
            id: 2,
            name: "Pizzaria S&S",
            "daily-hours": 3,
            "total-hours": 40,
            created_at: Date.now()
        }
    ] ,

    controllers: {
        index(req, res) {
            const updatedJobs = Job.data.map((job) => {
                // ajustes no job
                const remaining = Job.services.remainingDays(job)
                const status = remaining <= 0 ? 'done' : 'progress'
            
                return {
                  ...job,
                 remaining,
                  status,
                  budget: Profile.data['value-hour'] * job['total-hours']
                }
            })
            
            return res.render(views + 'index', { jobs: updatedJobs })
            
        },

        create(req, res) {
            return res.render(views + 'job')
        },

        save(req, res) {
            // pra ver a última posição do array, ? = se existir, pega o id (não existe posição -1)
            const lastId = Job.data[Job.data.length - 1]?.id || 1;
    
            Job.data.push({
                id: lastId + 1,
                name: req.body.name,
                "daily-hours": req.body["daily-hours"],
                "total-hours": req.body["total-hours"],
                created_at: Date.now()
            })

            return res.redirect('/')
        }
    },

    services: {
        remainingDays(job) {
            //calculo do tempo restante
            //quantos dias vai levar
            const remainingDays = (job['total-hours']
         / job['daily-hours']).toFixed()
            // data de criação
            const createdDate  = new Date(job.created_at)
            // data de "entrega"
            const dueDay = createdDate.getDate() + Number(remainingDays)
            const dueDateInMs = createdDate.setDate(dueDay)
            //quanto tempo falta pra entregar (em milisegundos - por causa do Date())
            const timeDiffInMs = dueDateInMs - Date.now()
            //transformar milisegundos em dias
            const dayInMs = 1000 * 60 * 60 * 24
            //quanto tempo falta pra entregar (em dias)
            const dayDiff = Math.floor(timeDiffInMs / dayInMs)
        
            return dayDiff
        }

    }
}

routes.get('/', Job.controllers.index)
routes.get('/job', Job.controllers.create)
routes.get('/job/edit', (req, res) => res.render(views + 'job-edit'))
routes.get('/profile',  Profile.controllers.index)

routes.post('/profile',  Profile.controllers.update)
routes.post('/job', Job.controllers.save)

module.exports = routes;
