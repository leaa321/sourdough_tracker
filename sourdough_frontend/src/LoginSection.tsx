import { useState } from "react"
import { signIn } from "./service/LoafService";
import { useNavigate } from "react-router-dom";

export function LoginSection() {
    const [password, setPassword] = useState<string>("");
    const [email, setEmail] = useState<string>("")
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (formValue) => {
        formValue.preventDefault();
        setError("");

        try {
            await signIn(email, password);
            navigate("/admin");
        } catch (err) {
            setError("Login fehlgeschlagen");
            console.error(err);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="input-group">
                <span>Email:</span>
                <input
                    type="email"
                    name="email"
                    placeholder="type something..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className="input-group">
                <span>Password:</span>
                <input
                    type="text"
                    name="password"
                    placeholder="type something..."
                    value={password}
                    onChange={(p) => setPassword(p.target.value)}
                />
            </div>
            <button type="submit">Login</button>

            {error && <p>{error}</p>}
        </form>
    )
}