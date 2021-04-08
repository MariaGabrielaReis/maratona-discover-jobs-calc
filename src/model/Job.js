let data = [
  {
    id: 1,
    name: "Padaria Pãozinho Quente",
    "daily-hours": 2,
    "total-hours": 1,
    created_at: Date.now(),
  },
  {
    id: 2,
    name: "Pizzaria S&S",
    "daily-hours": 3,
    "total-hours": 40,
    created_at: Date.now(),
  },
]

module.exports = {
  get() {
    return data
  },

  update(newJob) {
    data = newJob
  },

  delete(id) {
    data = data.filter(job => Number(job.id) !== Number(id))
  }
}
