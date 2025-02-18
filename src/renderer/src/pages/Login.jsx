import Nav from "../components/Nav"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { PiBirdThin } from "react-icons/pi";
import { Toaster, toast } from 'alert';

export default function Login(){
        const [username, setUsername] = useState("")
        const [password, setPassword]= useState("");
        const navigate = useNavigate()
        useEffect(()=>{
            if (localStorage.getItem("user")!==null){
                navigate("/ip")
            }
        })
        const submit = ()=>{
            const res =  window.electron.ipcRenderer.sendSync("login", {username: username, password: password})
            if (res !=false){
              //alert("Login succeeded")
              //console.log(res.id)
              toast.success('Login succeeded')
              localStorage.setItem("user", res.id)
              navigate("/send")  
          }else{
              //alert("Please check your credentials ...")
          }
          }
        const handleUsername= (e)=>{
            setUsername(e.target.value)
        }
        const handlePassword= (e)=>{
            setPassword(e.target.value)
        }
    return(
        <div className="container">
        <Nav />
        <Toaster position='top-center'/>

        <div className="container">
            <center>
                <br/>
            <h2>Welcome to The Offline Sender <PiBirdThin/></h2>
            <p>Do you know that you can send files to other devices in the same network without having access to the internet?</p>
            <strong>All you need is a router </strong>
            </center>
            <br/>
        <div className="container second-color">
            <h4>Login Now!</h4>
            <div className="row">
                <div className="column">
                    <label>Your Username</label>
                    <input placeholder="Username" onChange={handleUsername} />

                    <label>Your password</label>
                    <input placeholder="Password" type="password" onChange={handlePassword} />
                </div>
            </div>
            <button className="button button-light" onClick={submit}>Login</button>
        </div>
        </div>
        </div>
    )
}