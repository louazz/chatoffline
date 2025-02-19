
import { useEffect, useState } from "react"
import Nav from "../components/Nav"
import { useNavigate } from "react-router"
import { PiBirdThin } from "react-icons/pi";
import { Toaster, toast } from 'alert';


export default function Signup (){
    const [username, setUsername] = useState("")
    const [password, setPassword]= useState("")
    const [email, setEmail]= useState("")
    const navigate = useNavigate()
    useEffect(()=>{
        if (localStorage.getItem("user")!== null){
            navigate("/ip")
        }
    })
    const submit = ()=>{
      const res =  window.electron.ipcRenderer.sendSync("signup", {username: username, password: password, email: email})
      if (res == true){
        toast.success("Registration succeeded")
        navigate("/login")  
    }else{
        toast.success("internal server error")
    }
    }

    const handleUsername= (e)=>{
        setUsername(e.target.value)
    }
    const handlePassword= (e)=>{
        setPassword(e.target.value)
    }
    const handleEmail= (e)=>{
        setEmail(e.target.value)
    }
    return(<>      <div className="container">
            <Nav />
            <Toaster position='top-center'/>

            <div className="container">
                <center>
                    <br/>
                <h2>Welcome to The ChatOffline <PiBirdThin/></h2>
                <p>Do you know that you can send files to other devices in the same network without having access to the internet?</p>
                <strong>All you need is a router </strong>
                </center>
                <br/>
                <br/>
            <div className="container second-color">
                <h4>Start by creating an account</h4>
                <div className="row">
                    <div className="column">
                        <label>Your Username</label>
                        <input placeholder="Username" onChange={handleUsername} />
                        </div>
                        <div className="column">
                        <label>Your Email</label>
                        <input placeholder="Email" onChange={handleEmail} />
                    </div>
                </div>
                <div className="row">
                    <div className="column">
                        <label>Your password</label>
                        <input placeholder="password" type="password" onChange={handlePassword} />
                        </div>
                      
                </div>
                <button className="button button-black" onClick={submit}>SignUp</button>
            </div>
            </div>
            </div></>)
}