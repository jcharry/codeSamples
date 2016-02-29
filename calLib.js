// Wrap whole lib in IIFE to ensure code doesn't collide
(function(global) {

    // Give our factory an element, start date, and number of days
    //var HabitCal = function(elt, startDate, length) {
        //return new HabitCal.init(elt, startDate, length);
    //};

    // these are labels for the days of the week
    var cal_days_labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // these are human-readable month name labels, in order
    var cal_months_labels = ['January', 'February', 'March', 'April',
                 'May', 'June', 'July', 'August', 'September',
                 'October', 'November', 'December'];

    // these are the days of the week for each month, in order
    var cal_days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];


    // Constructor function
    var HabitCal = function(elt, startDate, length) {
        this.elt = elt;
        this.startDate = startDate;

        // Get portions of date
        this.month = cal_months_labels[startDate.getMonth()];
        this.monthLength = cal_days_in_month[startDate.getMonth()];
        this.day = cal_days_labels[startDate.getDay()]; 
        this.date = startDate.getDate();
        this.year = startDate.getFullYear();

        // Account for leap years
        if (isLeapYear(startDate) && this.month === 'February') this.monthLength = 29;

        this.length = length;
        this.days = createDays(this.startDate, this.length);

        // upon creation of this obj, append all 'day' elts to parent div
        var ul = document.createElement('ul');
        ul.className = 'listOfDays';
        appendElts(ul, this.days);
        this.elt.appendChild(ul);
    };

    // Add methods to our prototype 
    HabitCal.prototype = {

        // Returns the length of the habit cal
        getLength: function() {
            return this.length;
        },

        // resets the length of the habit cal
        // TODO: Needs actual implementation
        setLength: function(length) {
            this.length = length;
        },

        // Reset the start date
        // TODO: Needs actual implementation
        setStartDate: function(date) {
            this.startDate = date;
        },

        // Hide this cal
        hide: function() {
            this.elt.style.opacity = 0;
        },

        // Show this cal
        show: function() {
            this.elt.style.opacity = 1;
        },

        // Allow for user to set what happens when a day is tapped
        setTapFunctionality: function(behaviorFn) {
            for (var i = 0; i < this.days.length; i++) {
                var elt = this.days[i];
                // TODO: Implement touch solution here
                // 'Click' isn't very responsive on mobile
                elt.addEventListener('click', behaviorFn);
                //elt.addEventListener('touchmove');
            }
        },

        formatForCurrentDate: function(dateObj) {
            // change opacity of previous days on the object, and highlight li item corresponding to current day
            
            var beforeToday = true;
            // Find li corresponding to today
            for (var i = 0; i < this.days.length; i++){
                var dateString = cal_months_labels[dateObj.getMonth()] + ' ' + dateObj.getDate();
                if (this.days[i].innerHTML === dateString) {
                    this.days[i].style.fontSize = '14pt'; 
                    beforeToday = false; 
                    continue;   // break out of this iteration of the 'for' loop
                } 
                
                if (beforeToday) {
                    this.days[i].style.opacity = 0.5;
                } else {
                    //this.days[i].style.backgroundColor = 'blue';
                }
                this.days[i].removeEventListener('click', dayTapped);

                //else if (this.days[i].innerHTML !== dateString && beforeToday === true) {
                    //this.days[i].style.opacity = 0.5;
                //} else if (this.days[i].innerHTML !== dateString && beforeToday === false) {
                    ////this.days[i].style.backgroundColor = 'blue';
                    //this.days[i].removeEventListener('click', function() {

                    //});
                //}
            }
            
        },
    };
    
    /* IGNORE THIS FOR NOW
    // Methods are created on the Cal.proto, but 
    // but here we set the actual constructor fnc's (Cal.init's) proto
    // makes it easier to type I guess?
    //Cal.init.prototype = Cal.prototype;
    */

    // internal function to create divs 
    // based on start date and length of goal
    function createDays(dateObj, length) {
        var days = [];
        var contentArr = createContentArray(dateObj, length);
        for (var i = 0; i < length; i++) {
            var d = document.createElement('li');
            d.className = 'day';
            var content = document.createTextNode(contentArr[i]);
            d.appendChild(content);
            days.push(d);
        }
        return days;
    }

    // Internal function to append all divs to a parent elt
    function appendElts(elt, itemsToAppend) {
        for (var i = 0; i < itemsToAppend.length; i++) {
            elt.appendChild(itemsToAppend[i]);
        }
    }

    // Internal function to create an array of dates to populate div content
    function createContentArray(startDate, length) {
        var arr = [];
        var currentDay = startDate.getDate();
        var currentMonth = startDate.getMonth();
        var currentMonthString = cal_months_labels[currentMonth];
        var currentMonthLength = cal_days_in_month[currentMonth];

        if (isLeapYear(startDate) && currentMonth === 1) currentMonthLength = 29;
 
        for (var i = 0; i < length; i++) {
            if (currentDay > currentMonthLength) {
                currentMonth++;
                currentMonthLength = cal_days_in_month[currentMonth];
                currentMonthString = cal_months_labels[currentMonth];
                currentDay = 1;
            }
           arr.push(currentMonthString + ' ' + currentDay); 
           currentDay++;
        }
        return arr;
    }

    function isLeapYear(date) {
        return ((date.getFullYear() % 4 === 0 && date.getFullYear() % 100 !== 0) || date.getFullYear() % 400 === 0);
    }

    // Expose HabitCal object on the global object
    global.HabitCal = HabitCal;

}(this));


