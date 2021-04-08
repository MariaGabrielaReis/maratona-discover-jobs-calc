const express = require('express')
const routes = express.Router()

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
           return res.render('profile', { profile: Profile.data })
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
                  budget: Job.services.calculateBudget(job, Profile.data["value-hour"])
                }
            })
            
            return res.render('index', { jobs: updatedJobs })
            
        },

        create(req, res) {
            return res.render('job')
        },

        save(req, res) {
            // pra ver a última posição do array, ? = se existir, pega o id (não existe posição -1)
            const lastId = Job.data[Job.data.length - 1]?.id || 0;
    
            Job.data.push({
                id: lastId + 1,
                name: req.body.name,
                "daily-hours": req.body["daily-hours"],
                "total-hours": req.body["total-hours"],
                created_at: Date.now()
            })

            return res.redirect('/')
        },
          
        show(req, res) {

            const jobId = req.params.id

            const job = Job.data.find(job => Number(job.id) === Number(jobId))

            if(!job) {
                return res.send('Projeto não encontrado!')
            }

            job.budget = Job.services.calculateBudget(job, Profile.data["value-hour"])
            return res.render('job-edit', { job })
        },

        update(req, res) {
            const jobId = req.params.id
      
            const job = Job.data.find(job => Number(job.id) === Number(jobId))
      
            if (!job) {
              return res.send('Projeto não encontrado!')
            }
      
            const updatedJob = {
              ...job, 
              name: req.body.name,
              "total-hours": req.body["total-hours"], 
              "daily-hours": req.body["daily-hours"]
            }
      
            Job.data = Job.data.map(job => {
              if(Number(job.id) === Number(jobId)) {
                job = updatedJob
              }
      
              return job
            })
      
            res.redirect('/job/' + jobId)
        },

        delete(req, res) {
            const jobId = req.params.id
            
            Job.data = Job.data.filter(job => Number(job.id) !== Number(jobId))
            
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
        },

        calculateBudget: (job, valueHour) =>  valueHour * job['total-hours']

    }
}

routes.get('/', Job.controllers.index)
routes.get('/job', Job.controllers.create)
routes.get('/job/:id', Job.controllers.show)
routes.get('/profile', Profile.controllers.index)

routes.post('/profile', Profile.controllers.update)
routes.post('/job', Job.controllers.save)
routes.post('/job/:id', Job.controllers.update)
routes.post('/job/delete/:id', Job.controllers.delete)

module.exports = routes;
