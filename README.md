# SketchPDF

This project is a React-based application that allows users to load PDF documents, annotate them with various drawing tools, and download the annotated version as a PDF file.

## Features

- **PDF Rendering**: Load and view PDF files within the application.
- **Zoom Controls**: Increase or decrease the zoom level of the PDF viewer.
- **Annotation Tools**:
  - Rectangle
  - Free-style pencil
  - Line
  - Rhombus
  - Circle/Ellipse
- **Multi-page Support**: Navigate through different pages of the loaded PDF.
- **Touch Support**: Drawing and navigation with both mouse and touch inputs.
- **Download Annotated PDF**: Export the PDF with the annotations as an image overlay.

## Dependencies

- [React](https://reactjs.org/)
- [pdfjs-dist](https://github.com/mozilla/pdf.js) for rendering PDFs.
- [jsPDF](https://github.com/parallax/jsPDF) for generating PDFs with annotations.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/saicharanbm/SketchPDF.git
   cd pdf-annotator
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

## How to Use

1. **Loading a PDF**:

   - Upload a PDF file to view it in the application.

2. **Zooming**:

   - Use the zoom controls (+ / - buttons) to zoom in and out of the PDF.

3. **Annotating**:

   - Choose a drawing tool from the toolbar (rectangle, line, freehand, rhombus, circle).
   - Click and drag on the canvas to create the annotation.
   - Use either the mouse or touch input to annotate.

4. **Navigating Pages**:

   - Use the page navigation controls to move between different pages of the PDF.

5. **Saving the Annotated PDF**:
   - After making annotations, click on the download button to export the PDF with all the annotations.

## Future Enhancements

- **Eraser Tool**: Add functionality to erase individual annotations.
- **Text Tool**: Allow users to insert text annotations.
- **Shape Fill and Stroke Customization**: Add more customization options for annotations.
