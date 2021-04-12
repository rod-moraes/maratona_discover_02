module.exports = {
  remainingDays(job) {
    const remainingMs =
      (job["total-hours"] / job["daily-hours"]) * 24 * 60 * 60 * 1000;
    const convertMstoDay = 1.1574074074067 * 10 ** -8;
    const createdDate = new Date(job.initial_job);
    const dueDay = createdDate.getMilliseconds() + Number(remainingMs);
    const dueDate = createdDate.setMilliseconds(dueDay);

    console.log(dueDate);
    console.log(Date.now());
    const timeDiffInMs = dueDate - Date.now();
    const dayDiff = Math.ceil(timeDiffInMs * convertMstoDay);
    console.log(dayDiff);
    return dayDiff;
  },
  calculateBudget: (job, valueHour) => valueHour * job["total-hours"],

  verifyJobsProgressToDoDone(jobs,profile) {
    let jobHours = 0;
    jobs = jobs.map((job) => {
      if (job.status == "progress") {
        const remaining = this.remainingDays(job);
        job.status = remaining <= 0 ? "done" : "progress";
        job.status == "progress"
          ? (jobHours += job["daily-hours"])
          : (jobHours = jobHours);
      }
      return job;
    });
    //Verificar se eu posso pegar algum to-do e transformar em progress
    jobs = jobs.map((job) => {
      if (jobHours <= profile["hours-per-day"] && job.status == "to-do") {
        jobHours += job["daily-hours"];
        if (jobHours <= profile["hours-per-day"]) {
          job.initial_job = Date.now();
          job.status = "progress";
        }
      }
      return job;
    });

    return jobs;
  },

  initialJobsProgressToDo(jobs,profile){
    let jobHours = 0;
    return jobs.map((job) => {
      if (jobHours <= profile["hours-per-day"]) {
        jobHours += job["daily-hours"];
        job.initial_job = Date.now();
        job.status = "progress";
      } else {
        job.status = "to do";
      }
      return job;
    });
  }
};
