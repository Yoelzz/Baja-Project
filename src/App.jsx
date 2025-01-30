import React from 'react'
import TableView from './comp/TableView.jsx'

function App() {

  const QAForm = [{qText:'What is the purpose of React? what the best way to use it? how to use it?, please answer in a short paragraph', qID: "Purpose", aType:'text-box'},
                  {qText:'What is the purpose of React?', qID: "Purpose 2", aType:'number'},
                  {qText:'What is the purpose of React? 2', qID: "Purpose 3", aType:'text-area'},
                ];

<<<<<<< HEAD
  const selObj = {table: "Rekening", SO: {selectKeys: [], where: ""}};
=======
  const selObj = {table: "Transaksi", SO: {selectKeys: [], where: ""}};
>>>>>>> bc9f799537176c3b6e0379f74cd085f6ebc18d86

  return (
    <TableView selectObject={selObj}/>
  )
}

export default App
