import { CanvasLine, useSocket } from "@/contexts/SocketContext";
import useDimensions from "@/hooks/use-dimensions"; // Importa para obter a dimensão do canvas
import { KonvaEventObject } from "konva/lib/Node";
import { useEffect, useRef, useState } from "react";
import useMediaQuery from "./use-media-query";

const useCanvasDraw = (publicId: string) => {
  const [lines, setLines] = useState<CanvasLine[]>([]);
  const [color, setColor] = useState("#000");
  const isDrawing = useRef(false);
  const { socket, canDraw } = useSocket();

  const dimensions = useDimensions();
  const mobile = useMediaQuery();
  const canvasWidth = dimensions.width;
  const canvasHeight = (dimensions.width * 9) / 16;

  const scaleX = canvasWidth / 1000;
  const scaleY = canvasHeight / 562.5;

  const changeColor = (newColor: string) => {
    setColor(newColor);
  };

  const adjustForScaling = (x: number, y: number) => {
    return {
      x: mobile ? x / scaleX : x,
      y: mobile ? y / scaleY : y,
    };
  };

  const handleStartDrawing = (
    e: KonvaEventObject<MouseEvent> | KonvaEventObject<TouchEvent>,
  ) => {
    if (!canDraw) return;
    isDrawing.current = true;
    const stage = e.target.getStage();
    const pos = stage?.getPointerPosition();
    if (pos) {
      const adjustedPos = adjustForScaling(pos.x, pos.y); // Ajusta para a escala
      setLines((prev) => [
        ...prev,
        { points: [adjustedPos.x, adjustedPos.y], color },
      ]);
    }
  };

  const handleDrawing = (
    e: KonvaEventObject<MouseEvent> | KonvaEventObject<TouchEvent>,
  ) => {
    if (!canDraw) return;
    if (!isDrawing.current) {
      return;
    }

    const stage = e.target.getStage();
    const point = stage?.getPointerPosition();
    const lastLine = lines[lines.length - 1];
    if (point) {
      const adjustedPoint = adjustForScaling(point.x, point.y); // Ajusta para a escala
      lastLine.points = lastLine?.points.concat([
        adjustedPoint.x,
        adjustedPoint.y,
      ]);
    }

    setLines((prevLines) => {
      const updatedLines = [...prevLines];
      updatedLines[updatedLines.length - 1] = lastLine;
      return updatedLines;
    });
  };

  const handleStopDrawing = () => {
    if (!canDraw) return;
    isDrawing.current = false;
    const lastLine = lines.at(-1);
    if (lastLine) {
      socket?.emit("sendCanvasLine", publicId, lastLine);
    }
  };

  useEffect(() => {
    socket?.on("canvasLine", (newLine) => {
      console.log(newLine);
      setLines((prev) => [...prev, newLine]);
    });

    return () => {
      socket?.off("canvasLine");
    };
  }, [socket]);

  return {
    handleStopDrawing,
    handleDrawing,
    handleStartDrawing,
    changeColor,
    lines,
  };
};

export default useCanvasDraw;
