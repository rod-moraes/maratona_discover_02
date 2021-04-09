```markdown
# Bora Codar

- [x]  Revisão da última aula
- [x]  O que veremos até o final dessa aula?

## Salvar Job
	* [x] Form job
    - [x] method post
    - [x] action="/job"
	* [x] rota /job POST
    - [x] req.body
    - [x] urlencoded
	* [x] Criar array de jobs
    - [x] enviar para o index.ejs
    - [x] .forEach
    - [x] ajustes dos dados no index
	* [x] Configurar jobs na criação de um novo Job
    - [x] job id: pegar o id do ultimo item do array
    - [x] created_at: Date.now()
      - [x] para o cálculo de dias restantes
    - [x] total-hours
    - [x] daily-hours
    - [x] name
	* [x] Atualizar os jobs no index, antes de apresentar

## Remaining calculation
  * [x] Devemos calcular sempre que apresentar o projeto, 
				pois poderemos mudar os dados do projeto a qualquer momento
  * [x] remainingDays = total hours do job / daily hours do job
  * [x] adicionar os dias à data de criação, para criar uma data futura
  * [x] subtrair da data futura, o número de dias restantes baseado na data de hoje
  * [x] pegar a diferença de milissegundos para dias
  * [x] update status (done | progress)
  * [x] budget: profile value hour * total job hours
    - [x] deverá ser atualizado sempre que apresentar o projeto, 
						pois poderá variar dependendo dos dados do projeto ou dos dados do perfil
	* [x] atualizar o index.ejs
    - [x] Prazo encerrado ao invés de 0 dias para a entrega
	* [x] adicionar uma entrada no jobs[] para o prazo encerrado
	
## Refatorar Jobs
    - [x] Criar um Object Literal Jobs
    - [x] Adicionar data em Jobs
    - [x] Adicionar index() e create()

## Object Profile
	* [x] data
  * [x] update()
    - [x] Calculo de custo de hora
	    * [x] weeksPerYear
	    * [x] weeksPerMonth = weeks per year - vacation
	    * [x] total hours per week
	    * [x] monthly total hours
	    * [x] value hour = monthly budget / monthly total hours
    - [x] redirect to /profile

## Editar job
  * [x] criar função show
    - [x] rota job/:id GET
    - [x] req.params
    - [x] .find
    - [x] Job not found
    - [x] service: calculate job budget
    - [x] refactor index to use service
    - [x] update job-edit.ejs
  * [x] criar função de update
    - [x] rota /job/:id POST
    - [x] .find
    - [x] job not found
    - [x] updatedJob
    - [x] Job.data= Job.data.map()
    - [x] redirect

## Delete job
  * [x] route /job/delete/:id POST
  * [x] Job.controller.delete()
  * [x] req.params.id
  * [x] Job.data.filter()
  * [x] redirect to /
	* [x] Delete all Jobs and find error
    - [x] lastId of Job.controller.create()
    - [x] use optional chaining operator ?.
    - [x] use Logical OR operator
```