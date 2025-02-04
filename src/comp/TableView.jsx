import React, { useState, useEffect, useRef } from 'react';

export default function TableView({ selectObject }) {
  const [tableData, setTableData] = useState(null);
  const [error, setError] = useState(null);
  const [minfilterDate, setMinFilterDate] = useState(null);
  const [maxfilterDate, setMaxFilterDate] = useState(null);
  const [whereClause, setWhereClause] = useState("");
  const isFetched = useRef(false);

    const fetchData = () => {
      if (isFetched.current) return;
      isFetched.current = true;

      if (!whereClause == "") {
        selectObject.SO.where = whereClause;
        selectObject.SO.custom = ""
      }

      fetch("http://103.127.132.17:3000/read-sql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          table: selectObject.table,
          data: selectObject.SO,
          dbSQL: "baja",
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to retrieve data.");
          }
          return response.json();
        })
        .then((data) => {
          setTableData(data.results);
          setError(null);
        })
        .catch((error) => {
          setError(error.message);
          setTableData(null);
        })
        .finally(() => {
          isFetched.current = false;
        });
      }

    function dataProcessing(data) {
      const {valFormat, cellValue} = data;
      let fCellValue = null;
      const formatter = new Intl.DateTimeFormat('id-ID', { dateStyle: 'short' });
      switch (valFormat) {
        case "date":
          fCellValue = formatter.format(new Date(cellValue));
          break;
        case "number":
          fCellValue = Number(cellValue).toLocaleString();
          break;
        case "boolean":
          fCellValue = Boolean(cellValue);
          break;
        default:
          fCellValue = cellValue;
          break;
      }
      
      return fCellValue;
    }

    const renderTable = () => {
      if (!tableData || tableData.length === 0) {
        return <p>No data available.</p>;
      }
      
      const headers = Object.keys(tableData[0]);
      document.getElementById("TableHeader").innerHTML = selectObject.table.toUpperCase();
        
      return (
        <>
          <table>
            <thead>
              <tr id="Header">
                <th key={`header`}>NO</th>
                {headers.map((header, index) => (
                  <th key={`header-${index}`}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, rowIndex) => (
                <tr key={`row-${rowIndex}`}>
                  <td key={`cell-${rowIndex + 1}-1`}>{rowIndex + 1}</td>
                  { headers.map((header, cellIndex) => {
                    const isoDateRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(.\d+)?(Z|[\+\-]\d{2}:\d{2})?)?$/;
                    const valFormat = isoDateRegex.test(row[header]) ? "date" : typeof row[header];
                    const dataValue = dataProcessing({valFormat: valFormat, cellValue: row[header]});
                    return(<td key={`cell-${rowIndex}-${cellIndex}`} id={`Cell`}>{dataValue}</td>)
                    })
                  }
                </tr>
              ))}
            </tbody>
          </table>
        </>
      );
    };

    const handleSearch = () => {
      const searchTerm = document.getElementById("search").value;
      const tableObject = document.getElementById("TableView").childNodes[0].childNodes[1];

      const foundColor = searchTerm === "" ? "white" : "#e6e6e6";
      
      for (let i = 0; i < tableObject.childNodes.length; i++) {
        const rowObject = tableObject.childNodes[i];
        let searchFound = false;
        for (let n = 0; n < rowObject.childNodes.length; n++) {
          const cellObject = rowObject.childNodes[n];
          if (cellObject.innerHTML.toLowerCase().includes(searchTerm.toLowerCase())) {
            cellObject.style.backgroundColor = foundColor;
            searchFound = true;
          } else {
            cellObject.style.backgroundColor = "white";
          }
        }
        if (!searchFound) {
          rowObject.style.display = "none";
        } else {
          rowObject.style.display = "table-row";
        }
      }
    };

    function handlewithEnter(event) {
      if (event.key === "Enter") {
        handleSearch();
      }
    }

    useEffect(() => {
      isFetched.current = false;
      fetchData();
      document.getElementById("search").value = "";
      handleSearch();
    }, [whereClause]);
    
    return (
      <div className="App">
        <div id="search-bar">
          <input type="text" id="search" placeholder="Filter..." onKeyUp={handlewithEnter} />
        </div>
        <div id="filter-bar">
          <input type="date" id="min-filter-date" onChange={(e) => {
            setMinFilterDate(e.target.value);
            if (maxfilterDate) { 
              setWhereClause(`\`TGL INT\` BETWEEN '${e.target.value}' AND '${maxfilterDate}'`);
            }
          }} />
          <input type="date" id="max-filter-date" onChange={(e) => {
            setMaxFilterDate(e.target.value);
            if (minfilterDate) {
              setWhereClause(`\`TGL INT\` BETWEEN '${minfilterDate}' AND '${e.target.value}'`);
            }
          }} />
        </div>
        <h1 id="TableHeader">{selectObject.table.toUpperCase()}</h1>
        <div id="TableView">
          {error && <p style={{ color: 'red' }}>Error: {error}</p>}
          {tableData && renderTable()}
        </div>
      </div>
    )
}