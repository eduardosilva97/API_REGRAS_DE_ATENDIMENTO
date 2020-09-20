module.exports.messageResponse = function(error, statusCode, message) {
    this.error = error;
    this.statusCode = statusCode;
    this.message = message || '';
}

module.exports.rulesMessageResponse = function(error, statusCode, message, rules) {
    this.error = error;
    this.statusCode = statusCode;
    this.message = message || '';
    this.rules = rules || [];
}

module.exports.rulesResponse = function(error, statusCode, rules) {
    this.error = error;
    this.statusCode = statusCode;
    this.rules = rules || [];
}

module.exports.availableTimesResponse = function(error, statusCode, available_times) {
    this.error = error;
    this.statusCode = statusCode;
    this.available_times = available_times || [];
}

