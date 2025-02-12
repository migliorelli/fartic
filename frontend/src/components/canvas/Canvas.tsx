import { useSocket } from "@/contexts/SocketContext";
import useCanvasDraw from "@/hooks/use-canvas-draw";
import useDimensions from "@/hooks/use-dimensions";
import useMediaQuery from "@/hooks/use-media-query";
import { Layer, Line, Stage } from "react-konva";
import { useParams } from "react-router-dom";
import classes from "./Canvas.module.css";

// const colors = [
//   "#000000",
//   "#FF0000",
//   "#00FF00",
//   "#0000FF",
//   "#FFFF00",
//   "#FF00FF",
//   "#00FFFF",
//   "#FFFFFF",
// ];

const Canvas: React.FC = () => {
  const { publicId } = useParams<{ publicId: string }>();
  const { canDraw, room, players } = useSocket();
  const { lines, handleDrawing, handleStartDrawing, handleStopDrawing } =
    useCanvasDraw(publicId!);

  const mobile = useMediaQuery();
  const dimensions = useDimensions();

  const canvasWidth = mobile ? dimensions.width : 1000;
  const canvasHeight = mobile ? (dimensions.width * 9) / 16 : 562.5;

  const scaleX = canvasWidth / 1000;
  const scaleY = canvasHeight / 562.5;

  if (!canDraw && room) {
    return (
      <div className={classes.startScreen}>
        <h1>
          {room.theme.name[0].toUpperCase()}
          {room.theme.name.substring(1)}
        </h1>
        <button className="btn" disabled={players.length <= 1}>
          Start game
        </button>
      </div>
    );
  }

  return (
    <Stage
      height={canvasHeight}
      width={canvasWidth}
      onMouseDown={handleStartDrawing}
      onTouchStart={handleStartDrawing}
      onMouseMove={handleDrawing}
      onTouchMove={handleDrawing}
      onMouseUp={handleStopDrawing}
      onTouchEnd={handleStopDrawing}
    >
      <Layer>
        {lines.map((line, index) => (
          <Line
            key={index}
            points={line.points.map((point, i) =>
              i % 2 === 0 ? point * scaleX : point * scaleY,
            )}
            stroke={line.color}
            strokeWidth={5}
            tension={0.5}
            lineCap="round"
            lineJoin="round"
          />
        ))}
      </Layer>
    </Stage>
  );
};

export default Canvas;
