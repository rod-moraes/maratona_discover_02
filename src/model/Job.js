const Database = require("../db/config");

module.exports = {
  async get() {
    const db = await Database();
    const data = await db.all(`SELECT * FROM jobs ORDER BY order_jobs ASC `);
    await db.close();
    const newData = data.map((job) => {
      return {
        id: job.id,
        name: job.name,
        "daily-hours": job.daily_hours,
        "total-hours": job.total_hours,
        createdAt: job.created_at,
        initial_job: job.initial_job,
        status: job.status  
      };
    });
    return newData;
  },
  async update(updatedJob) {
    const db = await Database();
    await db.run(`UPDATE jobs SET
      name = "${updatedJob.name}",
      daily_hours = ${updatedJob["daily-hours"]},
      total_hours = ${updatedJob["total-hours"]},
      initial_job = ${updatedJob.initial_job},
      status = "${updatedJob.status}"
      WHERE id = ${updatedJob.id}
      `);
    await db.close();
  },
  async updateData(updatedJob) {
    const db = await Database();
    await db.run(`UPDATE jobs SET
      name = "${updatedJob.name}",
      daily_hours = ${updatedJob["daily-hours"]},
      total_hours = ${updatedJob["total-hours"]}
      WHERE id = ${updatedJob.id}
      `);
    await db.close();
  },

  async delete(jobId) {
    const db = await Database();
    await db.run(`DELETE FROM jobs
    WHERE id = ${jobId}`);
    await db.close();
  },
  async create(newJob) {
    const db = await Database();
    const job = await db.get(`SELECT *
    FROM  jobs
    ORDER BY id DESC`);
    await db.run(`INSERT INTO jobs (
      name,
      order_jobs,
      daily_hours,
      total_hours,
      created_at,
      initial_job,
      status
    ) VALUES (
      "${newJob.name}",
      ${job?.id ? job.id+1:1},
      ${newJob["daily-hours"]},
      ${newJob["total-hours"]},
      ${newJob.createdAt},
      0,
      "to-do"
    )`);
    await db.close();
  },
  async up(jobId) {
    const db = await Database();
    //Pegando o Job que eu quero colocar para cima
    const jobUp = await db.get(`SELECT  *  
    FROM  jobs 
    WHERE id = ${jobId}`);

    //Pegando o Job que está antes do job que eu vou colocar para cima
    const jobDown = await db.get(`SELECT  *  
    FROM  jobs 
    WHERE order_jobs < ${jobUp.order_jobs} 
    ORDER BY order_jobs DESC`);

    if(!jobUp||!jobDown){
      await db.close();
      return false;
    }

    //Atualizando o job que eu quero colocar para cima
    await db.run(`UPDATE jobs SET
      order_jobs = ${jobDown.order_jobs}
      WHERE id = ${jobUp.id}
    `);

    //Atualizando o job para "baixo"
    await db.run(`UPDATE jobs SET
    order_jobs = ${jobUp.order_jobs}
    WHERE id = ${jobDown.id}
    `);

    await db.close();
    return true;
  },
  async down(jobId) {
    const db = await Database();
    //Pegando o Job que eu quero colocar para baixo
    const jobDown = await db.get(`SELECT  *  
    FROM  jobs 
    WHERE id = ${jobId}`);

    //Pegando o Job que está depois do job que eu vou colocar para baixo
    const jobUp = await db.get(`SELECT  *  
    FROM  jobs 
    WHERE order_jobs > ${jobDown.order_jobs} 
    ORDER BY order_jobs ASC`);

    if(!jobUp||!jobDown){
      await db.close();
      return false;
    }

    //Atualizando o job que eu quero colocar para cima
    await db.run(`UPDATE jobs SET
      order_jobs = ${jobDown.order_jobs}
      WHERE id = ${jobUp.id}
    `);

    //Atualizando o job para "baixo"
    await db.run(`UPDATE jobs SET
    order_jobs = ${jobUp.order_jobs}
    WHERE id = ${jobDown.id}
    `);

    await db.close();
    return true;
  },
};
