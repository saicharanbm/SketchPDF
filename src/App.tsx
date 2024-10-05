import React, { useState, useRef } from "react";
import { GlobalWorkerOptions } from "pdfjs-dist";
import PdfViewer from "./components/PdfViewer";
// Manually import the worker
// import workerSrc from "";

// Set the workerSrc for pdfjs-dist
GlobalWorkerOptions.workerSrc =
  "../node_modules/pdfjs-dist/build/pdf.worker.min.mjs";

const App: React.FC = () => {
  const [pdfFile, setPdfFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Handle file input selection
  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPdfFile(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please select a valid PDF file.");
    }
  };

  // Handle drag-and-drop functionality
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPdfFile(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please drop a valid PDF file.");
    }
  };

  // Allow dragging over the div
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <>
      {pdfFile !== null && typeof pdfFile === "string" ? (
        <PdfViewer pdfFile={pdfFile} />
      ) : (
        <div
          className="file-upload-container"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="upload-area">
            <div className="icon-cloud-upload">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                width={40}
              >
                <path d="M7.685 3c1.364 0 2.633.582 3.533 1.573l.168.195.01-.008a4.7 4.7 0 0 1 2.128-.797l.289-.025.263-.007c1.633 0 3.125.835 4.009 2.187l.054.088.103.012c2.552.35 4.524 2.473 4.739 5.082l.014.238.005.234c0 3.02-2.346 5.484-5.284 5.6l-.216.004h-4.417V22H12v-4.624H6.315c-2.514 0-4.577-1.963-4.796-4.465l-.014-.223-.005-.218c0-1.315.511-2.548 1.4-3.458l.078-.077-.03-.144a5 5 0 0 1-.054-.39l-.016-.197-.008-.298C2.87 5.197 5.025 3 7.685 3m0 1.081c-2.06 0-3.732 1.71-3.732 3.825q0 .351.061.694l.047.226.114.472-.357.33a3.85 3.85 0 0 0-1.235 2.842c0 2.048 1.57 3.717 3.54 3.82l.192.005H12v-5.508l-2.52 2.5-.795-.787 3.857-3.821 3.856 3.821-.794.787-2.521-2.499v5.506H17.5c2.367 0 4.303-1.908 4.412-4.31l.005-.212c0-2.265-1.635-4.167-3.794-4.478l-.21-.025-.424-.04-.216-.366a3.71 3.71 0 0 0-3.197-1.85 3.65 3.65 0 0 0-2.034.616l-.197.142-.676.517-.504-.684a3.7 3.7 0 0 0-2.98-1.523"></path>
              </svg>
            </div>{" "}
            <input
              type="file"
              id="fileInput"
              className="file-input"
              accept="application/pdf"
              onChange={handleFileInput}
              ref={fileInputRef}
            />
            <label htmlFor="fileInput" className="file-label">
              <button
                className="file-button"
                onClick={() => fileInputRef.current?.click()}
              >
                Select PDF
              </button>
            </label>
            <p className="file-support-text">
              Add <strong>PDF</strong>, files
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default App;
