import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Dashboard() {

    const navigate = useNavigate()
    const [currentPage,setCurretPage]=useState(1)
    const [prevPage,setPrevPage]=useState(null)
    const [nextPage,setNextPage]=useState(null)

    const [tickets, setTickets] = useState([])
    async function fetchTicket(token) {
        let response = await fetch(
            "http://127.0.0.1:8000/tickets/?page="+currentPage,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                }
            }
        )
        return response
    }

    async function loadTickets() {
        console.log("load function called ")
        let token = localStorage.getItem("accessToken")
        let secondToken = ""
        console.log("First token")
        console.log(token)
        // read about axios why it is used and how it helps in talking to api 
        let response = await fetchTicket(token)
        console.log(response)
        if (response.status == 401) {
            let refresh = localStorage.getItem("refreshToken")
            let tokenResponse = await fetch("http://127.0.0.1:8000/refresh_login/",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ "refresh": refresh })
                }
            )
            if (tokenResponse.status == 401 || tokenResponse.status == 400) {
                navigate("/login")
            }
            if (tokenResponse.ok) {
                secondToken = await tokenResponse.json()
                console.log("Obtained new token")
                console.log(token)
                localStorage.setItem("accessToken", secondToken.access)
            }
            response = await fetchTicket(secondToken.access)
        }
        if (response.ok) {
            console.log("all good")
            let data = await response.json()

            console.log(data)
            setTickets(data.results)
            setNextPage(data.next)
            setPrevPage(data.previous)

        }

    }

    useEffect(
        () => { loadTickets() },
        [currentPage]
    )

    return (
        <>
            <h1>This is Dashboard</h1>
            {tickets.map((ticket) => (
                <div key={ticket.id}>
                    <p>ID: {ticket.id}</p>
                    <p>Customer: {ticket.customer_name}</p>
                    <p>Issue: {ticket.issue_description}</p>
                </div>))}
                <span>
                  <button onClick={()=>{
                    if(prevPage){setCurretPage((cp)=>(cp-1))}
                  }}>Previous page</button>
                  <span>{currentPage}</span>
                  <button onClick={() =>{
                    if(nextPage){
                        setCurretPage((cp)=>(cp+1))
                    }
                  }}>Next page</button>  
                </span>
        </>
    )

}