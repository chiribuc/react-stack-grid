import React, { useEffect, useRef, useState, useCallback, forwardRef, useImperativeHandle } from 'react';

export interface StackGridProps<T = any> {
  items: T[];
  columnMinWidth: number;
  gutterWidth?: number;
  gutterHeight?: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  onReflow?: (data: { containerWidth: number; columnCount: number; columnWidth: number }) => void;
}

export interface StackGridRef {
  reflow: () => void;
}

interface Column {
  x: number;
  h: number;
}

export const StackGrid = forwardRef<StackGridRef, StackGridProps>(({
   items,
   columnMinWidth,
   gutterWidth = 0,
   gutterHeight = 0,
   renderItem,
   onReflow
 }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState<number>(0);

  const getContainerWidth = useCallback(() => {
    return containerRef.current?.clientWidth || 0;
  }, []);

  const calculateColumnCount = useCallback((containerWidth: number, colMinWidth: number, gutter: number) => {
    return Math.max(
      Math.floor((containerWidth + gutter) / (colMinWidth + gutter)),
      1
    );
  }, []);

  const calculateColumnWidth = useCallback((containerWidth: number, columnCount: number, gutter: number) => {
    return (containerWidth - gutter * (columnCount - 1)) / columnCount;
  }, []);

  const generateBaseColumns = useCallback((columnCount: number, columnWidth: number, gutter: number): Column[] => {
    return Array.from({ length: columnCount }, (_, i) => ({
      x: i * (columnWidth + gutter),
      h: 0
    }));
  }, []);

  const updateColumnData = useCallback(() => {
    const containerWidth = getContainerWidth();
    const count = calculateColumnCount(containerWidth, columnMinWidth, gutterWidth);
    const width = calculateColumnWidth(containerWidth, count, gutterWidth);

    return {
      containerWidth,
      columnCount: count,
      columnWidth: width
    };
  }, [columnMinWidth, gutterWidth, calculateColumnCount, calculateColumnWidth, getContainerWidth]);

  const arrangeItems = useCallback((children: HTMLElement[], cols: Column[], columnWidth: number) => {
    if (!children || !cols || !cols.length) return;

    children.forEach((child) => {
      const { index } = cols.reduce((acc, col, idx) => {
        if (acc.minHeight === null || col.h < acc.minHeight) {
          return { index: idx, minHeight: col.h };
        }
        return acc;
      }, { index: 0, minHeight: null as number | null });

      if (index === undefined || index < 0 || index >= cols.length) return;

      child.style.width = `${columnWidth}px`;
      child.style.transform = `translate(${cols[index].x}px, ${cols[index].h}px)`;
      cols[index].h += child.offsetHeight + gutterHeight;
    });

    const maxHeight = cols.reduce((max, col) => Math.max(max, col.h), 0);
    setContainerHeight(maxHeight);
  }, [gutterHeight]);

  const reflow = useCallback(() => {
    const { containerWidth, columnCount, columnWidth } = updateColumnData();
    let cols = generateBaseColumns(columnCount, columnWidth, gutterWidth);

    onReflow?.({ containerWidth, columnCount, columnWidth });

    if (containerRef.current) {
      const children = Array.from(containerRef.current.children) as HTMLElement[];
      arrangeItems(children, cols, columnWidth);
    }
  }, [updateColumnData, generateBaseColumns, gutterWidth, arrangeItems, onReflow]);

  // Expose reflow method through ref
  useImperativeHandle(ref, () => ({
    reflow
  }));

  // Handle resize
  useEffect(() => {
    window.addEventListener('resize', reflow);
    return () => window.removeEventListener('resize', reflow);
  }, [reflow]);

  // Handle items changes
  useEffect(() => {
    const timeout = setTimeout(reflow, 0);
    return () => clearTimeout(timeout);
  }, [items, reflow]);

  return (
    <div
      ref={containerRef}
      style={{
        display: 'block',
        position: 'relative',
        width: '100%',
        height: containerHeight
      }}
    >
      {items.map((item, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            transition: 'transform 0.2s ease-in-out'
          }}
        >
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
});
