Table Scroll

Try it here - http://volodymyr-bobko.github.io/table-scroll/ 

jQuery.table_scroll plugin adds vertical and horizontal scrollbars to HTML table element.

Features
  Vertical scrolling.
  Horizontal scrolling with possibility to specify left and right fixed columns.
  Touch screen support.
  Auto detect vertical scrollable area and excluds thead and tfoot.
  Doesn't clone table elements - so your events stay bound.
  Doesn't divide your table into separate parts for scrolling, it means that width of column header is always in sync with cells width.

API

Options:
  rowsInHeader - Default: 1. Number of rows in table header. If table has thead element defined, this option should not be specified.
  rowsInFooter - Default: 0. Number of rows in table footer. If table has tfoot element defined, this option should not be specified.
  rowsInScrollableArea - Default: 10. Number of rows that remains visible in scrollable area.
  overflowY - Default: 'auto'. Possible values 'scroll', 'auto'.
    'auto' - Scroll appears only if overflowing rows exists.
    'scroll' - Scroll is always visible, and will be disabled if there are no overflowing rows.
  fixedColumnsLeft - Default: 0. Number of columns at the left side of scrollable area that will not be scrolled.
  fixedColumnsRight - Default: 0. Number of columns at the right side of scrollable area that will not be scrolled.
  columnsInScrollableArea - Default: 5.
  overflowX - Default: 'auto'. Possible values 'scroll', 'auto'.
    'auto' - Scroll appears only if overflowing columns exists.
    'scroll' - Scroll is always visible, and will be disabled if there are no overflowing columns.
