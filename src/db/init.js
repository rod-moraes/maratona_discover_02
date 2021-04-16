const Database = require("./config");

const initDb = {
  async init () {
    const db = await Database()

    await db.exec(`CREATE TABLE profile (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    avatar TEXT,
    monthly_budget REAL,
    days_per_week INT,
    hours_per_day INT,
    vacation_per_year INT,
    value_hour INT
    )`);

    await db.exec(`CREATE TABLE jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    order_jobs INTEGER,
    daily_hours INT,
    total_hours INT,
    created_at DATETIME,
    initial_job DATETIME,
    status TEXT
    )`);

    await db.run(`INSERT INTO profile (
    name, 
    avatar, 
    monthly_budget, 
    days_per_week, 
    hours_per_day, 
    vacation_per_year, 
    value_hour
    ) VALUES(
      "Rodrigo Moraes",
      "https://github.com/rod-moraes.png",
      8000,
      5,
      3,
      4,
      133.33
    );`);

    await db.run(`INSERT INTO jobs (
    name, 
    order_jobs,
    daily_hours,
    total_hours,
    created_at,
    initial_job,
    status
    ) VALUES(
      "Pizzaria Guloso",
      1,
      2,
      1,
      1617514376018,
      0,
      "to-do"
    );`);
    await db.run(`INSERT INTO jobs (
      name, 
      order_jobs,
      daily_hours,
      total_hours,
      created_at,
      initial_job,
      status
      ) VALUES(
        "Maratona Discover 2",
        2,
        3,
        3,
        1617514376018,
        0,
        "to-do"
      );`);

    await db.close();
  }

}

initDb.init();

/*
CREATE TABLE profile (
  id: INTEGER PRIMARY KEY AUTOINCREMENT
  name TEXT,
  avatar TEXT,
  monthly-budget INT,
  days-per-week INT,
  hours-per-day INT,
  vacation-per-year INT,
  value-hour INT,
  )
*/
