const process = require('process'); 
const RandomGenerator = require ("./RandomGenerator");
const Queue =  require ("./Queue");
const Scheduler = require ("./Scheduler");
const {round, probability} = require("./mathematicalStuffs");


//Variáveis parametrizadas
const servers =             parseInt(process.argv[2]);
const maxLength =           parseInt(process.argv[3]);
const minArrival =          parseInt(process.argv[4]);
const maxArrival =          parseInt(process.argv[5]);
const minAttendance =       parseInt(process.argv[6]);
const maxAttendance =       parseInt(process.argv[7]);
const initialTimeArrival =  parseInt(process.argv[8]);
const results = [];


//Roda as cinco vezes de acordo com as especificações do trabalho;
for (let i = 0; i < 5; i++) {
//Método de geração de números pseudoaleatórios
    const linearCongruenceP = {
        modulus: 100000,
        a: 3490,
        c: 997,
    }
    
    //Inicializa filas e escalonador e gera números pseudoaleatórios
    const randomGenerator = 
    new RandomGenerator(linearCongruenceP.modulus, linearCongruenceP.a, linearCongruenceP.c);
    randomGenerator.generateRandoms();
    const randomNumbers = randomGenerator.seeds;
    
    const queue = new Queue(maxLength);
    //Inicializa todas as posições com 0;
    queue.initializeAllPositions();
    const scheduler = 
    new Scheduler(queue, randomNumbers, servers, maxLength , minArrival, maxArrival, minAttendance, maxAttendance, initialTimeArrival );
    
    //Agenda primeiro evento
    scheduler.scheduleArrival();
    //Roda o escalonador
    while (scheduler.randomList.length > 0) {
        scheduler.runEvent();
    }
    //Coloca os resultados em um array para calcular média
    results.push(scheduler.queue);

}
//Cria uma fila contendo as médias das cinco execuções
const averageQueue = new Queue();
function calcAverages(){
    for (let i = 0; i < results.length; i++) {
        averageQueue.losses += results[i].losses;
        for (let j = 0; j <= maxLength; j++){    
            averageQueue.positionTime[j] = (averageQueue.positionTime[j] || 0) + results[i].positionTime[j];
        }
    
    }
    averageQueue.losses = round(averageQueue.losses/5, 0);
    for (let i = 0; i <= maxLength; i++)  {
        averageQueue.positionTime[i] = averageQueue.positionTime[i]/5;
    }
}
    calcAverages();
    

    //Prints no terminal;

    console.log("-------------------------------------------------------------------")
    console.log ("********************  SIMPLE QUEUE SIMULATOR *********************")
    console.log("-------------------------------------------------------------------")
    const queueTime = round(averageQueue.positionTime.reduce((acc, cur) => acc + cur, 0));
    const description = `Queue (G/G/${servers}${maxLength ? `/${maxLength}`: "" }) `
    console.log(description);
    const arrival = `Arrival: ${minArrival} ... ${maxArrival} `;
    console.log(arrival);
    const attendance = `Service: ${minAttendance} ... ${maxAttendance} `;
    console.log(attendance);
    console.log("-------------------------------------------------------------------")
    const header = "  State               Time                      Probability " ;
    console.log(header);
    averageQueue.positionTime.forEach((value, index) => {
        const line = `      ${index}               ${round(value).toPrecision(
          10
        )}                ${probability(value, queueTime)}`;
        console.log(line);
      });
      const line = `    Total             ${round(queueTime).toPrecision(10)}                ${probability(queueTime, queueTime)}`;
      console.log("-------------------------------------------------------------------")
      console.log(line);
      console.log("    Losses  " + "             " + averageQueue.losses);




