
import { useEffect, useState } from "react"
import Nav from "../components/Nav"
import { useNavigate } from "react-router"
import { PiBirdThin } from "react-icons/pi";
import { Toaster, toast } from 'alert';


export default function Signup() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const navigate = useNavigate()
    useEffect(() => {
        if (localStorage.getItem("user") !== null) {
            navigate("/ip")
        }
    })
    const submit = () => {
        const res = window.electron.ipcRenderer.sendSync("signup", { username: username, password: password, email: email })
        if (res == true) {
            toast.success("Registration succeeded")
            navigate("/login")
        } else {
            toast.success("internal server error")
        }
    }

    const handleUsername = (e) => {
        setUsername(e.target.value)
    }
    const handlePassword = (e) => {
        setPassword(e.target.value)
    }
    const handleEmail = (e) => {
        setEmail(e.target.value)
    }
    return (<>      <div className="container">
        <Nav />
        <Toaster position='top-center' />
        <br />

        <div className="container">
            <center>
                <br />
                <h2>Welcome to ChatOffline <PiBirdThin /></h2>
                <p>Do you know that you can send files to other devices in the same network without having access to the internet?</p>
                <strong>All you need is a router </strong>
            </center>
            <br />
            <br />
            <div className="container second-color ">
                <br />
                <h4>Start by creating an account</h4>
                <div className="box">
                    <div className="one">
                        <label className="form-label mt-4">Your Username</label>
                        <input className="form-control" placeholder="Username" onChange={handleUsername} />
                    </div>
                    <div className="one">
                        <label className="form-label mt-4">Your Email</label>
                        <input className="form-control" placeholder="Email" onChange={handleEmail} />
                    </div>
                </div>
                <div className="row">
                    <div className="column">
                        <label className="form-label mt-4">Your password</label>
                        <input className="form-control" placeholder="password" type="password" onChange={handlePassword} />
                    </div>

                </div>
                <br />
                <button className="btn btn-dark" onClick={submit}>SignUp</button>
<br/><br/>
            </div>
        </div>
    </div>             <div className="fifth-color" id='footer' >This app is made by Louai Zaiter in 2025.</div></>
    )
}