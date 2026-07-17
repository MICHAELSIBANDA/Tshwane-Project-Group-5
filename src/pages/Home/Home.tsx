import "./Home.css";

type HomeProps = {
  setCurrentPage: (page: string) => void;
};

function Home({ setCurrentPage }: HomeProps) {
  console.log("Home component rendered");

  return (
    <div className="home">

      {/* HEADER */}
      <header className="navbar">

        <div className="logo-section">
          <div className="logo-box"></div>
          <h2>TshwaneRide</h2>
        </div>

        <nav>
          <button className="nav-active" onClick={() => setCurrentPage("home")}>
            Home
          </button>

          <button onClick={() => setCurrentPage("home")}>
            Buy Ticket
          </button>

          <button onClick={() => setCurrentPage("home")}>
            Bus Schedule
          </button>

          <button onClick={() => setCurrentPage("home")}>
            Top Up Wallet
          </button>

          <button onClick={() => setCurrentPage("home")}>
            Track Ride
          </button>

          <button onClick={() => setCurrentPage("login")}>
            Login
          </button>

          <button onClick={() => setCurrentPage("register")}>
            Register
          </button>
        </nav>

        <div className="tm-circle">
          TM
        </div>

      </header>

      {/* HERO */}
      <section className="hero">

        <div className="hero-left">

          <p className="live">
            ● LIVE IN TSHWANE
          </p>

          <h1>
            Skip the queue.
            <br />
            Board with a tap.
          </h1>

          <p className="description">
            Buy your ticket and top up online.
            Board without ever touching a physical card.
          </p>

        </div>

        <div className="hero-card">

          <div className="route-header">
            <span>
              Route A12 · Hatfield → CBD
            </span>

            <div className="active-pill">
              ACTIVE
            </div>
          </div>

          <div className="ticket-info">

            <div className="qr-box">
              QR
            </div>

            <div className="fare">
              <span>Fare</span>
              <h2>R15.00</h2>
            </div>

          </div>

        </div>

      </section>

      {/* SERVICES */}
      <section className="services">

        <div className="service-card" onClick={() => setCurrentPage("home")}>
          <div className="icon"></div>
          <h3>Buy a Ticket</h3>
          <p>Choose a route and pay.</p>
        </div>

        <div className="service-card" onClick={() => setCurrentPage("home")}>
          <div className="icon"></div>
          <h3>Top Up Wallet</h3>
          <p>Add funds in seconds.</p>
        </div>

        <div className="service-card" onClick={() => setCurrentPage("home")}>
          <div className="icon"></div>
          <h3>Track Ride</h3>
          <p>See your bus live.</p>
        </div>

        <div className="service-card" onClick={() => setCurrentPage("home")}>
          <div className="icon"></div>
          <h3>Bus Schedule</h3>
          <p>Check departure times.</p>
        </div>

      </section>

      {/* CONTENT */}
      <section className="content">

        <div className="routes-section">

          <h2>Nearby routes</h2>

          <div className="route">
            <span>Route A12 — Hatfield ↔ CBD</span>
            <strong>4 min</strong>
          </div>

          <div className="route">
            <span>Route B04 — Sunnyside ↔ Menlyn</span>
            <strong>11 min</strong>
          </div>

          <div className="route">
            <span>Route C21 — Centurion ↔ Pretoria North</span>
            <strong>18 min</strong>
          </div>

          <div className="route">
            <span>Route D07 — Mamelodi ↔ CBD</span>
            <strong>22 min</strong>
          </div>

        </div>

        <div className="right-column">

          <div className="wallet-card">

            <span>Wallet balance</span>
            <h2>R125.00</h2>
            <button onClick={() => setCurrentPage("home")}>
              Top up wallet
            </button>

          </div>

          <div className="notification-card">

            <h3>Notifications</h3>
            <p>Route A12 ticket validated at Hatfield Station.</p>
            <span>2 min ago</span>

          </div>

        </div>

      </section>

      <footer>
        © 2026 City of Tshwane — Digital Bus Ticketing System
      </footer>

    </div>
  );
}

export default Home;