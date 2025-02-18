import { useEffect, useState } from "react"
import Nav from "../components/Nav"
import { GiHummingbird } from "react-icons/gi";
import { Toaster, toast } from 'alert';
import { useNavigate } from "react-router"
import { io } from "socket.io-client";

export default function Ips(){
    const [ips, setIps]=useState([{ip: "123.123.2.1"}])
    const [ip, setIp]= useState("")
    const [key, setKey]= useState(Math.random())
    const [myIp, setMyIp] = useState(null)
    const [sock, setSock]= useState(null)

    const [checker, setChecker]= useState(true)
    const navigate = useNavigate()
   


    const get_ip =  ()=>{
        const tmp =  window.electron.ipcRenderer.sendSync("myIp")  
        setMyIp(tmp)
    }
    useEffect( ()=>{
        if (localStorage.getItem("user") == undefined || localStorage.getItem("user") == null) {
            navigate("/login")
        }
        if (checker){
        const res =  window.electron.ipcRenderer.sendSync("getIp",{ user: localStorage.getItem("user")})  
        setIps(res)
        get_ip()
        setKey(Math.random())

        setChecker(false)
        }
        window.electronAPI.onIpEvent((event,data) => {
            toast.success(`Recieved a user id: `+ data.targetUser)
            localStorage.setItem("ipUser", data.targetUser)
         })
    }, [myIp])
    const submit = async()=>{

        const res = await  window.electron.ipcRenderer.sendSync("addIp", {ip:ip, users: [localStorage.getItem("user"), localStorage.getItem("ipUser")]})           
        
        console.log(res)
        setIps(res)
        setKey(Math.random())
        toast.success(`${ip} added to the IP address database`)
        setChecker(true)
        


    }
    const load = (item)=>{
        const socket = io(`http://${item.ip}:3000`);         
        socket.emit("ipUser", {targetUser: localStorage.getItem("user")});
    }
    const handleChange= (e)=>{
        setIp(e.target.value)
    }
    return(
        <>
        <div className="container">
            <Nav/>
            <Toaster position='top-center'/>

<div className="container">
 <center>
            
            <h2>Start sending data to other devices now <GiHummingbird/></h2>
            <p>Choose the Ip address carefully and make sure that the other device is connected to the same network</p>
            </center>

            <div className="container second-color" key ={key}>
                <br/>
                <div className="row">
                    <div className="column">
 <h4>Add IP</h4>
                    </div>
                    <div className="column">
                        <p className="float-right">Your IP: {myIp}</p>
                    </div>
                </div>
               
            <div className="row">
                <div className="column column-80">
                    <input placeholder="Enter IP" onChange={handleChange} />
                </div>
                <div className="column">
                    <button className="button button-black" onClick={submit}>Add</button>
                </div>
            </div>
                <h4>Browse IPs (click to use)</h4>
                {ips.map(item =>{return(
                 <div className="container first-color">   <p onClick={async()=>{localStorage.setItem("ip", item.ip); 
                 toast.success(`The receiver ip address has been set to: ${item.ip}`); load(item)}}>{item.ip}</p></div>
                )})}
                <br/>
            </div></div>
        </div>
        </>
    )
}