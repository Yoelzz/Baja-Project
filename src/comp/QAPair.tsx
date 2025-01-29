import React, { useContext } from 'react'
import { FormContext } from './SimpleForm.tsx'

export default function QAPair() {
  const props = useContext(FormContext);
  return (
    <div className={'QAPair ' + props[1]}>
      <p className={"Q " + props[1] + " cell"}>{props[0].qText}</p>
      <input className={"Ans " + props[1] + " cell"} type={props[0].aType} id={props[0].qID}/>
    </div>
  )
}
