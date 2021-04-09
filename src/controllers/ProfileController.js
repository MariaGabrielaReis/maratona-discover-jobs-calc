const Profile = require('../model/Profile')

module.exports = {
    async index(req, res){
       return res.render('profile', { profile: await Profile.get() })
    },

    async update(req, res) {
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

        const profile = await Profile.get()

        await Profile.update({
            ...profile,
            ...req.body,
            "value-hour": valueHour
        })

        return res.redirect('/profile')
    }
}