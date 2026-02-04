
import { useNavigate } from "react-router"
import { useEffect, useState } from "react"
import { PiBirdFill } from "react-icons/pi";

export default function Nav(){
    const navigate = useNavigate()

    return(
        <div className="container">
            <br/>
            <div className="box">
                <div className="one">
                    <h4 className="float-left">
                    ChatOffline  <PiBirdFill/>
                    </h4>
                </div>
                <div className="one">
            
                    <div className="box ">
                    <div className="one">
                        <a  onClick={()=>{ if (localStorage.getItem("user")!== null){navigate("/send")}}}> File</a>
                    </div>
                    <div className="one">
                        <a onClick={()=>{ if (localStorage.getItem("user")!== null){navigate("/chat")}}}>Chat</a>
                    </div>
                    <div className="one">
                        <a onClick={()=>{ if (localStorage.getItem("user")!== null){navigate("/ip")}}}>Ips</a>
                    </div>
                 
                    </div>
                </div>
               <div className="one"></div>
                    <div className="float-right">
                 {localStorage.getItem("user")==null? <><button className="btn button-dark float-right" onClick={()=>{navigate("/")}}>SignUp</button>&nbsp;<button className="btn btn-dark  float-left" onClick={()=>{navigate("/login")}}>Login</button></>  :<button className="btn btn-dark float-right" onClick={()=>{localStorage.clear(); navigate("/login")}}>logout</button>}  

                 
                </div>
            </div>
        </div>
    )
}