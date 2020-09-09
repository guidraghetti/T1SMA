const { range, round } = require("./mathematicalStuffs")

const Event = require("./Event");

class Scheduler {
    constructor(queue, randomList, servers, maxLength, minArrival, maxArrival, minAttendance, maxAttendance, initialTimeArrival) {
        this.queue = queue;
        this.scheduledEvents = [];
        this.currentTime = 0;
        this.previousTime = 0;
        this.randomList = randomList;
        this.servers = servers;
        this.maxLength = maxLength;
        this.minArrival = minArrival;
        this.maxArrival = maxArrival;
        this.minAttendance = minAttendance;
        this.maxAttendance = maxAttendance;
        this.initialTimeArrival = initialTimeArrival;
    }
    
    getRandom() {
        const random = this.randomList[0];
        this.randomList.shift();
        return random;
    }

    timeAccount() {
        const time = this.currentTime - this.previousTime;
        this.queue.positionTimeAccount(time);
    }


    arrival() {
        this.timeAccount();

        if (this.queue.queuePosition < this.maxLength) {
            this.queue.queuePosition++;
            if (this.queue.queuePosition <= this.servers) {
                this.scheduleExit();
            }
        } else{
            this.queue.losses++;
        }
        this.scheduleArrival();

    }

    exit() {
        this.timeAccount();
        if (this.queue.queuePosition > 0) {
            this.queue.queuePosition--;
        }
        if (this.queue.queuePosition >= this.servers) {
            this.scheduleExit();
        }

    }

    scheduleArrival() {
        let timeOfArrival;

        if (this.currentTime === 0) {
            timeOfArrival = this.currentTime + this.initialTimeArrival;
        }
        else {
            timeOfArrival =
                this.currentTime + range(this.minArrival, this.maxArrival, this.getRandom());
        }

        const pushArrivalEvent = new Event(
            "CHEGADA",
            round(timeOfArrival)
        );
        this.scheduledEvents.push(pushArrivalEvent);
    }

    scheduleExit() {
        const timeOfExit =
            this.currentTime + range(this.minAttendance, this.maxAttendance, this.getRandom());

        const pushExitEvent = new Event("SAÍDA", round(timeOfExit));
        this.scheduledEvents.push(pushExitEvent);
    }
    runEvent() {
        const firstEventToRun = this.scheduledEvents.sort((a, b) => {
            if (a.time > b.time) return 1;
            if (b.time < a.time) return -1;
            return 0;
        });
        const event = firstEventToRun.shift();
        this.previousTime = this.currentTime;
        this.currentTime = event.time;

        if (event.type === "CHEGADA") {
            this.arrival();
        }
        else if (event.type === "SAÍDA") {
            this.exit();
        }
    }
}

module.exports = Scheduler;