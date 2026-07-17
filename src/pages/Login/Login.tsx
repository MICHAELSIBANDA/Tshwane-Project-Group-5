import { useState } from "react";

type LoginProps = {
  setCurrentPage: (
    page: string
  ) => void;
};

function Login({
  setCurrentPage,
}: LoginProps) {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const handleLogin = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Fill all fields");
      return;
    }

    alert("Login Successful");
  };

  return (
    <div>

      <h1>Login</h1>

      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
        />

        <button type="submit">
          Login
        </button>
      </form>

      <p>
        No account?
      </p>

      <button
        onClick={() =>
          setCurrentPage(
            "register"
          )
        }
      >
        Register
      </button>

      <button
        onClick={() =>
          setCurrentPage("home")
        }
      >
        Home
      </button>

    </div>
  );
}

export default Login;