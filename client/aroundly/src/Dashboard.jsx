import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Dashboard() {
    const [success, setSuccess] = useState();
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.get('http://localhost:3001/dashboard')
            .then(res => {
                if (res.data === "Success") {
                    setSuccess("Succeeded")
                } else {
                    navigate('/home');
                }
            })
            .catch(err => {
                console.log(err);
                navigate('/login');
            });
    }, []);

    return (
        <div>Only for admin</div>
    );
}

export default Dashboard;