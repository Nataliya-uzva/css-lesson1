window.onload = function() {
    var data = [
        {account: '11970', name: 'Galax', multiplier: 1.265, perYear: 2.75},
        {account: '7348', name: 'Veronica', multiplier: 1.20, perYear: 2.0},
        {account: '10555', name: 'Dragonfly', multiplier: 1.3, perYear: 2.95},
        {account: '10504', name: 'Condor', multiplier: 1.15, perYear: 1.81},
        {account: '10469', name: 'Shark_007', multiplier: 1.17, perYear: 1.7}
    ];

    var scroll = document.querySelector('.scroll');

    var week = document.querySelector('.numbers'),
        month = document.querySelectorAll('.numbers')[1];

    var range = new Range({
        element: document.querySelector('#my-range'),
        onSlide: function() {
            scroll.textContent = range.value;
        },
        onChange: function(event) {
            if (document.querySelector('.active') != null) {
                var elem = document.querySelector('.active');
                var ind = elem.dataset.index;
                week.textContent = culculateWeekDeposit(range.value, ind);
                month.textContent = culculateYearProfit(range.value, ind);
            }
        },
        onStart: function(e) {
            scroll.textContent = range.value;
            week.textContent = culculateWeekDeposit(range.value, 0);
            month.textContent = culculateYearProfit(range.value, 0);
        },
        maxValue: 10000
    });

    range.setValue(1000);

    scroll.onchange = function(e) {
        if (this.textContent > range.options.maxValue) {
            this.textContent = range.options.maxValue;
        } else if (this.textContent < range.options.minValue) {
            this.textContent = range.options.minValue;
        }
    };
    var ul = document.getElementById('tab');

    function createList (data) {
        for (var i = 0, len = data.length; i < len; i++){
            var span = document.createElement('span'),
                a = document.createElement('a'),
                li =  document.createElement('li');
            a.innerHTML='<span>' + data[i]['account'] + '</span>' + data[i]['name'];
            a.setAttribute('data-index', (i + ''));
            li.appendChild(a);
            ul.appendChild(li);
            if (!i){
                a.classList.add('active');
            }
        }
    }
    createList (data);

    function aClick (event) {
        var event = event || window.event;
        event.preventDefault();
        var target = event.target || event.srcElement;
        while (target.nodeName !== 'A' && target !== null) {
            target = target.parentElement;
        }
        if (!target)
            throw new Error('Печалька :(');

        var arr = document.querySelectorAll('.sidebar a'); // как убрать класс без этого цикла?
        for (var i = 0, len = arr.length; i < len; i++) {
            arr[i].classList.remove('active');
        }
        target.classList.add('active');
        var ind = target.dataset.index;

        week.textContent = culculateWeekDeposit(range.value, ind);
        month.textContent = culculateYearProfit(range.value, ind);
    }
    tab.addEventListener('click', aClick);

    function culculateWeekDeposit(value, ind) {
        return Math.round(value * data[ind]['multiplier']) + ' $';
    };
    function culculateYearProfit(value, ind) {
        return Math.round(value * 10 * data[ind]['perYear']) + ' $';
    }

};









