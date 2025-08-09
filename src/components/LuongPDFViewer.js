import React, { useRef, useState, useEffect } from 'react';
import SignaturePad from 'signature_pad';
import { exportAllLuongIntoOnePDF } from './ExportLuongNhanVienPDF';

function LuongPDFViewer({ data }) {
  const [showSigPad, setShowSigPad] = useState(false);
  const [signed, setSigned] = useState(false);
  const [pdfURL, setPdfURL] = useState(null);
  const canvasRef = useRef();
  const sigPadRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current && !sigPadRef.current) {
      sigPadRef.current = new SignaturePad(canvasRef.current, {
        backgroundColor: '#f0f0f0',
        penColor: 'black',
      });
    }
  }, [showSigPad]);

  const handleViewPDF = () => {
    exportAllLuongIntoOnePDF(data, null, (blob) => {
      const url = URL.createObjectURL(blob);
      setPdfURL(url);
    });
  };

  const handleExportSignedPDF = () => {
    if (sigPadRef.current && !sigPadRef.current.isEmpty()) {
      const signatureImage = sigPadRef.current.toDataURL('image/png');
      exportAllLuongIntoOnePDF(data, signatureImage);
      setSigned(true);
    } else {
      alert('❌ Vui lòng ký trước khi xuất PDF!');
    }
  };

  const handleClear = () => {
    sigPadRef.current?.clear();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>📄 Xem và Ký xuất PDF Lương</h2>

      <div style={{ marginBottom: 10 }}>
        <button onClick={handleViewPDF}>👁️ Xem trước PDF</button>{' '}
        <button onClick={() => setShowSigPad(!showSigPad)} disabled={signed}>
          ✍️ Xác nhận ký & Xuất PDF
        </button>
      </div>

      {showSigPad && !signed && (
        <div style={{ marginBottom: 10 }}>
          <canvas
            ref={canvasRef}
            width={400}
            height={150}
            style={{ border: '1px solid #ccc', borderRadius: 4, backgroundColor: '#f0f0f0' }}
          />
          <div style={{ marginTop: 10 }}>
            <button onClick={handleExportSignedPDF}>✅ Ký & Xuất</button>{' '}
            <button onClick={handleClear}>🧹 Xóa</button>
          </div>
        </div>
      )}

      {pdfURL && (
        <iframe
          src={pdfURL}
          title="PDF Preview"
          width="100%"
          height="700px"
          style={{ border: '1px solid #ccc', marginTop: 20 }}
        />
      )}
    </div>
  );
}

export default LuongPDFViewer;
