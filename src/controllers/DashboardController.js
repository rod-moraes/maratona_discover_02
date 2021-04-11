const Job = require("../model/Job");
const JobUtils = require("../utils/JobUtils");
const Profile = require("../model/Profile");
module.exports = {
  async index(req, res) {
    let jobs = await Job.get();
    const profile = await Profile.get();

    let jobHours = 0;
    //quando eu inicio o Banco de dados
    if (!jobs[0]?.initial_job && jobs.length > 0) {
      jobs = jobs.map((job) => {
        if (jobHours <= profile["hours-per-day"]) {
          jobHours += job["daily-hours"];
          job.initial_job = Date.now();
          job.status = "progress";
        } else {
          job.status = "to do";
        }
        return job;
      });
    } else if (jobs.length > 0) {
      //Verificar se algum "progress virou done"
      jobs = jobs.map((job) => {
        if (job.status == "progress") {
          const remaining = JobUtils.remainingDays(job);
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
      //
    }

    let statusCount = {
      progress: 0,
      done: 0,
      total: jobs.length,
    };

    let jobTotalHours = 0;

    const updatedJobs = jobs.map((job) => {
      const remaining = JobUtils.remainingDays(job);
      const status = remaining <= 0 ? "done" : "progress";

      statusCount[status] += 1;

      jobTotalHours =
        status == "progress"
          ? jobTotalHours + Number(job["daily-hours"])
          : jobTotalHours;

      return {
        ...job,
        remaining,
        budget: JobUtils.calculateBudget(job, profile["value-hour"]),
      };
    });

    const freeHours = profile["hours-per-day"] - jobTotalHours;

    jobs.map((job) => {
      Job.update(job);
    });

    return res.render("index", {
      jobs: updatedJobs,
      profile: profile,
      statusCount: statusCount,
      freeHours: freeHours,
    });
  },
};
