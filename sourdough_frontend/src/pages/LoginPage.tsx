import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signIn } from "../service/UserService";
import { ToastMessage, useToast } from "../components/ToastMessage";
import { Header } from "../components/Header";
import "../style/LoginPage.scss"

type LoginPageProps = {
  onLogin: () => void;
};

export function LoginPage({ onLogin }: LoginPageProps) {
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const { visible, message, showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (
    formValue,
  ) => {
    formValue.preventDefault();

    try {
      await signIn(email, password);
      onLogin();
      navigate("/admin");
    } catch (err) {
      showToast("Login fehlgeschlagen");
      console.error(err);
    }
  };

  return (
    <>
      <Header></Header>

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
            type="password"
            name="password"
            placeholder="type something..."
            value={password}
            onChange={(p) => setPassword(p.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>

      <ToastMessage visible={visible} message={message}></ToastMessage>
    </>
  );
}
