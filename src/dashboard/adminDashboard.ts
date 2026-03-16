import { Request, Response } from "express";

export const adminDashboard = (req: Request, res: Response) => {

res.send(`
<!DOCTYPE html>
<html>
<head>
<title>Smart Rate Limiter Dashboard</title>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<style>
body{
font-family: Arial;
background:#0f172a;
color:white;
padding:40px;
}

h1{
margin-bottom:30px;
}

.card{
background:#1e293b;
padding:20px;
margin-bottom:20px;
border-radius:10px;
}

canvas{
background:white;
border-radius:10px;
padding:10px;
}
</style>

</head>

<body>

<h1>Smart API Rate Limiter Dashboard</h1>

<div class="card">
<h3>Total Requests</h3>
<h2 id="totalRequests">Loading...</h2>
</div>

<div class="card">
<h3>Top Endpoints</h3>
<canvas id="endpointChart"></canvas>
</div>

<div class="card">
<h3>Top Users</h3>
<canvas id="userChart"></canvas>
</div>

<script>

async function loadStats(){

const traffic = await fetch("/admin/traffic").then(r=>r.json())
document.getElementById("totalRequests").innerText = traffic.total_requests

const endpoints = await fetch("/admin/top-endpoints").then(r=>r.json())
const users = await fetch("/admin/top-users").then(r=>r.json())

renderEndpoints(endpoints)
renderUsers(users)

}

function renderEndpoints(data){

const labels = data.map(e=>e.endpoint)
const values = data.map(e=>e.count)

new Chart(document.getElementById("endpointChart"),{
type:"bar",
data:{
labels:labels,
datasets:[{
label:"Requests",
data:values
}]
}
})

}

function renderUsers(data){

const labels = data.map(u=>u.email)
const values = data.map(u=>u.requests)

new Chart(document.getElementById("userChart"),{
type:"bar",
data:{
labels:labels,
datasets:[{
label:"Requests",
data:values
}]
}
})

}

loadStats()

</script>

</body>
</html>
`)
}