const Job = require('../model/Job');
const JobUtils = require('../utils/JobUtils')
const Profile = require('../model/Profile')

module.exports = {
  index(req, res) {
    const jobs = Job.get();
    const profile = Profile.get();

    let statusCount = {
        progress: 0,
        done: 0,
        total: jobs.length
    }

    //total de horas p/ dia de todos os jobs em progresso
    let jobTotalHours = 0

    const updatedJobs = jobs.map((job) => {
      // ajustes no job
      const remaining = JobUtils.remainingDays(job);
      const status = remaining <= 0 ? "done" : "progress";

      // soamndo a quantia de status (quantos projetos estão em done ou in progress)
      statusCount[status] += 1

      // acumulando horas por dia dos jobs
      jobTotalHours = status == 'progress' ? jobTotalHours += Number(job["daily-hours"]) : jobTotalHours
      
      return {
        ...job,
        remaining,
        status,
        budget: JobUtils.calculateBudget(job, profile["value-hour"]),
      }
    })

    //quantia de horas livres 
    //quantia de horas que quero trabalhar p/ dia - quantia de horas de cada dia dos jobs em progresso
    const freeHours = profile["hours-per-day"] - jobTotalHours

    return res.render("index", { jobs: updatedJobs, profile: profile, statusCount: statusCount, freeHours: freeHours })
  }
}
