interface PdfViewerProps {
  pdfFile: string | null;
}
interface ControlsProps {
  zoom: number;
  currentPage: number;
  numPages: number;
  handleNextPage: () => void;
  handlePreviousPage: () => void;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
}
interface CanvasDimension {
  width: number;
  height: number;
}

export type { PdfViewerProps, ControlsProps, CanvasDimension };
