
import { useNavigate } from "react-router"
import { useEffect, useState } from "react"
import { PiBirdFill } from "react-icons/pi";

export default function Nav(){
    const navigate = useNavigate()

    return(
        <div className="container">
            <br/>
            <div className="row">
                <div className="column">
                    <h4 className="float-left">
                    ChatOffline  <PiBirdFill/>
                    </h4>
                </div>
                <div className="column">
                    <div className="box">
                    <div className="one">
                        <a onClick={()=>{navigate("/send")}}> File</a>
                    </div>
                    <div className="one">
                        <a onClick={()=>{navigate("/chat")}}>Chat</a>
                    </div>
                    <div className="one">
                        <a onClick={()=>{navigate("/ip")}}>Ips</a>
                    </div>
                 
                    </div>
                </div>
                <div className="column">
                 {localStorage.getItem("user")==null? <><button className="button button-light float-right" onClick={()=>{navigate("/")}}>SignUp</button>&nbsp;<button className="button button-black button-clear float-right" onClick={()=>{navigate("/login")}}>Login</button></>  :<button className="button button-light float-right" onClick={()=>{localStorage.clear(); navigate("/login")}}>logout</button>}  
                </div>
            </div>
        </div>
    )
}