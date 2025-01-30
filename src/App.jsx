import React from 'react'
import TableView from './comp/TableView.jsx'

function App() {

  const QAForm = [{qText:'What is the purpose of React? what the best way to use it? how to use it?, please answer in a short paragraph', qID: "Purpose", aType:'text-box'},
                  {qText:'What is the purpose of React?', qID: "Purpose 2", aType:'number'},
                  {qText:'What is the purpose of React? 2', qID: "Purpose 3", aType:'text-area'},
                ];

  const selObj = {table: "Penjualan", SO: {selectKeys: [], where: ""}};

  return (
    <TableView selectObject={selObj}/>
  )
}

export default App
