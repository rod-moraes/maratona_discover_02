const Profile = require("../model/Profile");
const Job = require("../model/Job");
const JobUtils = require("../utils/JobUtils");

module.exports = {
  save(req, res) {
    const jobs = Job.get();
    const newId = jobs[jobs.length - 1]?.id ? jobs[jobs.length - 1]?.id + 1 : 1;
    const job = {
      id: newId,
      name: req.body.name,
      "daily-hours": req.body["daily-hours"],
      "total-hours": req.body["total-hours"],
      createdAt: Date.now(),
    };
    jobs.push(job);
    //Job.update(jobs);
    return res.redirect("/");
  },
  create(req, res) {
    return res.render("job");
  },
  show(req, res) {
    const jobs = Job.get();
    const profile = Profile.get();
    const jobId = req.params.id;
    const job = jobs.find((job) => Number(job.id) == Number(jobId));

    if (!job) {
      return res.send("Job not found!");
    }

    job.budget = JobUtils.calculateBudget(job, profile["value-hour"]);
    return res.render("job-edit", { job });
  },

  update(req, res) {
    const jobs = Job.get();
    const jobId = req.params.id; //Pega o dado da url
    const job = jobs.find((job) => Number(job.id) == Number(jobId));

    if (!job) {
      return res.send("Job not found!");
    }

    const updateJob = {
      ...job,
      name: req.body.name,
      "total-hours": req.body["total-hours"],
      "daily-hours": req.body["daily-hours"],
    };
    const newJobs = jobs.map((job) => {
      if (Number(job.id) === Number(jobId)) {
        job = updateJob;
      }
      return job;
    });
    Job.update(newJobs);
    return res.redirect("/job/" + jobId);
  },

  delete(req, res) {
    const jobId = req.params.id;
    Job.delete(jobId);
    return res.redirect("/");
  },
};
