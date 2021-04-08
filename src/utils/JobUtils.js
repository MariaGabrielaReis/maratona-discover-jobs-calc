module.exports = {
    remainingDays(job) {
        //calculo do tempo restante
        //quantos dias vai levar
        const remainingDays = (job['total-hours'] / job['daily-hours']).toFixed()
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