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

export type { PdfViewerProps, ControlsProps };
