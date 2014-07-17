Table Scroll

jQuery.table_scroll plugin adds scrolling to HTML table element.

Features
  Supports table header and footer.
  Doesn't clone table elements - so your events stay bound.
  Doesn't divide your table into separate parts for scrolling, it means that width of column header is always in sync width cells width.

API

Options:
  rowsInHeader - Default: 1. Number of rows in table header. If table has thead element defined, this option should not be  specified.
  rowsInFooter - Default: 0. Number of rows in table footer. If table has tfoot element defined, this option should not be specified.
  rowsInScrollableArea - Default: 10. Number of rows that remains visible in scrollable area.
  overflowY - Default: 'auto'. Possible values 'scroll', 'auto'.
    'auto' - Scroll appears only if overflowing rows exists.
    'scroll' - Scroll is always visible, and will be disabled if there are no overflowing rows.
