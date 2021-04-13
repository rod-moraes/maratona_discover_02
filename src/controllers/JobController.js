const Profile = require("../model/Profile");
const Job = require("../model/Job");
const JobUtils = require("../utils/JobUtils");

module.exports = {
  async up(req, res) {
    const jobId = req.params.id;
    const validaded = await Job.up(jobId);
    return validaded ? res.redirect("/") : res.redirect("/not-found");
  },
  async down(req, res) {
    const jobId = req.params.id;
    const validaded = await Job.down(jobId);
    return validaded ? res.redirect("/") : res.redirect("/not-found");
  },
  async save(req, res) {
    const profile = await Profile.get();
    const verifyDailyHours =
      req.body["daily-hours"] > profile["hours-per-day"] ||
      req.body["daily-hours"] > 24;

    if (verifyDailyHours) {
      const message = JobUtils.verifyDailyHours(req.body, profile);
      return res.render("job", { message });
    }

    const job = {
      name: req.body.name,
      "daily-hours": req.body["daily-hours"],
      "total-hours": req.body["total-hours"],
      createdAt: Date.now(),
    };
    await Job.create(job);
    return res.redirect("/");
  },
  create(req, res) {
    const message = {
      body: "",
      title: "",
    };
    return res.render("job", { message });
  },
  async show(req, res) {
    const jobs = await Job.get();
    const profile = await Profile.get();
    const jobId = req.params.id;
    const erro = req.query?.p;
    const job = jobs.find((job) => Number(job.id) == Number(jobId));

    

    if (!job) {
      return res.send("Job not found!");
    }

   
    job.budget = JobUtils.calculateBudget(job, profile["value-hour"]);
    if(erro){
      const message = {
        body:
          "As horas dedicadas por dia no job não podem ultrapassar as horas trabalhadas por dia",
        title: "message",
      }
      return res.render("job-edit", {job,message});
    }
    return res.render("job-edit", { job,message:{}});
  },

  async update(req, res) {
    const profile = await Profile.get();
    const jobId = req.params.id; //Pega o dado da url
    const verifyDailyHours =
      req.body["daily-hours"] > profile["hours-per-day"] ||
      req.body["daily-hours"] > 24;

    if (verifyDailyHours) {
      const message = JobUtils.verifyDailyHours(req.body, profile);
      return res.redirect("/job/" + jobId + "?p=erro");
    }

    const updatedJob = {
      id: jobId,
      name: req.body.name,
      "total-hours": req.body["total-hours"],
      "daily-hours": req.body["daily-hours"],
      initial_job: req.body.initial_job,
      status: req.body.status,
    };

    Job.updateData(updatedJob);
    return res.redirect("/job/" + jobId);
  },
  async delete(req, res) {
    const jobId = req.params.id;
    await Job.delete(jobId);
    return res.redirect("/");
  },
};
