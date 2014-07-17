$(function () {

    var rows = [];
    for (var i = 0; i < 25; i++) {
        rows.push({ number: i + 1 });
    }

    var semple1Html = Mustache.to_html($('#tamplate-semple-1').html(), { rows: rows });
    $(semple1Html).appendTo($('#holder-semple-1')).table_scroll();

    var semple2Html = Mustache.to_html($('#tamplate-semple-2').html(), { rows: rows });
    $(semple2Html).appendTo($('#holder-semple-2')).table_scroll({
        rowsInFooter: 1,
    });

    var semple3Html = Mustache.to_html($('#tamplate-semple-3').html(), { rows: rows });
    $(semple3Html).appendTo($('#holder-semple-3')).table_scroll();

});