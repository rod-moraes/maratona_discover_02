const Job = require("../model/Job");
const JobUtils = require("../utils/JobUtils");
const Profile = require("../model/Profile");
module.exports = {
  async index(req, res) {
    let jobs = await Job.get();
    const profile = await Profile.get();
    const verifyJobs = (!jobs[0]?.initial_job)
    const verifyLength = jobs.length > 0;

    //quando eu inicio o Banco de dados
    
    if (verifyLength) {
      if (verifyJobs) {
        jobs = JobUtils.initialJobsProgressToDo(jobs,profile);
      }
      jobs = JobUtils.verifyJobsProgressToDoDone(jobs,profile);
    }

    let statusCount = {
      progress: 0,
      done: 0,
      "to-do": 0,
      total: jobs.length,
    };

    let jobTotalHours = 0;

    const updatedJobs = jobs.map((job) => {
      const remaining = JobUtils.remainingDays(job);

      statusCount[job.status] += 1;

      jobTotalHours =
      job.status == "progress"
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
