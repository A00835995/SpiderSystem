// utils/csvUtils.js

export function convertArrayOfObjectsToCSV(array) {
    if (!array || array.length === 0) return "";
    const columnDelimiter = ",";
    const lineDelimiter = "\n";
    const keys = Object.keys(array[0]);
  
    let result = keys.join(columnDelimiter) + lineDelimiter;
  
    array.forEach((item) => {
      let row = keys.map((key) => {
        if (key === "ultimaActualizacion" && item[key] instanceof Date) {
          return item[key].toLocaleString();
        }
        return item[key];
      }).join(columnDelimiter);
      result += row + lineDelimiter;
    });
  
    return result;
  }
  
  export function downloadCSV(array) {
    let csv = convertArrayOfObjectsToCSV(array);
    if (!csv) return;
  
    const filename = "inventario.csv";
    const link = document.createElement("a");
  
    if (!csv.match(/^data:text\/csv/i)) {
      csv = `data:text/csv;charset=utf-8,${csv}`;
    }
  
    link.setAttribute("href", encodeURI(csv));
    link.setAttribute("download", filename);
    link.click();
  }
  