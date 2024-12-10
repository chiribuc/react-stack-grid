import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { StackGrid } from '../src';

interface TestItem {
  id: number;
  content: string;
  height: number;
}

describe('StackGrid', () => {
  const mockItems: TestItem[] = [
    { id: 1, content: 'Item 1', height: 100 },
    { id: 2, content: 'Item 2', height: 150 },
    { id: 3, content: 'Item 3', height: 120 },
  ];

  const renderItem = (item: TestItem) => (
    <div style={{ height: item.height }}>{item.content}</div>
  );

  beforeEach(() => {
    // Mock getBoundingClientRect
    Element.prototype.getBoundingClientRect = jest.fn(() => ({
      width: 1000,
      height: 800,
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      x: 0,
      y: 0,
      toJSON: () => {}
    }));
  });

  it('renders all items', () => {
    render(
      <StackGrid
        items={mockItems}
        columnMinWidth={200}
        renderItem={renderItem}
      />
    );

    mockItems.forEach(item => {
      expect(screen.getByText(item.content)).toBeInTheDocument();
    });
  });

  it('calls onReflow when resizing', async () => {
    const onReflow = jest.fn();
    render(
      <StackGrid
        items={mockItems}
        columnMinWidth={200}
        renderItem={renderItem}
        onReflow={onReflow}
      />
    );

    // Wait for initial render
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Simulate resize
    act(() => {
      window.innerWidth = 800;
      fireEvent(window, new Event('resize'));
    });

    // Wait for reflow
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 250));
    });

    expect(onReflow).toHaveBeenCalled();
  });

  it('handles ref.reflow() correctly', async () => {
    const onReflow = jest.fn();
    const { container } = render(
      <StackGrid
        ref={(ref) => {
          if (ref) {
            ref.reflow();
          }
        }}
        items={mockItems}
        columnMinWidth={200}
        renderItem={renderItem}
        onReflow={onReflow}
      />
    );

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(onReflow).toHaveBeenCalled();
    expect(container.firstChild).toBeInTheDocument();
  });
});