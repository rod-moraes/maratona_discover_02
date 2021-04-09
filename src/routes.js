const express = require("express")
const routes = express.Router()
const views = __dirname + "/views/"

const Profile = {
  data: {
    name: "Rodrigo Moraes",
    avatar: "https://github.com/rod-moraes.png",
    "monthly-budget": 4500,
    "hours-per-day": 20,
    "days-per-week": 4,
    "vacation-per-year": 10,
    "value-hour": 75
  },
  controller: {
    index(req,res){
      return res.render(views + "profile",{profile:Profile.data})
    },
    update(req,res){
      const data = req.body
      const weeksPerYear = 52
      const weeksPerMonth = (weeksPerYear-data["vacation-per-year"]) / 12
      const weekTotalHours = data["hours-per-day"]*data["days-per-week"]
      const monthlyTotalHours = weekTotalHours*weeksPerMonth
      data["value-hour"] = data["monthly-budget"]/monthlyTotalHours
      Profile.data = data
      return res.redirect('/profile')
    }
  }
}

const Job = {
  data: [{
    id: 1,
    name: "Pizzaria Guloso",
    "daily-hours": 2,
    "total-hours": 60,
    createdAt: Date.now(),
  },
  {
    id: 2,
    name: "OneTwo Project",
    "daily-hours": 3,
    "total-hours": 47,
    createdAt: Date.now(),
  }],
  controller: {
    index(req,res){
      const updatedJobs = Job.data.map((job)=>{
        const remaining = Job.services.remainingDays(job)
        const status = remaining<=0 ? 'done':'progress'
        return {
          ...job,
          remaining,
          status,
          budget: Job.services.calculateBudget(job, Profile.data['value-hour'])
        }
      })
      
      return res.render(views + "index",{jobs:updatedJobs})
    },
    save(req,res){
      const newId = Job.data[Job.data.length-1]?.id ? Job.data[Job.data.length-1]?.id+1 : 1
      const job = {
        id: newId,
        name: req.body.name,
        "daily-hours": req.body["daily-hours"],
        "total-hours": req.body["total-hours"],
        createdAt: Date.now()
      }
      Job.data.push(job)
      return res.redirect('/')
    },
    create(req,res){ 
      return res.render(views + "job")
    },
    show(req,res){
      const jobId = req.params.id
      const job = Job.data.find(job => Number(job.id) == Number(jobId))
      
      if(!job){
        return res.send("Job not found!")
      }

      job.budget = Job.services.calculateBudget(job, Profile.data['value-hour'])
      return res.render(views + "job-edit",{job})
    },

    update(req,res){
      const jobId = req.params.id
      const job = Job.data.find(job => Number(job.id) == Number(jobId))
      
      if(!job){
        return res.send("Job not found!")
      }

      const updateJob = {
        ...job,
        name: req.body.name,
        "total-hours": req.body["total-hours"],
        "daily-hours": req.body["daily-hours"]
      }
      Job.data = Job.data.map(job =>{
        if(Number(job.id)===Number(jobId)){
          job = updateJob
        }
        return job
      })
      return res.redirect("/job/"+ jobId)
    },

    delete(req,res){
      const jobId = req.params.id
      Job.data = Job.data.filter(job => Number(job.id) !== Number(jobId))
      return res.redirect("/")
    }

  },
  services: {
    remainingDays(job){
      const remainingDays = (job["total-hours"]/job["daily-hours"]).toFixed()
      const convertMstoDay = 1.1574074074067*(10**-8)
      const createdDate = new Date(job.createdAt)
      const dueDay = createdDate.getDate() + Number(remainingDays)
      const dueDate = createdDate.setDate(dueDay)
  
      const timeDiffInMs = dueDate - Date.now()
      const dayDiff = Math.floor(timeDiffInMs*convertMstoDay)
      
      return dayDiff
    },
    calculateBudget: (job,valueHour) => valueHour * job["total-hours"]
  }
}

routes.get('/',Job.controller.index)
routes.get('/job',Job.controller.create)
routes.post('/job',Job.controller.save)
routes.get('/job/:id',Job.controller.show )
routes.post('/job/:id',Job.controller.update)
routes.post('/job/delete/:id',Job.controller.delete)
routes.get('/profile',Profile.controller.index)
routes.post('/profile',Profile.controller.update)

module.exports = routes;