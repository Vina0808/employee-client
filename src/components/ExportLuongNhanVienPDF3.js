import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { numberToVietnameseWords } from '../utils/numberToVietnameseWords';
import logo from '../assets/logo192.png';
import '../fonts/TimesNewRoman';

const formatThangDL = (thangdl) => {
  if (!thangdl || thangdl.length < 6) {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    return `THÁNG ${month} NĂM ${year}`;
  }
  const year = thangdl.slice(0, 4);
  const month = thangdl.slice(4, 6);
  return `THÁNG ${month} NĂM ${year}`;
};

const capitalizeFirst = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * @param {Array} data - dữ liệu bảng lương
 * @param {string|null} signatureImage - ảnh chữ ký dạng base64 (nếu có)
 * @param {function|null} callback - callback nhận PDF blob (nếu có)
 * @param {string|null} signerName - tên người ký (đặt dưới chữ ký). Nếu không truyền, sẽ lấy từ NHAN_VIEN_BH
 */
export const exportAllLuongIntoOnePDF = (data, signatureImage = null, callback = null, signerName = '') => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const now = new Date();
  const ngayIn = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;

  const nhanVienMap = {};

  data.forEach((item) => {
    const key = item.NHAN_VIEN_BH || 'Chưa rõ';
    if (!nhanVienMap[key]) {
      nhanVienMap[key] = {
        NHAN_VIEN_BH: item.NHAN_VIEN_BH,
        PHONG_BH: item.PHONG_BH,
        THANGDL: item.THANGDL || '',
        TONG_DOANH_THU: 0,
        DATA: [],
      };
    }
    const doanhThu = Number(item.GIA_GOI_CUOC || 0);
    nhanVienMap[key].TONG_DOANH_THU += doanhThu;
    nhanVienMap[key].DATA.push(item);
  });

  const allNhanVien = Object.values(nhanVienMap);

  allNhanVien.forEach((nv, index) => {
    if (index > 0) doc.addPage();

    const thanhTienTong = nv.TONG_DOANH_THU * 0.5;
    const yStart = 50;

    // Logo nền mờ
    doc.setGState(new doc.GState({ opacity: 0.04 }));
    doc.addImage(logo, 'PNG', 60, 60, 90, 90);
    doc.setGState(new doc.GState({ opacity: 1 }));

    // Header
    doc.setFont('TimesNewRoman', 'bold');
    doc.setFontSize(9);
    doc.text('TẬP ĐOÀN BƯU CHÍNH', 30, 10, { align: 'center' });
    doc.text('VIỄN THÔNG VIỆT NAM', 30, 15, { align: 'center' });
    doc.text('VNPT BÌNH PHƯỚC', 30, 20, { align: 'center' });

    doc.setFontSize(11);
    doc.text('CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM', 105, 10, { align: 'center' });

    doc.setFont('TimesNewRoman', 'italic');
    doc.text('Độc lập - Tự do - Hạnh phúc', 105, 16, { align: 'center' });
    doc.line(75, 17.5, 135, 17.5);

    doc.setFontSize(10);
    doc.text(`Ngày in: ${ngayIn}`, 190, 28, { align: 'right' });

    // Tiêu đề
    doc.setFontSize(13);
    doc.setFont('TimesNewRoman', 'bold');
    doc.text(`BẢNG TỔNG HỢP LƯƠNG CÁ NHÂN ${formatThangDL(nv.THANGDL)}`, 105, 36, { align: 'center' });

    // Nội dung
    doc.setFont('TimesNewRoman', 'normal');
    doc.setFontSize(12);
    doc.text(`👤 Tên nhân viên: ${nv.NHAN_VIEN_BH}`, 20, yStart);
    doc.text(`🏢 Phòng ban: ${nv.PHONG_BH}`, 20, yStart + 10);
    doc.text(`💰 Doanh thu: ${nv.TONG_DOANH_THU.toLocaleString('vi-VN')} VNĐ`, 20, yStart + 20);
    doc.text(`💵 Lương nhận: ${thanhTienTong.toLocaleString('vi-VN')} VNĐ`, 20, yStart + 30);
    doc.text(`📝 Ghi bằng chữ: ${capitalizeFirst(numberToVietnameseWords(thanhTienTong))}`, 20, yStart + 40);

    // Tiêu đề bảng
    doc.setFont('TimesNewRoman', 'bold');
    doc.setFontSize(11);
    doc.text('Chi tiết Lương đơn giá theo Dịch vụ viễn thông và Loại giao dịch:', 20, yStart + 46);

    // Chuẩn bị bảng chi tiết
    const summaryMap = {};
    nv.DATA.forEach((row) => {
      const loai = row.LOAI_GIAO_DICH || 'Không rõ';
      const hinhthuc = row.HINHTHUC_TB || 'Không rõ';
      const key = `${loai} - ${hinhthuc}`;
      if (!summaryMap[key]) {
        summaryMap[key] = { LOAI: loai, HINHTHUC: hinhthuc, DOANH_THU: 0 };
      }
      summaryMap[key].DOANH_THU += Number(row.GIA_GOI_CUOC || 0);
    });

    const tableBody = Object.values(summaryMap).map((row, i) => {
      const thanhTien = row.DOANH_THU * 0.5;
      return [
        i + 1,
        row.LOAI,
        row.HINHTHUC,
        row.DOANH_THU.toLocaleString('vi-VN'),
        '50%',
        thanhTien.toLocaleString('vi-VN'),
      ];
    });

    const totalThanhTien = Object.values(summaryMap).reduce(
      (sum, row) => sum + (Number(row.DOANH_THU || 0) * 0.5),
      0
    );

    tableBody.push([
      '',
      '',
      { content: 'Tổng cộng', styles: { fontStyle: 'bold' } },
      '',
      '',
      { content: totalThanhTien.toLocaleString('vi-VN'), styles: { fontStyle: 'bold' } },
    ]);

    autoTable(doc, {
      startY: yStart + 50,
      styles: { font: 'TimesNewRoman', fontSize: 10 },
      head: [['STT', 'Loại giao dịch', 'Dịch vụ viễn thông', 'Doanh thu', 'Đơn giá', 'Thành tiền']],
      body: tableBody,
      margin: { left: 20, right: 20 },
    });

    const yAfterTable = doc.lastAutoTable.finalY || yStart + 90;

    // Chữ ký - Xác nhận nhân viên
    doc.setFontSize(11);
    doc.text('Xác nhận Nhân viên', 30, yAfterTable + 10);
    doc.line(30, yAfterTable + 16, 80, yAfterTable + 16);
    doc.text('Ký tên', 30, yAfterTable + 22);

    if (signatureImage) {
      doc.addImage(signatureImage, 'PNG', 32, yAfterTable + 24, 40, 20);
      const signer = signerName || nv.NHAN_VIEN_BH || '';
      if (signer) {
        doc.setFontSize(10);
        doc.setFont('TimesNewRoman', 'italic');
        doc.text(`(${signer})`, 52, yAfterTable + 46, { align: 'center' });
      }
    }

    doc.setFont('TimesNewRoman', 'normal');
    doc.text('Xác nhận Đơn vị', 140, yAfterTable + 10);
    doc.line(140, yAfterTable + 16, 190, yAfterTable + 16);
    doc.text('Ký tên', 140, yAfterTable + 22);
  });

  if (typeof callback === 'function') {
    const blob = doc.output('blob');
    callback(blob);
  } else {
    doc.save('BangTongLuong_All.pdf');
  }
};
