$(function () {

    var rows = [];
    for (var i = 0; i < 100; i++) {
        rows.push({ number: i + 1 });
    }

    var semple1Html = Mustache.to_html($('#tamplate-semple-1').html(), getFixedColumnsData());
    $(semple1Html).appendTo($('#holder-semple-1')).table_scroll({
        fixedColumnsLeft: 2,
        fixedColumnsRight: 1,
        columnsInScrollableArea: 3
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

    for (var i = 1; i < 21; i++) {
        columnsCaptions.push('Period ' + i);
        footers.push('Total ' + i);
    }

    for (var i = 1; i < 61; i++) {

        var data = [];

        for (var j = 1; j < 21; j++) {
            //data.push(j + i);
            data.push('val' + j);
        }

        var row = {
            columns1: 'Left ' + i + ' 1',
            columns2: 'Left ' + i + ' 2',
            data: data,
            columns3: 'Right ' + i,
        };
        fixedColumnsData.push(row);
    }
    return {
        data: fixedColumnsData,
        columns: columnsCaptions,
        footers: footers
    };
}