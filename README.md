# React Stack Grid

A responsive and dynamic stack grid component for React, designed to make it easy and efficient to create dynamic, responsive grid layouts. It automatically arranges items based on the available container width, ensuring a visually appealing presentation on all devices.

![twitter-card](https://github.com/user-attachments/assets/c0f70661-dfdf-438e-a1af-e35ed41eb38e)

## Demo
See the [demo](https://react-stack-grid.crobert.dev/) for a live example of StackGrid in action.

## Features

- **Responsive**: Automatically adjusts to the container's width
- **Customizable**: Offers props for minimum column width, gutter width, and gutter height
- **Type-Safe**: Built with TypeScript for better development experience
- **Performance Optimized**: Efficient reflow and resize handling

## Installation

```bash
npm install @crob/react-stack-grid
# or
yarn add @crob/react-stack-grid
```

## Usage

### Basic Usage

```tsx
import { StackGrid } from '@crob/react-stack-grid';

interface Item {
  id: number;
  content: string;
  height: number;
}

const YourComponent = () => {
  const items: Item[] = [
    { id: 1, content: 'Item 1', height: 100 },
    { id: 2, content: 'Item 2', height: 150 },
    // ... more items
  ];

  return (
    <StackGrid
      items={items}
      columnMinWidth={200}
      gutterWidth={10}
      gutterHeight={10}
      renderItem={(item) => (
        <div style={{ height: item.height }}>
          {item.content}
        </div>
      )}
      onReflow={(data) => {
        console.log('Grid reflowed:', data);
      }}
    />
  );
};
```

### Using Ref to Trigger Reflow

You can manually trigger a reflow of the grid using a ref:

```tsx
import { StackGrid, StackGridRef } from '@crob/react-stack-grid';
import { useRef } from 'react';

const YourComponent = () => {
  const gridRef = useRef<StackGridRef>(null);
  
  const handleReflow = () => {
    gridRef.current?.reflow();
  };

  return (
    <>
      <StackGrid
        ref={gridRef}
        items={items}
        columnMinWidth={200}
        gutterWidth={10}
        gutterHeight={10}
        renderItem={(item) => (
          <div style={{ height: item.height }}>
            {item.content}
          </div>
        )}
      />
      <button onClick={handleReflow}>Reflow Grid</button>
    </>
  );
};
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| items | T[] | Yes | - | Array of items to display in the grid |
| columnMinWidth | number | Yes | - | Minimum width for each column |
| gutterWidth | number | No | 0 | Horizontal spacing between items |
| gutterHeight | number | No | 0 | Vertical spacing between items |
| renderItem | (item: T, index: number) => ReactNode | Yes | - | Function to render each item |
| onReflow | (data: ReflowData) => void | No | - | Callback when grid layout changes |

### ReflowData Type

```typescript
interface ReflowData {
  containerWidth: number;  // Width of the grid container
  columnCount: number;     // Number of columns in the grid
  columnWidth: number;     // Width of each column
}
```

## Methods

### `reflow()`

Manually triggers a recalculation of the grid layout. This is useful when you need to force a re-layout after dynamic content changes or other updates that might affect item heights.

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build package
npm run build
```

## Contributing

Contributions are welcome! If you have an idea or suggestion, please feel free to fork the repository, make your changes, and submit a pull request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
