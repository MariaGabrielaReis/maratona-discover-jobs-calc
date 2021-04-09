const Job = require('../model/Job');
const JobUtils = require('../utils/JobUtils')
const Profile = require('../model/Profile')

module.exports = {
  create(req, res) {
    return res.render("job");
  },

  async save(req, res) {
    const jobs = await Job.get()
    // pra ver a última posição do array, ? = se existir, pega o id (não existe posição -1)
    const lastId = jobs[jobs.length - 1]?.id || 0

    Job.create({
      id: lastId + 1,
      name: req.body.name,
      "daily-hours": req.body["daily-hours"],
      "total-hours": req.body["total-hours"],
      created_at: Date.now(),
    })

    return res.redirect("/")
  },

  async show(req, res) {
    const jobs = await Job.get()
    const profile = await Profile.get()

    const jobId = req.params.id;

    const job = jobs.find((job) => Number(job.id) === Number(jobId));

    if (!job) {
      return res.send("Projeto não encontrado!");
    }

    job.budget = JobUtils.calculateBudget(job, profile["value-hour"]);
    return res.render("job-edit", { job });
  },

  async update(req, res) {
    const jobs = await Job.get()
    
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
