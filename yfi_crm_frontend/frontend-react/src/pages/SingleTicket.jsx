import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function SingleTicket() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("")
    const [newUpdate,setNewUpdate]=useState("")
    const [issuedescription,setIssueDescription]=useState("")
    const [priority,setPriority]=useState("")
    const [status,setStatus]=useState("")
    const [isAdminOrManager,setIsAdminOrManager]=useState(false)
    const [engineersList,setEngineersList]=useState([])
    const [assignedTo,setAssignedTo]=useState("")

    async function apiFetchSingleTicket(token) {

        let endpointUrl = "http://127.0.0.1:8000/tickets/" + id + "/";

        return await fetch(endpointUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        });

    }
    async function apiDeleteTicket(token){
        let endpointUrl="http://127.0.0.1:8000/tickets/" + id + "/";
        return await fetch(endpointUrl,{
            method:"DELETE",
            headers:{
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        })
    }
    async function apiAddTicketUpdate(token,updateData){
        let endpointUrl="http://127.0.0.1:8000/tickets/" + id + "/updates/"
        return await fetch(endpointUrl,{
            method:"POST",
            headers:{
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token},
                    body:JSON.stringify(updateData)
        })

    }
    async function apiUpdateTicket(token, updateData) {

    let endpointUrl = "http://127.0.0.1:8000/tickets/" + id + "/";

    return await fetch(endpointUrl, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(updateData)
    });
}
    async function apiFetchEngineers(token) {

    let endpointUrl = "http://127.0.0.1:8000/tickets/engineers/";

    return await fetch(endpointUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        }
    });

}


    async function loadTicketData() {

        setLoading(true);

        let token = localStorage.getItem("accessToken");

        let response = await apiFetchSingleTicket(token);
        

        if (response.ok) {

            let data = await response.json();

            setTicket(data);
            setIssueDescription(data.issue_description);
            setPriority(data.priority);
            setStatus(data.status);
            setAssignedTo(data.assigned_to);
            await loadEngineers();


        } else {

            setErrorMessage(
                "Unauthorized to view this ticket or ticket does not exist."
            );

        }

        setLoading(false);
        
    }
    async function deleteTicket() {
        let token=localStorage.getItem("accessToken")
        let response=await apiDeleteTicket(token)
        if (response.ok){
            navigate("/dashboard")
        }
        
    }
    async function addTicketUpdate(){
        let token =localStorage.getItem("accessToken")
        let updateData={
            message:newUpdate
        }
        let response=await apiAddTicketUpdate(token,updateData)
        if(response.ok){
            await loadTicketData()
            setNewUpdate("")

        }

    }
    async function updateTicket(){
        let token=localStorage.getItem("accessToken")
        let updateData={
            issue_description:issuedescription,
            priority:priority,
            status:status,
            assigned_to:assignedTo

        }
        let response=await apiUpdateTicket(token,updateData)
        if (response.ok){
            await loadTicketData()

        }
    }
    async function loadEngineers(){
        let token=localStorage.getItem("accessToken")
        let response=await apiFetchEngineers(token)
        if (response.ok){
            let data=await response.json()
            setEngineersList(data)
        }

    }
    
    useEffect(() => {
        loadTicketData();
    }, [id]);

    if (loading) {
        return <h2>Loading...</h2>;
    }

    if (errorMessage) {
        return (
            <div>
                <h2>{errorMessage}</h2>

                <button onClick={() => navigate("/dashboard")}>
                    Back to Dashboard
                </button>
            </div>
        );
    }

    return (
    <div className="container py-4">

        <h1 className="mb-3">Single Ticket</h1>

        <button
            className="btn btn-secondary mb-3"
            onClick={() => navigate("/dashboard")}
        >
            Back to Dashboard
        </button>

        <hr />

        {/* Ticket Details */}
        <div className="card mb-4">
            <div className="card-body">

                <p>
                    <strong>Ticket ID:</strong> {ticket.id}
                </p>

                <p>
                    <strong>Customer Name:</strong> {ticket.customer_name}
                </p>

                {/* Issue Description */}
                <div className="mb-3">
                    <strong>Issue Description:</strong>
                    <br />

                    <textarea
                        className="form-control"
                        value={issuedescription}
                        onChange={(e) => setIssueDescription(e.target.value)}
                    ></textarea>
                </div>

                {/* Priority */}
                <div className="mb-3">
                    <strong>Priority:</strong>
                    <br />

                    <select
                        className="form-select"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                    >
                        <option value="HIGH">High</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="LOW">Low</option>
                        <option value="UNASSIGNED">Unassigned</option>
                    </select>
                </div>

                {/* Status */}
                <div className="mb-3">
                    <strong>Status:</strong>
                    <br />

                    <select
                        className="form-select"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="OPEN">Open</option>
                        <option value="ASSIGNED">Assigned</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="RESOLVED">Resolved</option>
                    </select>
                </div>

                {/* Assigned Engineer */}
                <div className="mb-3">
                    <strong>Assigned Engineer:</strong>
                    <br />

                    <select
                        className="form-select"
                        value={assignedTo}
                        onChange={(e) => setAssignedTo(e.target.value)}
                    >
                        <option value="">Select Engineer</option>

                        {engineersList.map((engineer) => (
                            <option
                                key={engineer.id}
                                value={engineer.id}
                            >
                                {engineer.username}
                            </option>
                        ))}
                    </select>
                </div>

            </div>
        </div>

        {/* Action Buttons */}
        <div className="mb-4">

            <button
                className="btn btn-primary me-2"
                onClick={updateTicket}
            >
                Save Changes
            </button>

            <button
                className="btn btn-danger"
                onClick={deleteTicket}
            >
                Delete Ticket
            </button>

        </div>

        {/* Add Update */}
        <div className="card mb-4">
            <div className="card-body">

                <h5 className="card-title">
                    Add Update
                </h5>

                <textarea
                    className="form-control mb-3"
                    rows="4"
                    placeholder="Write an update..."
                    value={newUpdate}
                    onChange={(e) => setNewUpdate(e.target.value)}
                ></textarea>

                <button
                    className="btn btn-success"
                    onClick={addTicketUpdate}
                >
                    Add Update
                </button>

            </div>
        </div>

        {/* Ticket Updates */}
        <div className="card">
            <div className="card-body">

                <h4 className="card-title mb-4">
                    Ticket Updates
                </h4>

                {ticket.updates.map((item) => (
                    <div
                        key={item.id}
                        className="border rounded p-3 mb-3"
                    >

                        <p className="mb-2">
                            <strong>User:</strong>{" "}
                            {item.user.username}
                        </p>

                        <p className="mb-2">
                            <strong>Message:</strong>{" "}
                            {item.message}
                        </p>

                        <p className="text-muted mb-0">
                            <strong>Created At:</strong>{" "}
                            {item.created_at}
                        </p>

                    </div>
                ))}

            </div>
        </div>

    </div>
);}