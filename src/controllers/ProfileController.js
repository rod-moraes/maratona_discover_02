const Profile = require("../model/Profile");
const Job = require("../model/Job");

module.exports = {
  async index(req, res) {
    return res.render("profile", { profile: await Profile.get(), message: {body: "Alterações de horas por dia só afeta jobs em espera",
    title: "message",} });
  },
  async update(req, res) {
    const profile = await Profile.get();
    const jobs = await Job.get();
    const data = req.body;
    const weeksPerYear = 52;
    const weeksPerMonth = (weeksPerYear - data["vacation-per-year"]) / 12;
    const weekTotalHours = data["hours-per-day"] * data["days-per-week"];
    const monthlyTotalHours = weekTotalHours * weeksPerMonth;
    const verifyHoursPerDay = data["hours-per-day"] > 24;
    const verifyDaysPerWeek =
      data["days-per-week"] < 1 || data["days-per-week"] > 7;
    const verifyWeeksPerYear =
      data["vacation-per-year"] >= weeksPerYear ||
      data["vacation-per-year"] < 0;
    const verifyName = data.name.replace(/ /g, "") == "";
    const verifyUrl = data.avatar.replace(/ /g, "") == "";
    const verifyTypeMoney = Number(data["monthly-budget"].replace(",", "."));
    const verifyMoneyMonth =
          verifyTypeMoney <= 0;
    const job = jobs.find(
      (job) => Number(job["daily-hours"]) > Number(data["hours-per-day"])
    );
    
  if(!verifyTypeMoney){
    const message = {
      body: "Você só pode digitar numeros no tipo de dinheiro",
      title: "message",
    };
    return res.render("profile", { profile: await Profile.get(), message });
  }
  else if (verifyName) {
      const message = {
        body: "O nome não pode estar vazio",
        title: "message",
      };
      return res.render("profile", { profile: await Profile.get(), message });
    } else if (verifyUrl) {
      const message = {
        body: "O link da imagem não pode estar vazio",
        title: "message",
      };
      return res.render("profile", { profile: await Profile.get(), message });
    } else if (verifyMoneyMonth) {
      const message = {
        body: "O valor mensal deve ser maior que 0",
        title: "message",
      };
      return res.render("profile", { profile: await Profile.get(), message });
    } else if (verifyHoursPerDay) {
      const message = {
        body: "As horas dedicadas por dia não podem ultrapassar 24hrs",
        title: "message",
      };
      return res.render("profile", { profile: await Profile.get(), message });
    } else if (job) {
      const message = {
        body:
          "As horas dedicadas por dia é menor que a hora criada em um do seus jobs, favor atualizar os jobs antes de atualizar o perfil",
        title: "message",
      };
      return res.render("profile", { profile: await Profile.get(), message });
    } else if (verifyDaysPerWeek) {
      const message = {
        body:
          "Você não pode digitar numeros menores que 1 ou maiores que 7 para os dias da semana",
        title: "message",
      };
      return res.render("profile", { profile: await Profile.get(), message });
    } else if (verifyWeeksPerYear) {
      const message = {
        body:
          "Você não pode digitar numeros menores que 0 ou maiores que 51 para as semanas de ferias",
        title: "message",
      };
      return res.render("profile", { profile: await Profile.get(), message });
    }

    await Profile.update({
      ...profile,
      ...data,
      "value-hour": verifyTypeMoney / monthlyTotalHours,
    });
    return res.redirect("/profile");
  },
};
