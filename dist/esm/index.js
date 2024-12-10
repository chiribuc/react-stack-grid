import React, { forwardRef, useRef, useState, useCallback, useImperativeHandle, useEffect } from 'react';

var StackGrid = forwardRef(function (_a, ref) {
    var items = _a.items, columnMinWidth = _a.columnMinWidth, _b = _a.gutterWidth, gutterWidth = _b === void 0 ? 0 : _b, _c = _a.gutterHeight, gutterHeight = _c === void 0 ? 0 : _c, renderItem = _a.renderItem, onReflow = _a.onReflow;
    var containerRef = useRef(null);
    var _d = useState(0), containerHeight = _d[0], setContainerHeight = _d[1];
    var getContainerWidth = useCallback(function () {
        var _a;
        return ((_a = containerRef.current) === null || _a === void 0 ? void 0 : _a.clientWidth) || 0;
    }, []);
    var calculateColumnCount = useCallback(function (containerWidth, colMinWidth, gutter) {
        return Math.max(Math.floor((containerWidth + gutter) / (colMinWidth + gutter)), 1);
    }, []);
    var calculateColumnWidth = useCallback(function (containerWidth, columnCount, gutter) {
        return (containerWidth - gutter * (columnCount - 1)) / columnCount;
    }, []);
    var generateBaseColumns = useCallback(function (columnCount, columnWidth, gutter) {
        return Array.from({ length: columnCount }, function (_, i) { return ({
            x: i * (columnWidth + gutter),
            h: 0
        }); });
    }, []);
    var updateColumnData = useCallback(function () {
        var containerWidth = getContainerWidth();
        var count = calculateColumnCount(containerWidth, columnMinWidth, gutterWidth);
        var width = calculateColumnWidth(containerWidth, count, gutterWidth);
        return {
            containerWidth: containerWidth,
            columnCount: count,
            columnWidth: width
        };
    }, [columnMinWidth, gutterWidth, calculateColumnCount, calculateColumnWidth, getContainerWidth]);
    var arrangeItems = useCallback(function (children, cols, columnWidth) {
        if (!children || !cols || !cols.length)
            return;
        children.forEach(function (child) {
            var index = cols.reduce(function (acc, col, idx) {
                if (acc.minHeight === null || col.h < acc.minHeight) {
                    return { index: idx, minHeight: col.h };
                }
                return acc;
            }, { index: 0, minHeight: null }).index;
            if (index === undefined || index < 0 || index >= cols.length)
                return;
            child.style.width = "".concat(columnWidth, "px");
            child.style.transform = "translate(".concat(cols[index].x, "px, ").concat(cols[index].h, "px)");
            cols[index].h += child.offsetHeight + gutterHeight;
        });
        var maxHeight = cols.reduce(function (max, col) { return Math.max(max, col.h); }, 0);
        setContainerHeight(maxHeight);
    }, [gutterHeight]);
    var reflow = useCallback(function () {
        var _a = updateColumnData(), containerWidth = _a.containerWidth, columnCount = _a.columnCount, columnWidth = _a.columnWidth;
        var cols = generateBaseColumns(columnCount, columnWidth, gutterWidth);
        onReflow === null || onReflow === void 0 ? void 0 : onReflow({ containerWidth: containerWidth, columnCount: columnCount, columnWidth: columnWidth });
        if (containerRef.current) {
            var children = Array.from(containerRef.current.children);
            arrangeItems(children, cols, columnWidth);
        }
    }, [updateColumnData, generateBaseColumns, gutterWidth, arrangeItems, onReflow]);
    // Expose reflow method through ref
    useImperativeHandle(ref, function () { return ({
        reflow: reflow
    }); });
    // Handle resize
    useEffect(function () {
        window.addEventListener('resize', reflow);
        return function () { return window.removeEventListener('resize', reflow); };
    }, [reflow]);
    // Handle items changes
    useEffect(function () {
        var timeout = setTimeout(reflow, 0);
        return function () { return clearTimeout(timeout); };
    }, [items, reflow]);
    return (React.createElement("div", { ref: containerRef, style: {
            display: 'block',
            position: 'relative',
            width: '100%',
            height: containerHeight
        } }, items.map(function (item, index) { return (React.createElement("div", { key: index, style: {
            position: 'absolute',
            top: 0,
            left: 0,
            transition: 'transform 0.2s ease-in-out'
        } }, renderItem(item, index))); })));
});

export { StackGrid };
//# sourceMappingURL=index.js.map
