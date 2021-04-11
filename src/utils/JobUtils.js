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
};
