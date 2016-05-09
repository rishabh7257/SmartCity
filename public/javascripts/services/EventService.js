wfms.service('EventService', function() {

	this.getDate = function getDate(dateTime) {
        return dateTime.slice(0, 10);
    }

    this.getTime = function getTime(dateTime) {
        return dateTime.slice(11, 16)
    }

    this.extractEvent = function extractEvent(data) {
        var events = data.data.search.events.event;
        var tableRow = events.length;
        var eventArray = [];
        for (var i = 0; i < tableRow; i++) {
            var eachEvent = {
                'date': this.getDate(events[i].start_time),
                'time': this.getTime(events[i].start_time),
                'address': events[i].venue_address,
                'city': events[i].city_name,
                'name': events[i].venue_name,
                'predictedHeadCount': this.getPredictedHeadCount(events[i].price)
            }
            eventArray.push(eachEvent);
        }
        return eventArray
    }
    this.getPredictedHeadCount = function getPredictedHeadCount(price) {
        if (price) {
            var predictedHeadCount = "";
            if (price[0] == '$') {
                price = price.slice(1)
            }
            for (var i = 0; i < price.length; i++) {
                if (price[i] == " ") {
                    console.log(predictedHeadCount);
                    if (((parseInt(predictedHeadCount) * 100) / 10)) {
                        return ((parseInt(predictedHeadCount) * 100) / 10);    
                    } else {
                        return 100;
                    }
                } else {
                    predictedHeadCount = predictedHeadCount + price[i];
                }
            }
        } else {
            return 50;
        }
    }
	
});