const { round } = require('./mathematicalStuffs');

//Cria objeto de fila, com método de atualizar tempo
class Queue {
    constructor (maxLength) {
        this.queuePosition = 0;
        this.losses = 0;
        this.maxLength = maxLength;
        this.positionTime = [this.maxLength];
    }
    initializeAllPositions() {
        for (let i = 0; i <= this.maxLength; i++) {
            this.positionTime[i] = 0;
        }
    }
    
    positionTimeAccount(time) { 
        this.positionTime[this.queuePosition] = round((this.positionTime[this.queuePosition] || 0) + time);
    }
}

module.exports = Queue;