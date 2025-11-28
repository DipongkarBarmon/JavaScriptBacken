import express, { json } from "express"


const app=express()
const PORT=process.env.PORT||3000

app.get('/api/info',(req,res)=>{
    const info=[
      { "id": 1, "name": "John Doe", "email": "john.doe@example.com" },
      { "id": 2, "name": "Sarah Smith", "email": "sarah.smith@example.com" },
      { "id": 3, "name": "Alex Johnson", "email": "alex.johnson@example.com" },
      { "id": 4, "name": "Emily Davis", "email": "emily.davis@example.com" },
      { "id": 5, "name": "Michael Brown", "email": "michael.brown@example.com" },
      { "id": 6, "name": "Olivia Wilson", "email": "olivia.wilson@example.com" },
      { "id": 7, "name": "Daniel Martinez", "email": "daniel.martinez@example.com" },
      { "id": 8, "name": "Sophia Taylor", "email": "sophia.taylor@example.com" },
      { "id": 9, "name": "James Anderson", "email": "james.anderson@example.com" },
      { "id": 10, "name": "Isabella Thomas", "email": "isabella.thomas@example.com" }
    ]
    return res.json(info)
})

app.listen(PORT,()=>{
   console.log(`Server Started at: http://localhost:${PORT}`);
})