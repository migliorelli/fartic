// reference: https://github.com/razztyfication/vue-drawing-canvas

import { computed, nextTick, reactive, ref, type ShallowRef } from "vue";
import StrokeType from "../enums/canvas";
import type { Coord, Stroke } from "../types/canvas";

interface Options {
  drawCallback?: (context: Stroke[]) => void;
  lineWidth?: number;
  color?: string;
  strokeType?: StrokeType;
  fill?: boolean;
  lock?: boolean;
  width: number;
  height: number;
}

const defaultOptions = {
  color: "#000000",
  lineWidth: 5,
  strokeType: StrokeType.Dash,
  fill: false,
  lock: false,
};

export default function useCanvas(
  canvas: Readonly<ShallowRef<HTMLCanvasElement | null>>,
  options: Options,
) {
  const ctx = computed(() => canvas.value?.getContext("2d"));

  const isDrawing = ref(false);
  const guides = ref<Coord[]>([]);
  const images = ref<Stroke[]>([]);
  const trash = ref<Stroke[]>([]);

  const strokeType = ref(options.strokeType || defaultOptions.strokeType);
  const fill = ref(options.fill || defaultOptions.fill);
  const color = ref(options.color || defaultOptions.color);
  const lineWidth = ref(options.lineWidth || defaultOptions.lineWidth);

  const coordinates = ref<Coord[]>([]);
  const from = ref({ x: 0, y: 0 });

  const stroke = reactive({
    strokeType,
    fill,
    lineWidth,
    coordinates,
    color,
    from,
  });

  const getCoordinates = (e: Event): Coord => {
    if (!canvas.value) return { x: 0, y: 0 };

    let x, y;

    // for touch devices
    if ((<TouchEvent>e).touches && (<TouchEvent>e).touches.length > 0) {
      const rect = canvas.value.getBoundingClientRect();
      x = (<TouchEvent>e).touches[0].clientX - rect.left;
      y = (<TouchEvent>e).touches[0].clientY - rect.top;
    }
    // for pointer devices
    else {
      x = (<MouseEvent>e).offsetX;
      y = (<MouseEvent>e).offsetY;
    }

    return { x, y };
  };

  const startDrawing = (e: Event) => {
    if (!ctx.value || options.lock) return;

    isDrawing.value = true;
    const coords = getCoordinates(e);

    guides.value = [];
    stroke.coordinates = [];
    stroke.from = coords;
  };

  const drawShape = (
    ctx: CanvasRenderingContext2D,
    stroke: Stroke,
    closing = false,
  ) => {
    ctx.strokeStyle = stroke.color;
    ctx.fillStyle = stroke.color;
    ctx.lineWidth = stroke.lineWidth;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.setLineDash([]);

    // if circle
    if (stroke.strokeType === StrokeType.Circle) {
      ctx.ellipse(
        stroke.coordinates[0].x,
        stroke.coordinates[0].y,
        stroke.coordinates[1].x,
        stroke.coordinates[1].y,
        0,
        0,
        Math.PI * 2,
      );
    } else {
      ctx.moveTo(stroke.from.x, stroke.from.y);
      stroke.coordinates.forEach((c) => {
        ctx.lineTo(c.x, c.y);
      });

      if (closing) ctx.closePath();
    }

    // fill or stroke
    if (stroke.fill) ctx.fill();
    else ctx.stroke();
  };

  const drawGuide = (closing: boolean) => {
    redraw(true);
    nextTick(() => {
      if (!ctx.value) return;

      ctx.value.strokeStyle = stroke.color;
      ctx.value.lineWidth = 1;
      ctx.value.lineJoin = "round";
      ctx.value.lineCap = "round";

      ctx.value.beginPath();
      ctx.value.setLineDash([15, 15]);

      // if circle
      if (stroke.strokeType === StrokeType.Circle) {
        ctx.value.ellipse(
          guides.value[0].x,
          guides.value[0].y,
          guides.value[1].x,
          guides.value[1].y,
          0,
          0,
          Math.PI * 2,
        );
      } else {
        ctx.value.moveTo(stroke.from.x, stroke.from.y);
        guides.value.forEach((c) => {
          ctx.value!.lineTo(c.x, c.y);
        });

        if (closing) ctx.value.closePath();
      }

      ctx.value.stroke();
    });
  };

  const draw = (e: Event) => {
    if (!ctx.value || options.lock || !isDrawing.value) return;

    const coords = getCoordinates(e);
    switch (stroke.strokeType) {
      case StrokeType.Dash:
        stroke.coordinates.push(coords);
        drawShape(ctx.value, stroke);
        break;

      case StrokeType.Eraser:
        stroke.coordinates.push(coords);
        drawShape(ctx.value, stroke);
        break;

      case StrokeType.Line:
        guides.value = [{ x: coords.x, y: coords.y }];
        break;

      case StrokeType.Square:
        guides.value = [
          { x: coords.x, y: stroke.from.y },
          { x: coords.x, y: coords.y },
          { x: stroke.from.x, y: coords.y },
          { x: stroke.from.x, y: stroke.from.y },
        ];
        break;

      case StrokeType.Circle:
        const radius = Math.abs(stroke.from.x - coords.x);
        const startX =
          stroke.from.x > coords.x
            ? stroke.from.x - radius
            : stroke.from.x + radius;

        guides.value = [
          { x: startX, y: stroke.from.y },
          { x: radius, y: radius },
        ];
        break;

      case StrokeType.Triangle:
        const center = Math.abs(Math.floor((coords.x - stroke.from.x) / 2));
        const width =
          stroke.from.x < coords.x
            ? stroke.from.x + center
            : stroke.from.x - center;

        guides.value = [
          { x: coords.x, y: stroke.from.y },
          { x: width, y: coords.y },
          { x: stroke.from.x, y: stroke.from.y },
        ];
        break;

      case StrokeType.HalfTriangle:
        guides.value = [
          { x: coords.x, y: stroke.from.y },
          { x: stroke.from.x, y: coords.y },
          { x: stroke.from.x, y: stroke.from.y },
        ];
        break;
    }

    if (stroke.strokeType !== StrokeType.Dash) {
      drawGuide(true);
    }
  };

  const stopDrawing = () => {
    if (!ctx.value || options.lock) return;

    stroke.coordinates =
      guides.value.length > 0 ? guides.value : stroke.coordinates;
    images.value.push({ ...stroke });
    isDrawing.value = false;
    trash.value = [];
    redraw(true);
  };

  const redraw = (output = true, callback = true) => {
    if (!ctx.value || !canvas.value) return;

    ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height);

    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");

    tempCanvas.width = canvas.value.width;
    tempCanvas.height = canvas.value.height;

    if (tempCtx) {
      images.value.forEach((s: Stroke) => {
        if (!tempCtx) return;

        tempCtx.globalCompositeOperation =
          s.strokeType === StrokeType.Eraser
            ? "destination-out"
            : "source-over";

        if (
          s.strokeType !== StrokeType.Circle ||
          (s.strokeType === StrokeType.Circle && s.coordinates.length > 0)
        ) {
          const closing = !(
            s.strokeType === StrokeType.Eraser ||
            s.strokeType === StrokeType.Dash ||
            s.strokeType === StrokeType.Line
          );

          drawShape(tempCtx, s, closing);
        }
      });
    }

    ctx.value.drawImage(
      tempCanvas,
      0,
      0,
      canvas.value.width,
      canvas.value.height,
    );

    if (callback && options.drawCallback) options.drawCallback(images.value);
    if (output) {
      save();
    }
  };

  const save = () => {
    if (!canvas.value || !ctx.value) return;

    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");

    tempCanvas.width = options.width!;
    tempCanvas.height = options.height!;

    if (tempCtx) {
      tempCtx.drawImage(canvas.value, 0, 0, options.width!, options.height!);
    }
  };

  const undo = () => {
    if (images.value.length > 0) {
      trash.value.push(images.value.pop()!);
      trash.value.push(images.value.pop()!);
      redraw(true);
    }
  };

  const redo = () => {
    if (trash.value.length > 0) {
      images.value.push(trash.value.pop()!);
      images.value.push(trash.value.pop()!);
      redraw(true);
    }
  };

  const keyPress = (e: KeyboardEvent) => {
    if (!(e.ctrlKey || e.metaKey) || options.lock) return;

    console.log(e.ctrlKey, e.metaKey, e.key);

    if (e.key == "\x1A") undo();
    if (e.key == "\x19") redo();
  };

  const updateImages = (newImages: Stroke[]) => {
    images.value = newImages;
    redraw(true, false);
  };

  const clear = () => {
    trash.value = [];
    images.value = [];
    redraw(true);
  };

  return {
    fill,
    strokeType,
    lineWidth,
    color,

    startDrawing,
    draw,
    stopDrawing,
    undo,
    redo,
    keyPress,
    clear,
    updateImages,
  };
}
