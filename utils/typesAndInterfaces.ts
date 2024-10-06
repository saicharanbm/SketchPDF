interface PdfViewerProps {
  pdfFile: string | null;
  setPdfFile: (pdfFile: string | null) => void;
}
type Tool = "pencil" | "rectangle" | "ellipse" | "line" | "rhombus";
interface ControlsProps {
  zoom: number;
  currentPage: number;
  numPages: number;
  handleNextPage: () => void;
  handlePreviousPage: () => void;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  downloadPDF: () => void;
}
interface CanvasDimension {
  width: number;
  height: number;
}
interface Point {
  x: number;
  y: number;
}
interface Element {
  id: number;
  type: Tool;
  points: Point[];
}
interface NavBarProps {
  setTool: (tool: Tool) => void;
  closeDocument: () => void;
  tool: Tool;
}

export type {
  PdfViewerProps,
  ControlsProps,
  CanvasDimension,
  Point,
  Tool,
  Element,
  NavBarProps,
};
