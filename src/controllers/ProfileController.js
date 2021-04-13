const Profile = require("../model/Profile");

module.exports = {
  async index(req, res) {
    return res.render("profile", { profile: await Profile.get(), message: {} });
  },
  async update(req, res) {
    const data = req.body;
    const weeksPerYear = 52;
    const weeksPerMonth = (weeksPerYear - data["vacation-per-year"]) / 12;
    const weekTotalHours = data["hours-per-day"] * data["days-per-week"];
    const monthlyTotalHours = weekTotalHours * weeksPerMonth;
    const verifyHoursPerDay = data["hours-per-day"] > 24;
    const profile = await Profile.get();

    if (verifyHoursPerDay) {
      const message = {
        body: "As horas dedicadas por dia não podem ultrapassar 24hrs",
        title: "message",
      };
      return res.render("profile", { profile: await Profile.get(), message });
    }

    await Profile.update({
      ...profile,
      ...data,
      "value-hour": data["monthly-budget"] / monthlyTotalHours,
    });
    return res.redirect("/profile");
  },
};
