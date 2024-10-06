import { Element, Point } from "./typesAndInterfaces";

const drawRectangle = function (
  start: Point,
  end: Point,
  context: CanvasRenderingContext2D
) {
  // Save the current context state
  context.save();

  // Translate the context to localize the pattern to this rectangle
  context.translate(start.x, start.y);

  // Generate a new pattern for each rectangle

  // Draw the rectangle relative to the translated context
  context.beginPath();
  context.rect(0, 0, end.x - start.x, end.y - start.y);

  // Draw the stroke/outline
  context.strokeStyle = "black"; // Customize stroke color
  // Customize stroke thickness
  context.stroke();

  // Restore the context to its original state
  context.restore();
};

const drawFreeStyle = function (
  element: Element,
  context: CanvasRenderingContext2D,
  temp: boolean = false
) {
  if (temp) {
    // For temporary drawing, connect the last two points
    const lastPoint = element.points[element.points.length - 1];
    const secondLastPoint = element.points[element.points.length - 2];

    context.moveTo(secondLastPoint.x, secondLastPoint.y);
    context.lineTo(lastPoint.x, lastPoint.y);
  } else {
    context.moveTo(element.points[0].x, element.points[0].y);
    element.points.forEach((point) => {
      context.lineTo(point.x, point.y);
    });
  }
};

const drawLine = function (
  lineStart: Point,
  lineEnd: Point,
  context: CanvasRenderingContext2D
) {
  context.moveTo(lineStart.x, lineStart.y);
  context.lineTo(lineEnd.x, lineEnd.y);
};
const drawArrow = function (
  context: CanvasRenderingContext2D,
  arrowStart: Point,
  arrowEnd: Point
) {
  const { x: fromx, y: fromy } = arrowStart;
  const { x: tox, y: toy } = arrowEnd;
  const headlen = 10;
  const angle = Math.atan2(toy - fromy, tox - fromx);

  // Start a new path
  context.beginPath();

  // Move to start point
  context.moveTo(fromx, fromy);

  // Draw line to end point
  context.lineTo(tox, toy);

  // Draw arrowhead
  context.lineTo(
    tox - headlen * Math.cos(angle - Math.PI / 6),
    toy - headlen * Math.sin(angle - Math.PI / 6)
  );
  context.moveTo(tox, toy);
  context.lineTo(
    tox - headlen * Math.cos(angle + Math.PI / 6),
    toy - headlen * Math.sin(angle + Math.PI / 6)
  );

  // Stroke the path
  context.stroke();
};
const drawRhombus = function (
  context: CanvasRenderingContext2D,
  rhombusStart: Point,
  rhombusEnd: Point
) {
  // Calculate the center of the rhombus
  const centerX = (rhombusStart.x + rhombusEnd.x) / 2;
  const centerY = (rhombusStart.y + rhombusEnd.y) / 2;
  context.save();
  // Translate the context to the center of the rhombus
  context.translate(centerX, centerY);

  // Calculate relative positions from the center
  const halfWidth = (rhombusEnd.x - rhombusStart.x) / 2;
  const halfHeight = (rhombusEnd.y - rhombusStart.y) / 2;

  context.beginPath(); // Make sure to begin a new path
  context.moveTo(0, -halfHeight); // Top point
  context.lineTo(halfWidth, 0); // Right point
  context.lineTo(0, halfHeight); // Bottom point
  context.lineTo(-halfWidth, 0); // Left point
  context.closePath();

  // Reset the translation to avoid affecting other drawings
  context.restore();
};

const drawCircle = function (
  context: CanvasRenderingContext2D,
  start: Point,
  end: Point
) {
  // Save the context to restore it later
  context.save();

  // Calculate the center of the ellipse
  const centerX = (start.x + end.x) / 2;
  const centerY = (start.y + end.y) / 2;

  // Calculate the radii (half the width and height)
  const radiusX = Math.abs(end.x - start.x) / 2;
  const radiusY = Math.abs(end.y - start.y) / 2;

  // Translate the context to shift the drawing
  context.translate(centerX, centerY);

  // Draw the ellipse with the translated coordinate system
  context.beginPath();
  context.ellipse(
    0, // Use (0, 0) since we already translated to centerX, centerY
    0,
    radiusX,
    radiusY,
    0, // Rotation
    0, // Start angle
    2 * Math.PI // End angle (full circle)
  );

  // Fill with a pattern if available

  // Restore the context to its original state
  context.restore();
};

export {
  drawRectangle,
  drawFreeStyle,
  drawLine,
  drawArrow,
  drawRhombus,
  drawCircle,
};
