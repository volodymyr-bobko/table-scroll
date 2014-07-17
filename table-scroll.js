(function ($, undefined) {

    $.widget("ui.table_scroll", {
        version: "1.0.0",
        options:
        {
            rowsInHeader: null,
            rowsInFooter: null,
            rowsInScrollableArea: 10,
            overflowY: 'auto', /*scroll, auto*/
        },

        _create: function () {

            this._ensureSettings();

            this.startFrom = 0;
            this._yInitScroll();
            this._yUpdateRowsVisibility();
            this.widget().on("mousewheel", $.proxy(this._tableMouseWheel, this));
            this.widget().on("DOMMouseScroll", $.proxy(this._tableMouseWheel, this)); // Firefox
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

        _yScrollHeight:function() {
            var height = this._table().rows.length - this.options.rowsInHeader - this.options.rowsInFooter;
            if (height > this.options.rowsInScrollableArea)
                return this.options.rowsInScrollableArea;
            if (height < 1)
                return 1;
            return height;
        },
        
        _yNumberOfScrollableRows: function () {
            var height = this._table().rows.length - this.options.rowsInHeader - this.options.rowsInFooter;
            if (height < 1)
                return 1;
            return height;
        },

        _yScrollNeeded: function() {
            var height = this._table().rows.length - this.options.rowsInHeader - this.options.rowsInFooter;
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

        _yUpdateRowsVisibility: function () {

            if (!this._yScrollNeeded())
                return;
            
            var topContainer = $('.sg-v-scroll-container', this.widget());

            var startFrom = Math.floor(topContainer.scrollTop() / this._yRowScrollStep());
            var relativeTop = this._yCurrentRelativeScrollTop();
            for (var i = this.options.rowsInHeader; i < this._table().rows.length - this.options.rowsInFooter; i++) {
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

                $.data(this, 'scrollTimer', setTimeout(function() {
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
        
        _table: function() {
            return this.widget().get(0);
        }
    });

})(jQuery);