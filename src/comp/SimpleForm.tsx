import React from 'react'
import QAPair from './QAPair';

export const FormContext = React.createContext<any>(undefined);

export default function SimpleForm(props) {
  const handleSubmit = (e) => {
    e.preventDefault()
    const inputObject: Record<string, string> = {};
    const answers = Array.from(document.getElementsByClassName('Ans')) as HTMLInputElement[];

    answers.forEach((input) => {
      inputObject[input.id] = input.value;
    });

    fetch("http://103.127.132.17:3000/execute-sql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        table: "Test",
        data: inputObject,
        dbSQL: "test data"
      }),
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to insert data.");
      }
      return response.json();
    })
    .then((data) => {
      alert(data.message || "Data inserted successfully!");
    })
    .catch((error) => {
      alert("Error: " + error.message);
    });
  }

  return (
      <div className="Form Grid">
        {props.QAForm.map((_, index) => {
          return (
            <FormContext.Provider value={[props.QAForm[index], index]}>
              <QAPair />
            </FormContext.Provider>
          )
        })}
        <input className="submitBtn" type="submit" value="Submit" onClick={handleSubmit}/>
      </div>
  )
}
