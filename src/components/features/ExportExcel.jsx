import React from 'react'
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import '../../css/pharmacy.css'
const ExportExcel = ({ apiData, fileName }) => {
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const exportToCSV = (apiData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(apiData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  return (
    <button className='button button-lightyellow m-0 p-0  px-2 text-charcoal fw-bold ms-lg-2' onClick={(e) => exportToCSV(apiData, fileName)}>Export</button>
  );
}

export { ExportExcel }