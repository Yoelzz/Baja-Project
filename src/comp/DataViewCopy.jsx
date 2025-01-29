import React from 'react'

export default function DataView(props) {
    const handleSubmit = (e) => {
      e.preventDefault()

      fetch("http://103.127.132.17:3000/read-sql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
        table: props.selectObject.table,
        data: props.selectObject.SO,
        dbSQL: "baja"
        }),
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to retreive data.");
        }
        return response.json();
      })
      .then((data) => {
        alert(data.message || "Data retreived successfully!");
        const tableDiv =document.getElementById("DataView");
        const table = document.createElement("table");
        table.innerHTML = createTable(data);
        tableDiv.appendChild(table);
      })
      .catch((error) => {
        alert("Error: " + error.message);
      });
    }

    function createTable(data) {
      return (
        <>
          <h1>{props.selectObject.table.toUpperCase()}</h1>
          <table>
            <tr key='Header Row'>
              <th key={'Header 0'}>ID</th>
              {
                Object.keys(data.results[0]).forEach((d, index) => {
                  return (
                    <th key={'Header ' + (index + 1)}>{d}</th>
                  )
                })
              }
            </tr>
            {data.results.map((dt, index) => {
              return (
                <tr key={'Row ' + (index + 1)}>
                  {
                    Object.keys(dt).forEach((d, i) => {
                      return (
                        <td key={String.fromCharCode(65 + index) + i}>{d}</td>
                      )
                    })
                  }
                </tr>
              )
            })}
          </table>
        </>
      )
    }
    
    return (
        <div>
          <input className="submitBtn" type="submit" value="Submit" onClick={handleSubmit}/>
          <div id="DataView">
            
          </div>
        </div>
    )
}