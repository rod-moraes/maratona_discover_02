module.exports = {
  remainingDays(job,profile) {
    const remainingMs = ((job["total-hours"] / job["daily-hours"]) * 24 * 60 * 60 * 1000*7)/profile["days-per-week"];
    const convertMstoDay = 1.1574074074067 * 10 ** -8;
    const createdDate = new Date(job.initial_job);
    const dueDay = createdDate.getMilliseconds() + Number(remainingMs);
    const dueDate = createdDate.setMilliseconds(dueDay);
    const timeDiffInMs = dueDate - Date.now();
    const dayDiff = Math.ceil(timeDiffInMs * convertMstoDay);
    return dayDiff;
  },
  calculateBudget: (job, valueHour) => valueHour * job["total-hours"],

  verifyJobsProgressToDoDone(jobs, profile) {
    let jobHours = 0;
    let newJobs = jobs.map((job) => {
      if (job.status == "progress") {
        const remaining = this.remainingDays(job,profile);
        job.status = remaining <= 0 ? "done" : "progress";
        job.status == "progress"
          ? (jobHours += job["daily-hours"])
          : (jobHours = jobHours);
      }
      return job;
    });
    //Verificar se eu posso pegar algum to-do e transformar em progress
    newJobs = newJobs.map((job) => {
      if(job.status == "to-do"){
        if ((jobHours+= job["daily-hours"]) <= profile["hours-per-day"]) {
          job.initial_job = Date.now();
          job.status = "progress";
        }
      }
      return job;
    });

    return newJobs;
  },

  initialJobsProgressToDo(jobs, profile) {
    let jobHours = 0;
    return jobs.map((job) => {
      if ( (jobHours+= job["daily-hours"]) <= profile["hours-per-day"]) {
          job.initial_job = Date.now();
          job.status = "progress";
      } else {
        job.status = "to-do";
      }
      return job;
    });
  },

  verifyDailyHours(job, profile) {
    if (job["daily-hours"]>24) {
      return {
        body: "As horas dedicadas por dia no job não podem ultrapassar 24hrs",
        title: "message",
      };
    } else if (job["daily-hours"] > profile["hours-per-day"]) {
      return {
        body:
          "As horas dedicadas por dia no job não podem ultrapassar as horas trabalhadas por dia",
        title: "message",
      };
    }else if(job["daily-hours"] <= 0){
      return {
        body:
          "As horas por dia dedicadas ao job não podem estar vazias ou ser menor que 1 hora",
        title: "message",
      };
    }
  },
};
