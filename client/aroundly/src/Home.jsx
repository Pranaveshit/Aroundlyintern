import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Home() {
    const [success, setSuccess] = useState();
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.get('http://localhost:3001/home')
            .then(res => {
                if (res.data === "Successy") {
                    setSuccess("Succeeded");
                } else {
                    navigate('/dashboard');
                }
            })
            .catch(err => {
                console.log(err);
                navigate('/login');
            });
    }, []);

    return (
        <div>Other Users</div>
    );
}

export default Home;