const Job = require('../model/Job');
const JobUtils = require('../utils/JobUtils')
const Profile = require('../model/Profile')

module.exports = {
  index(req, res) {
    const jobs = Job.get()
    const profile = Profile.get()

    const updatedJobs = jobs.map((job) => {
      // ajustes no job
      const remaining = JobUtils.remainingDays(job);
      const status = remaining <= 0 ? "done" : "progress";

      return {
        ...job,
        remaining,
        status,
        budget: JobUtils.calculateBudget(job, profile["value-hour"]),
      }
    })

    return res.render("index", { jobs: updatedJobs });
  },

  create(req, res) {
    return res.render("job");
  },

  save(req, res) {
    const jobs = Job.get()
    // pra ver a última posição do array, ? = se existir, pega o id (não existe posição -1)
    const lastId = jobs[jobs.length - 1]?.id || 0

    jobs.push({
      id: lastId + 1,
      name: req.body.name,
      "daily-hours": req.body["daily-hours"],
      "total-hours": req.body["total-hours"],
      created_at: Date.now(),
    })

    return res.redirect("/")
  },

  show(req, res) {
    const jobs = Job.get()
    const profile = Profile.get()

    const jobId = req.params.id;

    const job = jobs.find((job) => Number(job.id) === Number(jobId));

    if (!job) {
      return res.send("Projeto não encontrado!");
    }

    job.budget = JobUtils.calculateBudget(job, profile["value-hour"]);
    return res.render("job-edit", { job });
  },

  update(req, res) {
    const jobs = Job.get()
    
    const jobId = req.params.id

    const job = jobs.find((job) => Number(job.id) === Number(jobId))

    if (!job) {
      return res.send("Projeto não encontrado!")
    }

    const updatedJob = {
      ...job,
      name: req.body.name,
      "total-hours": req.body["total-hours"],
      "daily-hours": req.body["daily-hours"],
    };

    const updatedJobs = jobs.map((job) => {
      if (Number(job.id) === Number(jobId)) {
        job = updatedJob;
      }

      return job
    })

    Job.update(updatedJobs)

    res.redirect("/job/" + jobId)
  },

  delete(req, res) {
    const jobId = req.params.id

    Job.delete(jobId)

    return res.redirect("/")
  }
}
