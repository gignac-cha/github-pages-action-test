const isUndefined = <T>(value?: T): value is undefined =>
  typeof value === 'undefined';
const isNotUndefined = <T>(value?: T): value is T => !isUndefined(value);

class Canvas {
  private context: CanvasRenderingContext2D;

  constructor(private element: HTMLCanvasElement) {
    this.context = element.getContext('2d')!;
  }

  set width(value: number) {
    this.element.setAttribute('width', `${value}`);
    this.context = this.element.getContext('2d')!;
  }
  set height(value: number) {
    this.element.setAttribute('height', `${value}`);
    this.context = this.element.getContext('2d')!;
  }

  clear({
    x,
    y,
    width,
    height,
  }: Partial<{ x: number; y: number; width: number; height: number }> = {}) {
    if (
      isNotUndefined(x) &&
      isNotUndefined(y) &&
      isNotUndefined(width) &&
      isNotUndefined(height)
    ) {
      this.context.clearRect(x, y, width, height);
      return;
    }
    this.context.clearRect(0, 0, this.element.width, this.element.height);
  }

  private build(task: () => void) {
    return {
      stroke: ({ color, width = 1 }: { color: string; width?: number }) => {
        this.context.save();
        this.context.beginPath();
        this.context.strokeStyle = color;
        this.context.lineWidth = width;
        task();
        this.context.stroke();
        this.context.closePath();
        this.context.restore();
        return { ...this.build(task) };
      },
      fill: ({ color }: { color: string }) => {
        this.context.save();
        this.context.beginPath();
        this.context.fillStyle = color;
        task();
        this.context.fill();
        this.context.closePath();
        this.context.restore();
        return { ...this.build(task) };
      },
    };
  }

  dot({ x, y, color }: { x: number; y: number; color: string }) {
    this.rectangle({ x, y, width: 1, height: 1 }).fill({ color });
  }

  rectangle({
    x,
    y,
    width,
    height,
  }: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) {
    return this.build(() => this.context.rect(x, y, width, height));
  }

  circle({ x, y, radius }: { x: number; y: number; radius: number }) {
    return this.build(() => this.context.arc(x, y, radius, 0, 2 * Math.PI));
  }
}

window.addEventListener('load', () => {
  const canvas = new Canvas(document.querySelector('#canvas')!);
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  requestAnimationFrame(function callback() {
    requestAnimationFrame(callback);

    canvas.clear();

    canvas.dot({ x: 50, y: 50, color: 'red' });

    canvas
      .rectangle({ x: 100, y: 100, width: 100, height: 100 })
      .stroke({ color: 'blue' });

    canvas
      .circle({ x: 150, y: 50, radius: 50 })
      .stroke({ color: 'green', width: 10 })
      .fill({ color: 'lightgreen' });
  });
});
