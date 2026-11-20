import { useState } from "react";
export default function RegisterPage(){

    const[formData,setFormData]=useState(
        {
            "username":"",
            "password":"",
            "email":""

        })


    async function handlesubmit(e){
        e.preventDefault();
        console.log("form sumbit",formData)
        

        let response= await fetch("http://127.0.0.1:8000/tickets/register/",
            {
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify(formData)


            }
        )
        if(response.ok)
            {
            
            const responseData= await response.json()
            console.log("user created",responseData)
            setFormData({
                username:"",
                email:"",
                password:""
            })

        }
        else{
            console.log("error creating user")
            //console.log("error creating  user")
        }

    }
    return(
        <>
        <h1>This is register page</h1>
        <form onSubmit={(e)=>{handlesubmit(e)}}>
            <input  value={formData.username} onChange={(e)=>{setFormData({...formData,"username":e.target.value})}} type="text" placeholder="username"/>
            <input value={formData.email} onChange={(e)=>{setFormData({...formData,"email":e.target.value})}} type="email" placeholder="email"/>
            <input value={formData.password} onChange={(e)=>{setFormData({...formData,"password":e.target.value})}}type="password" placeholder="password"/>
            <button type="sumbit">Register</button>
            

        </form>
        </>

    )
}