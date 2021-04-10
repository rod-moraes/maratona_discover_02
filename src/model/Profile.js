let data = {
  name: "Rodrigo Moraes",
  avatar: "https://github.com/rod-moraes.png",
  "monthly-budget": 4500,
  "hours-per-day": 20,
  "days-per-week": 4,
  "vacation-per-year": 10,
  "value-hour": 75,
};

module.exports = {
  get() {
    return data;
  },
  update(newData) {
    data = newData;
  },
};
