import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from "axios"
import { useEffect } from 'react'

function App() {
  const[infos,setInfos]=useState([])
  useEffect(()=>{
     axios.get('/api/info')
       .then((response)=>{
         setInfos(response.data)
       })
       .catch((error)=>{
         console.log(error)
       })
      
  })
  return (
    <>
      <h1>Hello Diponkar Barmon</h1>
       <p>Information: {infos.length}</p>

       {
         infos.map((info,index)=>(
            <div key={info.id}>
              <h3>{info.name}</h3>
              <p>{info.email}</p>
            </div> 
         ))
       }
    </>
  )
}

export default App

