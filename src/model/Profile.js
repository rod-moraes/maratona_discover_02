const Database = require("../db/config");

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
  async get() {
    const db = await Database();

    const data = await db.get(`SELECT * FROM profile`);

    await db.close();

    return {
      name: data.name,
      avatar: data.avatar,
      "monthly-budget": data.monthly_budget,
      "hours-per-day": data.hours_per_day,
      "days-per-week": data.days_per_week,
      "vacation-per-year": data.vacation_per_year,
      "value-hour": data.value_hour,
    };
  },

  async update(newData) {
    const db = await Database();

    await db.run(`UPDATE profile SET
    name = "${newData.name}",
    avatar = "${newData.avatar}",
    monthly_budget = ${Number(newData["monthly-budget"].replace(",","."))},
    days_per_week = ${newData["days-per-week"]},
    hours_per_day = ${newData["hours-per-day"]},
    vacation_per_year = ${newData["vacation-per-year"]},
    value_hour = ${newData["value-hour"]}
    `);

    await db.close();
  },
};
