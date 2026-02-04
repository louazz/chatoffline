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
        <>
        <div className="container">
        <Nav />
        <Toaster position='top-center'/>
        <br/>
      
        <div className="container">
            <center>
                <br/>
            <h2>Welcome to ChatOffline <PiBirdThin/></h2>
            <p>Do you know that you can send files to other devices in the same network without having access to the internet?</p>
            <strong>All you need is a router </strong>
            </center>
            <br/>
         
        <div className="container second-color ">
            <br/>
            <h4>Login Now!</h4>
            <div className="row">
                <div className="column">
                    <label className="form-label mt-4">Your Username</label>
                    <input className="form-control" placeholder="Username" onChange={handleUsername} />

                    <label  className="form-label mt-4">Your password</label>
                    <input className='form-control' placeholder="Password" type="password" onChange={handlePassword} />
                </div>
            </div>
            <br/>
         
            <button className="btn btn-dark" onClick={submit}>Login</button>
            <br/><br/>
        </div>
        </div>
   
        </div>
             <div className="fifth-color" id='footer' >This app is made by Louai Zaiter in 2025.</div></>
    )
}