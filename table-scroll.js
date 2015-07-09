(function ($, undefined) {

    var CELL_INDEX_DATA = '_sg_index_';
    var CELL_SPAN_ADJUSTMENTS = '_sg_adj_';

    $.widget("ui.table_scroll", {
        version: "1.0.0",
        options:
        {
            rowsInHeader: null,
            rowsInFooter: null,

            fixedColumnsLeft: 0,
            fixedColumnsRight: 0,

            scrollX: 0,
            scrollY: 0,

            rowsInScrollableArea: 10,
            columnsInScrollableArea: 5,

            overflowY: 'auto', /*scroll, auto*/
            overflowX: 'auto', /*scroll, auto*/
        },

        _create: function () {
            this._columnsCount = -1;
            this._currentTouch = null;
            
            this._ensureSettings();

            this.startFrom = 0;

            this._setActualCellIndexes();

            this._yInitScroll();
            this._yUpdateRowsVisibility();

            this._xInitScroll();
            this._xUpdateColumnsVisibility();

            this._yUpdateScrollHeights();
        
            this.widget().on("mousewheel", $.proxy(this._tableMouseWheel, this));
            this.widget().on("DOMMouseScroll", $.proxy(this._tableMouseWheel, this)); // Firefox
            this.widget().on('touchstart', $.proxy(this._touchStart, this));
            this.widget().on('touchmove', $.proxy(this._touchMove, this));
            this.widget().on('touchend', $.proxy(this._touchEnd, this));
            
            this._xMoveScroll(this.options.scrollX);
            this._yMoveScroll(this.options.scrollY);
            this._yUpdateRowsVisibility();
            this._xUpdateColumnsVisibility();
        },

        _ensureSettings: function() {
            if (this.options.rowsInHeader == null) {

                if (this._table().tHead)
                    this.options.rowsInHeader = this._table().tHead.rows.length;
                else
                    this.options.rowsInHeader = 1;
            }

            if (this.options.rowsInFooter == null) {
                if (this._table().tFoot)
                    this.options.rowsInFooter = this._table().tFoot.rows.length;
                else
                    this.options.rowsInFooter = 0;
            }
        },

        // horisontal scrolling methods
        _xGetNumberOfColumns: function () {
            if (this._columnsCount != -1)
                return this._columnsCount;

            this._columnsCount = Math.max.apply(null, $(this._table().rows).map(function () { return this.cells.length; }).get());

            if ($('.sg-v-scroll-cell', this.widget()).length > 0)
                this._columnsCount -= 1;

            return this._columnsCount;
        },

        _xNumberOfScrollableColumns: function() {
            var width = this._xGetNumberOfColumns() - this.options.fixedColumnsLeft - this.options.fixedColumnsRight;
            if(width < 1)
                return 1;
            return width;
        },

        _xScrollWidth: function() {
            var width = this._xGetNumberOfColumns() - this.options.fixedColumnsLeft - this.options.fixedColumnsRight;
            if (width > this.options.columnsInScrollableArea)
                return this.options.columnsInScrollableArea;
            if (width < 1)
                return 1;
            return width;
        },

        _xScrollNeeded : function() {
            var width = this._xGetNumberOfColumns() - this.options.fixedColumnsLeft - this.options.fixedColumnsRight;
            return width > this.options.columnsInScrollableArea;
        },

        _xInitScroll: function() {
            if (this._xGetNumberOfColumns() < (this.options.fixedColumnsLeft + this.options.fixedColumnsRight))
                return;

            if (this._xScrollNeeded() || this.options.overflowX == 'scroll') {

                var row = this._table().insertRow(this._table().rows.length);

                if (this.options.fixedColumnsLeft > 0) {
                    var $cell = $(row.insertCell(0));
                    $cell.attr('colspan', this.options.fixedColumnsLeft);
                }

                var $container = $(row.insertCell(1));
                $container.attr('colspan', this._xScrollWidth());
                $container.addClass('sg-x-scroll-cell');

                var $widthDivContainer = $('<div class="sg-h-scroll-container"></div>');
                $widthDivContainer.css('overflow-x', 'scroll');
                $widthDivContainer.css('margin-right', '-20000px');
                $widthDivContainer.width($container.width());

                var $widthDiv = $('<div style="height: 1px;"></div>');
                $widthDiv.width((this._xNumberOfScrollableColumns() / this._xScrollWidth()) * $container.width());
                $widthDiv.appendTo($widthDivContainer);

                $widthDivContainer.appendTo($container);
                $widthDivContainer.scroll($.proxy(this._xUpdateColumnsVisibility, this));

                if (this.options.fixedColumnsRight > 0) {
                    var $cell = $(row.insertCell(2));
                    $cell.attr('colspan', this.options.fixedColumnsRight + 
                        ($('.sg-v-scroll-cell', this.widget()).length > 0 ? 1 : 0));
                }
            }
        },

        _xCurrentRelativeScrollLeft: function () {
            var $widthDivContainer = $('.sg-h-scroll-container', this.widget());
            return $widthDivContainer.scrollLeft() / $widthDivContainer.width();
        },

        _xScrollDelta: function () {
            var widthContainer = $('.sg-h-scroll-container', this.widget());
            return $('div', widthContainer).width() - widthContainer.width();
        },

        _xScrollableColumnsCount: function () {
            return this._xNumberOfScrollableColumns() - this._xScrollWidth();
        },

        _xColumnScrollStep: function () {
            if (this._xScrollableColumnsCount() == 0)
                return 0;
            return this._xScrollDelta() / this._xScrollableColumnsCount();
        },

        _xMoveScroll: function(position) {
            position = Math.min(this._xScrollableColumnsCount(), position);
            position = Math.max(position, 0);

            position = this._xColumnScrollStep() * position;
            var $widthDivContainer = $('.sg-h-scroll-container', this.widget());
            if ($widthDivContainer.scrollLeft() != position)
                $widthDivContainer.scrollLeft(position);
        },

        _setColumnVisibility: function(index, visible, start, end) {
            var rows = this._table().rows;

            for (var rowIndex = start; rowIndex < end; rowIndex++) {
                var row = rows[rowIndex];

                for (var cellIndex = 0; cellIndex < row.cells.length; cellIndex++) {
                    
                    //in this cycle body we can't use jQuery because this code is critical for performance

                    var cell = row.cells[cellIndex];
                    var cIndex = cell[CELL_INDEX_DATA];
                    if (cIndex == index) {

                        if (!cell.colSpan || cell.colSpan == 1) // apply visibility only for cells with colspan = 1
                        {
                            if (visible && cell.style.display == 'none')
                                cell.style.display = '';
                            
                            if (!visible && cell.style.display != 'none')
                                cell.style.display = 'none';
                        }
                    }
                }
            }
        },

        _xFirstVisibleColumnWidth: function () {
            for (var i = this.options.rowsInHeader; i < this._table().rows.length - this.options.rowsInFooter - $('.sg-h-scroll-container', this.widget()).length; i++) {
                if ($(this._table().rows[i]).css('display') != 'none') {
                    for (var j = this.options.fixedColumnsLeft; j < this._xGetNumberOfColumns() - this.options.fixedColumnsRight; j++) {
                        if ($(this._table().rows[i].cells[j]).css('display') != 'none')
                            return $(this._table().rows[i].cells[j]).width();
                    }
                }
            }
            return 0;
        },

        _xLastVisibleColumnWidth: function () {
            for (var i = this.options.rowsInHeader; i < this._table().rows.length - this.options.rowsInFooter - $('.sg-h-scroll-container', this.widget()).length; i++) {
                if ($(this._table().rows[i]).css('display') != 'none') {
                    for (var j = this._xGetNumberOfColumns() - this.options.fixedColumnsRight - 1; j >= this.options.fixedColumnsLeft ; j--) {
                        if ($(this._table().rows[i].cells[j]).css('display') != 'none')
                            return $(this._table().rows[i].cells[j]).width();
                    }
                }
            }
            return 0;
        },

        _xUpdateColumnsVisibility: function() {
            if (!this._xScrollNeeded())
                return;

            var leftContainer = $('.sg-h-scroll-container', this.widget());

            var startFromX = Math.floor(leftContainer.scrollLeft() / this._xColumnScrollStep());
            var relativeLeft = this._xCurrentRelativeScrollLeft();
            for (var i = this.options.fixedColumnsLeft; i < this._xGetNumberOfColumns() - this.options.fixedColumnsRight; i++) {
                var visible = false;

                if (i >= this.options.fixedColumnsLeft + startFromX
                        &&
                        i < this.options.fixedColumnsLeft + startFromX + this.options.columnsInScrollableArea
                ) {
                    visible = true;
                }

                this._setColumnVisibility(i, visible, 0, this._table().rows.length - 1 /* ignore scrolling row */);
            }
            this._xUpdateScrollWidths();
        },

        _xUpdateScrollWidths: function () {
            
            var leftContainer = $('.sg-h-scroll-container', this.widget());
            var $container = leftContainer.closest('td');
            leftContainer.width($container.width());
            var $widthDiv = $('div', leftContainer);
            $widthDiv.width((this._xNumberOfScrollableColumns() / this._xScrollWidth()) * $container.width());
        },

        // vertical scrolling methods
        _yScrollHeight:function() {
            var height = this._table().rows.length - this.options.rowsInHeader - this.options.rowsInFooter;
            if ($('.sg-h-scroll-container', this.widget()).length > 0)
                height--;

            if (height > this.options.rowsInScrollableArea)
                return this.options.rowsInScrollableArea;
            if (height < 1)
                return 1;
            return height;
        },
        
        _yNumberOfScrollableRows: function () {
            var height = this._table().rows.length - this.options.rowsInHeader - this.options.rowsInFooter;
            if ($('.sg-h-scroll-container', this.widget()).length > 0)
                height--;

            if (height < 1)
                return 1;
            return height;
        },

        _yScrollNeeded: function() {
            var height = this._table().rows.length - this.options.rowsInHeader - this.options.rowsInFooter;
            if ($('.sg-h-scroll-container', this.widget()).length > 0)
                height--;
            return height > this.options.rowsInScrollableArea;
        },

        _yInitScroll: function () {

            if (this._table().rows.length < (this.options.rowsInHeader + this.options.rowsInFooter))
                return;
                
            if (this._yScrollNeeded() || this.options.overflowY == 'scroll') {
                var $cell = $(this._table().rows[0].insertCell(this._table().rows[0].cells.length));
                $cell.attr('rowspan', this.options.rowsInHeader);
                
                var $container = $(this._table().rows[this.options.rowsInHeader + this.startFrom].insertCell(this._table().rows[this.options.rowsInHeader + this.startFrom].cells.length));
                $container.attr('rowspan', this._yScrollHeight());
                $container.attr('width', "1px");
                $container.addClass('sg-v-scroll-cell');

                var $heightDivContainer = $('<div class="sg-v-scroll-container"></div>');
                $heightDivContainer.css('overflow-y', 'scroll');
                $heightDivContainer.height($container.height());
                
                var $heightDiv = $('<div style="width: 1px;"></div>');
                $heightDiv.height((this._yNumberOfScrollableRows() / this._yScrollHeight()) * $container.height());
                $heightDiv.appendTo($heightDivContainer);

                $heightDivContainer.appendTo($container);
                this._attachToEndScrolling($heightDivContainer, $.proxy(this._yUpdateRowsVisibility, this));

                if (this.options.rowsInFooter != 0) {
                    var firstBotomRow = this._table().rows[this._yNumberOfScrollableRows() + this.options.rowsInHeader];
                    var $bottomCell = $(firstBotomRow.insertCell(firstBotomRow.cells.length));
                    $bottomCell.attr('rowspan', this.options.rowsInFooter);
                }
            }
        },

        _yCurrentRelativeScrollTop: function() {
            var $heightDivContainer = $('.sg-v-scroll-container', this.widget());
            return $heightDivContainer.scrollTop() / $heightDivContainer.height();
        },

        _yMoveScrollToRightRow: function(oldRelativeTop) {
            var trCurrentContainer = $('.sg-v-scroll-cell', this.widget()).closest('tr').get(0);
            var trTargetContainer = this._table().rows[this.options.rowsInHeader + this.startFrom];

            var $heightDivContainer = $('.sg-v-scroll-container', this.widget());
            var $heightDiv = $('div', $heightDivContainer);

            if (trCurrentContainer != trTargetContainer) {
                var $newCell = $(trTargetContainer.insertCell(trTargetContainer.cells.length));
                $newCell.attr('rowspan', this._yScrollHeight());
                $newCell.addClass('sg-v-scroll-cell');
                $newCell.attr('width', "1px");

                var scrollDiv = $('.sg-v-scroll-container', $(trCurrentContainer));
                scrollDiv.height(0);
                scrollDiv.appendTo($newCell);
                trCurrentContainer.deleteCell(trCurrentContainer.cells.length - 1);

                $heightDivContainer.height($newCell.height());
                $heightDiv.height((this._yNumberOfScrollableRows() / this._yScrollHeight()) * $newCell.height());

                $heightDivContainer.scrollTop(oldRelativeTop * $heightDivContainer.height());
                $heightDivContainer.get(0);
            }
        },

        _yScrollDelta: function () {
            var topContainer = $('.sg-v-scroll-container', this.widget());
            return $('div', topContainer).height() - topContainer.height();
        },

        _yScrollableRowsCount: function() {
            return this._yNumberOfScrollableRows() - this._yScrollHeight();
        },

        _yRowScrollStep: function () {
            if (this._yScrollableRowsCount() == 0)
                return 0;
            return this._yScrollDelta() / this._yScrollableRowsCount();
        },

        _yMoveScroll: function(position) {
            position = Math.min(this._yScrollableRowsCount(), position);
            position = Math.max(position, 0);

            var step = this._yRowScrollStep();
            position = step * position;
            var $heightDivContainer = $('.sg-v-scroll-container', this.widget());
            if ($heightDivContainer.scrollTop() != position)
                $heightDivContainer.scrollTop(position + step / 2);
        },

        _yUpdateScrollHeights: function () {

            var topContainer = $('.sg-v-scroll-container', this.widget());
            var $container = topContainer.closest('td');
            topContainer.hide();
            topContainer.height($container.height());
            var $heightDiv = $('div', topContainer);
            $heightDiv.height((this._yNumberOfScrollableRows() / this._yScrollHeight()) * $container.height());
            topContainer.show();
        },

        _yFirstVisibleRowHeight: function(){
            for (var i = this.options.rowsInHeader; i < this._table().rows.length - this.options.rowsInFooter - $('.sg-h-scroll-container', this.widget()).length; i++) {
                if ($(this._table().rows[i]).css('display') != 'none') {
                    return $(this._table().rows[i]).height();
                }
            }
            return 0;
        },

        _yLastVisibleRowHeight: function () {
            for (var i = this._table().rows.length - this.options.rowsInFooter - $('.sg-h-scroll-container', this.widget()).length - 1; i >= this.options.rowsInHeader; i--) {
                if ($(this._table().rows[i]).css('display') != 'none') {
                    return $(this._table().rows[i]).height();
                }
            }
            return 0;
        },

        _yUpdateRowsVisibility: function () {

            if (!this._yScrollNeeded())
                return;
            
            var topContainer = $('.sg-v-scroll-container', this.widget());

            var startFrom = Math.floor(topContainer.scrollTop() / this._yRowScrollStep());
            var relativeTop = this._yCurrentRelativeScrollTop();

            for (var i = this.options.rowsInHeader; i < this._table().rows.length - this.options.rowsInFooter - $('.sg-h-scroll-container', this.widget()).length; i++) {
                var visible = false;

                if (i >= this.options.rowsInHeader + startFrom
                        &&
                        i < this.options.rowsInHeader + startFrom + this.options.rowsInScrollableArea
                ) {
                    visible = true;
                }

                if (visible) {
                    $(this._table().rows[i]).show();
                } else {
                    $(this._table().rows[i]).hide();
                }
            }

            if (this.startFrom != startFrom) {
                this.startFrom = startFrom;
                this._yMoveScrollToRightRow(relativeTop);
            }
        },

        _attachToEndScrolling: function (element, handler) {
            element.scroll(function() {
                clearTimeout(element.data('scrollTimer'));

                $.data(this, 'scrollTimer', setTimeout(function () {
                    handler.apply(this);
                }, 300));
            });
        },

        _tableMouseWheel: function (event) {
        
            var up = false;
            var down = false;
            var original = event.originalEvent;
            if (original.wheelDelta) {
                if (original.wheelDelta >= 120) {
                    up = true;
                }
                else {
                    if (original.wheelDelta <= -120) {
                        down = true;
                    }
                }
            }

            if (original.detail) {
                if (original.detail == -3)
                    up = true;
                else
                    if (original.detail == 3)
                        down = true;
            }

            var $heightDivContainer = $('.sg-v-scroll-container', this.widget());
            var delta = 0;

            if (up) 
                delta = this._yRowScrollStep() + 1;
            if(down)
                delta = - this._yRowScrollStep() - 1;

            if (delta != 0) {
                $heightDivContainer.scrollTop($heightDivContainer.scrollTop() - delta);
            }
            event.preventDefault();
        },

        _touchStart: function (event) {
            if (event.originalEvent.touches && event.originalEvent.touches.length == 1) {
                var touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
                this._currentTouch = { X: touch.pageX, Y: touch.pageY };
                event.preventDefault();
                event.stopPropagation();
            }
        },

        _touchMove: function (event) {
            if (event.originalEvent.touches && event.originalEvent.touches.length == 1 && this._currentTouch != null) {
                var touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];

                var newTouch = { X: touch.pageX, Y: touch.pageY };
                var deltaX = this._currentTouch.X - newTouch.X;
                var deltaY = this._currentTouch.Y - newTouch.Y;

                var $heightDivContainer = $('.sg-v-scroll-container', this.widget());
                if (deltaY > 0) { 
                    var rowToHideHeight = this._yFirstVisibleRowHeight();
                    if (rowToHideHeight != 0 && deltaY > rowToHideHeight) {
                        $heightDivContainer.scrollTop($heightDivContainer.scrollTop() + (this._yRowScrollStep() + 1))
                        this._currentTouch.Y -= rowToHideHeight;
                        this._yUpdateRowsVisibility();
                    }
                }
                else {
                    var rowToHideHeight = this._yLastVisibleRowHeight();
                    if (rowToHideHeight != 0 && deltaY < -1 * rowToHideHeight) {
                        $heightDivContainer.scrollTop($heightDivContainer.scrollTop() - (this._yRowScrollStep() + 1))
                        this._currentTouch.Y += rowToHideHeight;
                        this._yUpdateRowsVisibility();
                    }
                }

                var $widthDivContainer = $('.sg-h-scroll-container', this.widget());
                if (deltaX > 0) {
                    var columnToHideWidth = this._xFirstVisibleColumnWidth();
                    if (columnToHideWidth != 0 && deltaX > columnToHideWidth) {
                        $widthDivContainer.scrollLeft($widthDivContainer.scrollLeft() + (this._xColumnScrollStep() + 1))
                        this._currentTouch.X -= rowToHideHeight;
                    }
                }
                else {
                    var columnToHideWidth = this._xLastVisibleColumnWidth();
                    if (columnToHideWidth != 0 && deltaX < -1 * columnToHideWidth) {
                        $widthDivContainer.scrollLeft($widthDivContainer.scrollLeft() - (this._xColumnScrollStep() + 1))
                        this._currentTouch.X += columnToHideWidth;
                    }
                }
                event.preventDefault();
                event.stopPropagation();
            }
        },

        _touchEnd: function (event) {
            this._currentTouch = null
        },

        
        _table: function() {
            return this.widget().get(0);
        },

        _setActualCellIndexes: function() {
            var rows = this._table().rows;

            for (var rowIndex = 0; rowIndex < rows.length; rowIndex++) {
                var row = rows[rowIndex];
                var indAdjustments = $(row).get(0)[CELL_SPAN_ADJUSTMENTS];
                if (!indAdjustments)
                    indAdjustments = [];

                for (var cellIndex = 0; cellIndex < row.cells.length; cellIndex++) {

                    var prevCellEndsAt = cellIndex - 1;

                    if (cellIndex > 0) {
                        var $prevCell = $(row.cells[cellIndex - 1]);
                        prevCellEndsAt = $prevCell.get(0)[CELL_INDEX_DATA];
                        if ($prevCell.attr('colspan')) {
                            prevCellEndsAt += this._getColSpan($prevCell) - 1;
                        }
                    }

                    var $cell = $(row.cells[cellIndex]);
                    var indexToSet = prevCellEndsAt + 1;

                    for (var i = 0; i < indAdjustments.length; i++) {
                        if (indAdjustments[i].index <= indexToSet) {
                            indexToSet += indAdjustments[i].adjustment;
                            indAdjustments[i].adjustment = 0;
                        }
                    }
                    
                    $cell.get(0)[CELL_INDEX_DATA] = indexToSet;

                    if ($cell.attr('rowspan') > 1 ) {
                        var span = $cell.attr('rowspan');

                        for (var rowShift = rowIndex + 1; rowShift < rowIndex + span && rowShift < rows.length; rowShift++) {
                            var $shiftedRow = $(rows[rowShift]);
                            var adjustments = $shiftedRow.get(0)[CELL_SPAN_ADJUSTMENTS];
                            if (!adjustments)
                                adjustments = [];
                            adjustments.push({ index: indexToSet, adjustment: this._getColSpan($cell) });
                            $shiftedRow.get(0)[CELL_SPAN_ADJUSTMENTS] = adjustments;
                        }
                    }
                }
            }
        },

        _getColSpan: function($cell) {
            if ($cell.data('scroll-span'))
                return $cell.data('scroll-span');

            if ($cell.attr('colspan'))
                return $cell.attr('colspan') * 1;

            return 1;
        }
    });

})(jQuery);