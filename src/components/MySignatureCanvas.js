// src/components/MySignatureCanvas.js
import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import SignaturePad from 'signature_pad';

const MySignatureCanvas = forwardRef((props, ref) => {
  const canvasRef = useRef(null);
  const sigPadRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      sigPadRef.current = new SignaturePad(canvasRef.current);
    }
  }, []);

  useImperativeHandle(ref, () => ({
    toDataURL: () => sigPadRef.current?.toDataURL(),
    clear: () => sigPadRef.current?.clear(),
  }));

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={150}
      style={{ border: '1px solid gray', borderRadius: 4 }}
    />
  );
});

export default MySignatureCanvas;
