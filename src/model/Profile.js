let data = {
  name: "Maby",
  avatar: "https://unavatar.now.sh/github/MariaGabrielaReis",
  "monthly-budget": 3000,
  "days-per-week": 5,
  "hours-per-day": 4,
  "vacation-per-year": 10,
  "value-hour": 75,
}

module.exports = {
  get(){
    return data
  },

  update(newData){
    data = newData
  }
}