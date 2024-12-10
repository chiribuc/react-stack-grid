import React from 'react';

interface StackGridProps<T = any> {
    items: T[];
    columnMinWidth: number;
    gutterWidth?: number;
    gutterHeight?: number;
    renderItem: (item: T, index: number) => React.ReactNode;
    onReflow?: (data: {
        containerWidth: number;
        columnCount: number;
        columnWidth: number;
    }) => void;
}
interface StackGridRef {
    reflow: () => void;
}
declare const StackGrid: React.ForwardRefExoticComponent<StackGridProps<any> & React.RefAttributes<StackGridRef>>;

export { StackGrid, type StackGridProps, type StackGridRef };
