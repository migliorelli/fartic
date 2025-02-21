<script setup lang="ts">
// reference: https://github.com/razztyfication/vue-drawing-canvas

import { computed, nextTick, reactive, ref, useTemplateRef } from "vue";
import StrokeType from "../../enums/canvas";

interface Coord {
  x: number;
  y: number;
}

interface Stroke {
  type: StrokeType;
  fill: boolean;
  width: number;
  color: string;
  coordinates: Coord[];
  from: Coord;
}

interface Props {
  width?: number;
  height?: number;
  lineWidth?: number;
  color?: string;
  strokeType?: StrokeType;
  fill?: boolean;
  lock?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  color: "#000000",
  lineWidth: 5,
  strokeType: StrokeType.Circle,
  width: window.innerWidth,
  fill: false,
  height: window.innerHeight,
});

const canvas = useTemplateRef("canvas");
const ctx = computed(() => canvas.value?.getContext("2d"));

const isDrawing = ref(false);
const guides = ref<Coord[]>([]);
const images = ref<Stroke[]>([]);
const trash = ref<Stroke[]>([]);

const type = ref(props.strokeType);
const fill = ref(props.fill);
const width = ref(props.lineWidth);
const coordinates = ref<Coord[]>([]);
const from = ref({ x: 0, y: 0 });
const color = ref(props.color);

const stroke = reactive({
  type,
  fill,
  width,
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
  if (!ctx.value || props.lock) return;

  isDrawing.value = true;
  const coords = getCoordinates(e);

  guides.value = [];
  stroke.coordinates = [];
  stroke.color = props.color;
  stroke.type = props.strokeType;
  stroke.width = props.lineWidth;
  stroke.from = coords;
};

const drawShape = (
  ctx: CanvasRenderingContext2D,
  stroke: Stroke,
  closing = false,
) => {
  ctx.strokeStyle = stroke.color;
  ctx.fillStyle = stroke.color;
  ctx.lineWidth = stroke.width;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  ctx.beginPath();
  ctx.setLineDash([]);

  // if circle
  if (stroke.type === StrokeType.Circle) {
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

    ctx.value.strokeStyle = props.color;
    ctx.value.lineWidth = 1;
    ctx.value.lineJoin = "round";
    ctx.value.lineCap = "round";

    ctx.value.beginPath();
    ctx.value.setLineDash([15, 15]);

    // if circle
    if (stroke.type === StrokeType.Circle) {
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
  if (!ctx.value || props.lock || !isDrawing.value) return;

  const coords = getCoordinates(e);
  switch (stroke.type) {
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

  if (stroke.type !== StrokeType.Dash) {
    drawGuide(true);
  }
};

const stopDrawing = () => {
  if (!ctx.value || props.lock) return;

  stroke.coordinates =
    guides.value.length > 0 ? guides.value : stroke.coordinates;
  images.value.push({ ...stroke });
  isDrawing.value = false;
  trash.value = [];
  redraw(true);
};

const redraw = (output = true) => {
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
        s.type === StrokeType.Eraser ? "destination-out" : "source-over";

      if (
        s.type !== StrokeType.Circle ||
        (s.type === StrokeType.Circle && s.coordinates.length > 0)
      ) {
        const closing = !(
          s.type === StrokeType.Eraser ||
          s.type === StrokeType.Dash ||
          s.type === StrokeType.Line
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

  if (output) {
    save();
  }
};

const save = () => {
  if (!canvas.value || !ctx.value) return;

  const tempCanvas = document.createElement("canvas");
  const tempCtx = tempCanvas.getContext("2d");

  tempCanvas.width = props.width;
  tempCanvas.height = props.height;

  if (tempCtx) {
    tempCtx.drawImage(canvas.value, 0, 0, props.width, props.height);
  }
};

const undo = () => {
  if (images.value.length > 0) {
    trash.value.push(images.value.pop()!);
    redraw(true);
  }
};

const redo = () => {
  if (trash.value.length > 0) {
    images.value.push(trash.value.pop()!);
    redraw(true);
  }
};

const keyPress = (e: KeyboardEvent) => {
  if (!(e.ctrlKey || e.metaKey) || props.lock) return;

  console.log(e.ctrlKey, e.metaKey, e.key);

  if (e.key == "\x1A") undo();
  if (e.key == "\x19") redo();
};
</script>

<template>
  <canvas
    ref="canvas"
    tabindex="1"
    :width="props.width"
    :height="props.height"
    @keypress="keyPress"
    @mousedown="startDrawing"
    @mousemove="draw"
    @mouseup="stopDrawing"
    @mouseleave="stopDrawing"
    @touchstart="startDrawing"
    @touchmove="draw"
    @touchend="stopDrawing"
    @touchcancel="stopDrawing"
    @pointerdown="startDrawing"
    @pointermove="draw"
    @pointerup="stopDrawing"
    @pointerleave="stopDrawing"
    @pointercancel="stopDrawing"
  />
</template>
