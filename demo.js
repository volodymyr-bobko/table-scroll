$(function () {

    var rows = [];
    for (var i = 0; i < 100; i++) {
        rows.push({ number: i + 1 });
    }

    var semple1Html = Mustache.to_html($('#tamplate-semple-1').html(), getFixedColumnsData());
    $(semple1Html).appendTo($('#holder-semple-1')).table_scroll({
        fixedColumnsLeft: 3,
        fixedColumnsRight: 1,
        columnsInScrollableArea: 3,
        scrollX: 5,
        scrollY: 10
    });

    var semple2Html = Mustache.to_html($('#tamplate-semple-2').html(), { rows: rows });
    $(semple2Html).appendTo($('#holder-semple-2')).table_scroll();

    var semple3Html = Mustache.to_html($('#tamplate-semple-3').html(), { rows: rows });
    $(semple3Html).appendTo($('#holder-semple-3')).table_scroll({
        rowsInFooter: 1,
    });

    var semple4Html = Mustache.to_html($('#tamplate-semple-4').html(), { rows: rows });
    $(semple4Html).appendTo($('#holder-semple-4')).table_scroll();

});

function getFixedColumnsData() {
    var fixedColumnsData = [];
    var columnsCaptions = [];
    var footers = [];

    for (var j = 2013; j < 2014; j++) {
        for (var k = 0; k < months.length; k++) {
            columnsCaptions.push(months[k] + ' ' + j);
        }
    }

    for (var i = 0; i < authors.length; i++) {

        var data = [];

        for (var j = 2013; j < 2014; j++) {
            for (var k = 0; k < months.length; k++) {
                data.push(Math.floor((Math.random() * 500) + 10));
            }
        }

        var row = {
            Index: i,
            FirstName: authors[i].FirstName,
            LastName: authors[i].LastName,
            data: data,
            Price: authors[i].Price,
        };
        fixedColumnsData.push(row);
    }

    for (var j = 2013; j < 2014; j++) {
        for (var k = 0; k < months.length; k++) {
            
            var total = 0;
            for (var i = 0; i < authors.length; i++) {
                total += fixedColumnsData[i].data[(j - 2012) * k];
            }

            footers.push(total);
        }
    }

    return {
        columnsCount: columnsCaptions.length,
        data: fixedColumnsData,
        columns: columnsCaptions,
        footers: footers
    };
}

// data
var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

var authors = [
    { "FirstName": "David", "LastName": "Flanagan", "Price": 31.49 },
    { "FirstName": "Douglas", "LastName": "Crockford", "Price": 19.79 },
    { "FirstName": "John", "LastName": "Pollock", "Price": 26.39 },
    { "FirstName": "David", "LastName": "Sawyer", "Price": 26.39 },
    { "FirstName": "Nicholas", "LastName": "Zakas", "Price": 31.49 },
    { "FirstName": "Michael", "LastName": "Morrison", "Price": 26.39 },
    { "FirstName": "Ray", "LastName": "Harris", "Price": 34.34 },
    { "FirstName": "Stoyan", "LastName": "Stefanov", "Price": 31.57 },
    { "FirstName": "Steve", "LastName": "Suehring", "Price": 26.39 },
    { "FirstName": "Shelley", "LastName": "Powers", "Price": 23.09 },
    { "FirstName": "James", "LastName": "Keogh", "Price": 14.93 },
    { "FirstName": "John", "LastName": "Resig", "Price": 32.03 },
    { "FirstName": "Danny", "LastName": "Goodman", "Price": 29.69 },
    { "FirstName": "Tom", "LastName": "Negrino", "Price": 23.09 },
    { "FirstName": "John", "LastName": "Pollock", "Price": 18.96 },
    { "FirstName": "Nicholas", "LastName": "Zakas", "Price": 23.09 },
    { "FirstName": "Ross", "LastName": "Harmes", "Price": 29.69 },
    { "FirstName": "John", "LastName": "Resig", "Price": 26.39 },
    { "FirstName": "Danny", "LastName": "Goodman", "Price": 31.49 },
    { "FirstName": "Jeremy", "LastName": "Keith", "Price": 26 },
    { "FirstName": "David", "LastName": "Flanagan", "Price": 9.95 },
    { "FirstName": "Paul", "LastName": "Wilton", "Price": 26.39 },
    { "FirstName": "Kevin", "LastName": "Yank", "Price": 26.37 },
    { "FirstName": "Andrew", "LastName": "Stellman", "Price": 49.99 },
    { "FirstName": "Peter", "LastName": "Bako", "Price": 24.95 },
    { "FirstName": "Peter", "LastName": "Bako", "Price": 9.99 },
    { "FirstName": "Andrew", "LastName": "Troelsen", "Price": 59.99 },
    { "FirstName": "Daniel", "LastName": "Solis", "Price": 49.99 },
    { "FirstName": "John", "LastName": "Sharp", "Price": 22.79 },
    { "FirstName": "Bill", "LastName": "Sempf", "Price": 44.99 },
    { "FirstName": "Paul", "LastName": "Deitel", "Price": 39.99 },
    { "FirstName": "Karli", "LastName": "Watson", "Price": 36.64 },
    { "FirstName": "Joseph", "LastName": "Albahari", "Price": 26.09 },
    { "FirstName": "Ian", "LastName": "Griffiths", "Price": 49.99 },
    { "FirstName": "Robert", "LastName": "Martin", "Price": 38.75 },
    { "FirstName": "Robert", "LastName": "Daigneau", "Price": 38.37 },
    { "FirstName": "Dino", "LastName": "Esposito", "Price": 39.78 },
    { "FirstName": "Jon", "LastName": "Arking", "Price": 31.67 },
    { "FirstName": "Mark", "LastName": "Seemann", "Price": 31.85 },
    { "FirstName": "Roy", "LastName": "Osherove", "Price": 25.04 },
    { "FirstName": "James", "LastName": "Bender", "Price": 28.89 },
    { "FirstName": "Erich", "LastName": "Gamma", "Price": 43.58 },
    { "FirstName": "Martin", "LastName": "Fowler", "Price": 44.31 },
    { "FirstName": "Scott", "LastName": "Millett", "Price": 30.85 },
    { "FirstName": "Martin", "LastName": "Fowler", "Price": 49.92 },
    { "FirstName": "Krzysztof", "LastName": "Cwalina", "Price": 43.48 },
    { "FirstName": "Andrew", "LastName": "Troelsen", "Price": 33.48 },
    { "FirstName": "Julia", "LastName": "Lerman", "Price": 35.55 },
    { "FirstName": "Juval", "LastName": "Lowy", "Price": 33.08 },
    { "FirstName": "Adam", "LastName": "Freeman", "Price": 29 },
    { "FirstName": "Stephen", "LastName": "Ritchie", "Price": 42.91 },
    { "FirstName": "Richard", "LastName": "Kiessig", "Price": 28.72 },
    { "FirstName": "Eric", "LastName": "Evans", "Price": 47.85 },
    { "FirstName": "Tony", "LastName": "Northrup", "Price": 39.36 },
    { "FirstName": "Jeffrey", "LastName": "Richter", "Price": 39.36 },
    { "FirstName": "Jon", "LastName": "Skeet", "Price": 29.33 },
    { "FirstName": "Jeffrey", "LastName": "Richter", "Price": 36.21 },
    { "FirstName": "Robert", "LastName": "Martin", "Price": 51.74 },
    { "FirstName": "Steven", "LastName": "Sanderson", "Price": 34.28 },
    { "FirstName": "Joseph", "LastName": "Albahari", "Price": 31.32 },
    { "FirstName": "Jon", "LastName": "Galloway", "Price": 24.58 },
    { "FirstName": "Tony", "LastName": "Northrup", "Price": 23.77 },
    { "FirstName": "Steve", "LastName": "McConnell", "Price": 27.89 },
    { "FirstName": "Dino", "LastName": "Esposito", "Price": 25.42 },
    { "FirstName": "Bill", "LastName": "Wagner", "Price": 21.32 },
    { "FirstName": "Julia", "LastName": "Lerman", "Price": 22.49 },
    { "FirstName": "Elisabeth", "LastName": "Freeman", "Price": 27.89 },
    { "FirstName": "Michele", "LastName": "Bustamante", "Price": 28.61 },
    { "FirstName": "Dino", "LastName": "Esposito", "Price": 28.88 },
    { "FirstName": "Glenn", "LastName": "Johnson", "Price": 43.97 },
    { "FirstName": "Dan", "LastName": "Clark", "Price": 28.72 },
    { "FirstName": "John", "LastName": "Sharp", "Price": 36.63 },
    { "FirstName": "Paolo", "LastName": "Pialorsi", "Price": 33.84 },
    { "FirstName": "Adam", "LastName": "Nathan", "Price": 33.74 }
];