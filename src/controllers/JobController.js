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
      req.body["daily-hours"] > 24 || req.body["daily-hours"]<=0;
    const verifyName = req.body.name.replace(/ /g, "")== "";
    const verifyHoursJob = Number(req.body["total-hours"]) <= 0;
    
    if(verifyName){
      const message = {
        body:
        "O nome do job não pode estar vazio",
        title: "message",
      }
      return res.render("job", { message });
    }
    else if (verifyDailyHours) {
      const message = JobUtils.verifyDailyHours(req.body, profile);
      return res.render("job", { message });
    }else if(verifyHoursJob){
      const message = {
        body:
        "O numero total de horas do trabalho deve ser maior que 0 horas",
        title: "message",
      }
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
    const erroName = erro == "erroName";
    const erroHoursDay = erro == "erroHoursDay";
    const erroHoursJob = erro == "erroHoursJob";
    const verifyJobStatus = job.status == "progress";

    if (!job) {
      return res.send("Job not found!");
    }

    job.budget = JobUtils.calculateBudget(job, profile["value-hour"]);
    if (erroName) {
      const message = {
        body: "O nome do trabalho não pode estar vazio",
        title: "message",
      };
      return res.render("job-edit", { job, message });
    } else if (erroHoursDay) {
      const message = {
        body:
          "As horas dedicadas por dia no job não podem ultrapassar as horas trabalhadas por dia do seu perfil ou ser menor que 1 hora",
        title: "message",
      };
      return res.render("job-edit", { job, message });
    } else if (erroHoursJob) {
      const message = {
        body: "O numero total de horas do trabalho deve ser maior que 0 horas",
        title: "message",
      };
      return res.render("job-edit", { job, message });
    } else if(verifyJobStatus){
      const message = {
        body: "ATENÇÃO: Trabalhos em progresso não poderam ser alterados as quantidades de horas dedicadas por dia",
        title: "message",
      };
      return res.render("job-edit", { job, message });
    }
    return res.render("job-edit", { job, message: {} });
  },
  async update(req, res) {
    const jobs = await Job.get();
    const profile = await Profile.get();
    const jobId = req.params.id; //Pega o dado da url
    const job = jobs.find((job) => Number(job.id) == Number(jobId));
    const verifyDailyHours =
      req.body["daily-hours"] > profile["hours-per-day"] ||
      req.body["daily-hours"] > 24 ||
      req.body["daily-hours"] <= 0;
    const verifyName = req.body.name.replace(/ /g, "") == "";
    const verifyHoursJob = Number(req.body["total-hours"]) <= 0;

    if (verifyDailyHours) {
      return res.redirect("/job/" + jobId + "?p=erroHoursDay");
    } else if (verifyName) {
      return res.redirect("/job/" + jobId + "?p=erroName");
    } else if (verifyHoursJob) {
      return res.redirect("/job/" + jobId + "?p=erroHoursJob");
    }



    const updatedJob = {
      id: jobId,
      name: req.body.name,
      "total-hours": req.body["total-hours"],
      "daily-hours": job.status=="progress"? job["daily-hours"]:req.body["daily-hours"],
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
