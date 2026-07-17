import React, { useState } from 'react';

function App() {
  const [page, setPage] = useState('home');

  return (
    <div style={styles.app}>
      {/* Navigation */}
      <header style={styles.navbar}>
        <div style={styles.logoSection}>
          <div style={styles.logoBox}></div>
          <h2 style={styles.logoText}>TshwaneRide</h2>
        </div>

        <nav style={styles.nav}>
          <button 
            style={page === 'home' ? { ...styles.navButton, ...styles.navActive } : styles.navButton}
            onClick={() => setPage('home')}
          >
            Home
          </button>
          <button 
            style={page === 'login' ? { ...styles.navButton, ...styles.navActive } : styles.navButton}
            onClick={() => setPage('login')}
          >
            Login
          </button>
          <button 
            style={page === 'register' ? { ...styles.navButton, ...styles.navActive } : styles.navButton}
            onClick={() => setPage('register')}
          >
            Register
          </button>
        </nav>

        <div style={styles.tmCircle}>TM</div>
      </header>

      {/* Pages */}
      {page === 'home' && <HomePage setPage={setPage} />}
      {page === 'login' && <LoginPage setPage={setPage} />}
      {page === 'register' && <RegisterPage setPage={setPage} />}

      {/* Footer */}
      <footer style={styles.footer}>
        © 2026 City of Tshwane — Digital Bus Ticketing System
      </footer>
    </div>
  );
}

// Home Page Component
function HomePage({ setPage }: { setPage: (page: string) => void }) {
  return (
    <div style={styles.homeContent}>
      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.heroLeft}>
          <p style={styles.live}>● LIVE IN TSHWANE</p>
          <h1 style={styles.heroTitle}>Skip the queue.<br />Board with a tap.</h1>
          <p style={styles.description}>
            Buy your ticket and top up online. Board without ever touching a physical card.
          </p>
        </div>

        <div style={styles.heroCard}>
          <div style={styles.routeHeader}>
            <span style={styles.routeName}>Route A12 · Hatfield → CBD</span>
            <div style={styles.activePill}>ACTIVE</div>
          </div>
          <div style={styles.ticketInfo}>
            <div style={styles.qrBox}>QR</div>
            <div style={styles.fare}>
              <span style={styles.fareLabel}>Fare</span>
              <h2 style={styles.fareAmount}>R15.00</h2>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section style={styles.services}>
        <div style={styles.serviceCard} onClick={() => setPage('home')}>
          <div style={styles.icon}></div>
          <h3 style={styles.serviceTitle}>Buy a Ticket</h3>
          <p style={styles.serviceDesc}>Choose a route and pay.</p>
        </div>
        <div style={styles.serviceCard} onClick={() => setPage('home')}>
          <div style={styles.icon}></div>
          <h3 style={styles.serviceTitle}>Top Up Wallet</h3>
          <p style={styles.serviceDesc}>Add funds in seconds.</p>
        </div>
        <div style={styles.serviceCard} onClick={() => setPage('home')}>
          <div style={styles.icon}></div>
          <h3 style={styles.serviceTitle}>Track Ride</h3>
          <p style={styles.serviceDesc}>See your bus live.</p>
        </div>
        <div style={styles.serviceCard} onClick={() => setPage('home')}>
          <div style={styles.icon}></div>
          <h3 style={styles.serviceTitle}>Bus Schedule</h3>
          <p style={styles.serviceDesc}>Check departure times.</p>
        </div>
      </section>

      {/* Content */}
      <section style={styles.content}>
        <div style={styles.routesSection}>
          <h2 style={styles.routesTitle}>Nearby routes</h2>
          <div style={styles.route}>
            <span>Route A12 — Hatfield ↔ CBD</span>
            <strong style={styles.routeTime}>4 min</strong>
          </div>
          <div style={styles.route}>
            <span>Route B04 — Sunnyside ↔ Menlyn</span>
            <strong style={styles.routeTime}>11 min</strong>
          </div>
          <div style={styles.route}>
            <span>Route C21 — Centurion ↔ Pretoria North</span>
            <strong style={styles.routeTime}>18 min</strong>
          </div>
          <div style={styles.route}>
            <span>Route D07 — Mamelodi ↔ CBD</span>
            <strong style={styles.routeTime}>22 min</strong>
          </div>
        </div>

        <div style={styles.rightColumn}>
          <div style={styles.walletCard}>
            <span style={styles.walletLabel}>Wallet balance</span>
            <h2 style={styles.walletAmount}>R125.00</h2>
            <button style={styles.walletButton} onClick={() => setPage('home')}>
              Top up wallet
            </button>
          </div>
          <div style={styles.notificationCard}>
            <h3 style={styles.notificationTitle}>Notifications</h3>
            <p style={styles.notificationText}>Route A12 ticket validated at Hatfield Station.</p>
            <span style={styles.notificationTime}>2 min ago</span>
          </div>
        </div>
      </section>
    </div>
  );
}

// Login Page Component
function LoginPage({ setPage }: { setPage: (page: string) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Please fill in all fields');
      return;
    }
    alert('Login Successful!');
    setPage('home');
  };

  return (
    <div style={styles.authPage}>
      <div style={styles.authCard}>
        <h1 style={styles.authTitle}>Welcome Back</h1>
        <p style={styles.authSubtitle}>Log in to manage your tickets and wallet.</p>
        
        <form onSubmit={handleSubmit} style={styles.authForm}>
          <input
            type="text"
            placeholder="Email or phone number"
            style={styles.authInput}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            style={styles.authInput}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" style={styles.authButton}>Log In</button>
        </form>

        <div style={styles.authFooter}>
          <p style={styles.authFooterText}>
            Don't have an account?{' '}
            <span style={styles.authLink} onClick={() => setPage('register')}>Register</span>
          </p>
          <button style={styles.backButton} onClick={() => setPage('home')}>
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

// Register Page Component
function RegisterPage({ setPage }: { setPage: (page: string) => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      alert('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    alert('Registration Successful! Please login.');
    setPage('login');
  };

  return (
    <div style={styles.authPage}>
      <div style={styles.authCard}>
        <h1 style={styles.authTitle}>Create Account</h1>
        <p style={styles.authSubtitle}>It only takes a minute.</p>
        
        <form onSubmit={handleSubmit} style={styles.authForm}>
          <input
            type="text"
            placeholder="Full Name"
            style={styles.authInput}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Email or phone number"
            style={styles.authInput}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Create a password"
            style={styles.authInput}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm password"
            style={styles.authInput}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button type="submit" style={styles.authButton}>Create Account</button>
        </form>

        <div style={styles.authFooter}>
          <p style={styles.authFooterText}>
            Already have an account?{' '}
            <span style={styles.authLink} onClick={() => setPage('login')}>Log In</span>
          </p>
          <button style={styles.backButton} onClick={() => setPage('home')}>
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

// All styles as a JavaScript object
const styles = {
  app: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column' as const,
    backgroundColor: '#eceef2',
    fontFamily: 'Arial, Helvetica, sans-serif',
  },
  
  // Navbar
  navbar: {
    background: 'white',
    padding: '20px 40px',
    display: 'flex',
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    borderBottom: '1px solid #ddd',
  },
  logoSection: {
    display: 'flex',
    alignItems: 'center' as const,
    gap: '12px',
  },
  logoBox: {
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    background: '#5bb53b',
  },
  logoText: {
    fontSize: '28px',
    color: '#1a1a1a',
    margin: 0,
  },
  nav: {
    display: 'flex',
    gap: '35px',
  },
  navButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#5d6677',
    fontSize: '15px',
    padding: '5px 0',
    transition: 'all 0.3s',
  },
  navActive: {
    color: '#2e7d32',
    fontWeight: 'bold',
    borderBottom: '2px solid #e8a53d',
    paddingBottom: '6px',
  },
  tmCircle: {
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    background: '#7dcf56',
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center' as const,
    fontWeight: 'bold',
  },

  // Hero
  hero: {
    background: '#5bb53b',
    minHeight: '250px',
    display: 'flex',
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    padding: '40px 60px',
  },
  heroLeft: {
    color: 'white',
  },
  live: {
    color: '#ffd57d',
    fontWeight: 'bold',
    letterSpacing: '2px',
    marginBottom: '15px',
  },
  heroTitle: {
    fontSize: '58px',
    lineHeight: '1.1',
    marginBottom: '20px',
    color: 'white',
  },
  description: {
    fontSize: '18px',
    maxWidth: '600px',
  },
  heroCard: {
    width: '340px',
    background: '#f8f8f8',
    borderRadius: '14px',
    padding: '20px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
  },
  routeHeader: {
    display: 'flex',
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: '20px',
    fontWeight: 'bold',
  },
  routeName: {
    fontSize: '14px',
  },
  activePill: {
    background: '#d4ebd2',
    color: '#2e7d32',
    padding: '8px 15px',
    borderRadius: '20px',
    fontSize: '13px',
  },
  ticketInfo: {
    display: 'flex',
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  qrBox: {
    width: '70px',
    height: '70px',
    border: '2px solid #333',
    borderRadius: '10px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center' as const,
    fontWeight: 'bold',
  },
  fare: {
    textAlign: 'right' as const,
  },
  fareLabel: {
    color: '#738195',
    fontSize: '14px',
  },
  fareAmount: {
    marginTop: '5px',
  },

  // Services
  services: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
    padding: '20px 50px',
  },
  serviceCard: {
    background: 'white',
    padding: '20px',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: '0.3s',
  },
  icon: {
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    background: '#d9e9cf',
    marginBottom: '20px',
  },
  serviceTitle: {
    marginBottom: '10px',
  },
  serviceDesc: {
    color: '#718096',
    fontSize: '14px',
  },

  // Content
  content: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '25px',
    padding: '0 50px 30px',
  },
  routesSection: {
    background: 'white',
    borderRadius: '10px',
    padding: '20px',
  },
  routesTitle: {
    marginBottom: '20px',
  },
  route: {
    display: 'flex',
    justifyContent: 'space-between' as const,
    padding: '15px 0',
    borderBottom: '1px solid #e2e8f0',
  },
  routeTime: {
    color: '#2e7d32',
  },
  rightColumn: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  },

  // Wallet
  walletCard: {
    background: '#5bb53b',
    color: 'white',
    borderRadius: '10px',
    padding: '20px',
  },
  walletLabel: {
    fontSize: '14px',
  },
  walletAmount: {
    margin: '10px 0 20px',
    fontSize: '42px',
  },
  walletButton: {
    width: '100%',
    border: 'none',
    borderRadius: '8px',
    background: '#f5b436',
    padding: '12px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '16px',
  },

  // Notifications
  notificationCard: {
    background: 'white',
    borderRadius: '10px',
    padding: '20px',
  },
  notificationTitle: {
    marginBottom: '15px',
  },
  notificationText: {
    marginBottom: '8px',
  },
  notificationTime: {
    color: '#718096',
    fontSize: '14px',
  },

  // Auth Pages
  authPage: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center' as const,
    padding: '40px 20px',
    background: '#f4f5f8',
  },
  authCard: {
    background: 'white',
    width: '420px',
    padding: '40px',
    borderRadius: '15px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  authTitle: {
    marginBottom: '5px',
    color: '#1a1a1a',
    fontSize: '28px',
  },
  authSubtitle: {
    color: '#718096',
    marginBottom: '25px',
  },
  authForm: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  authInput: {
    width: '100%',
    padding: '12px 15px',
    marginBottom: '15px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    boxSizing: 'border-box' as const,
  },
  authButton: {
    width: '100%',
    padding: '12px',
    background: '#58b338',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  authFooter: {
    marginTop: '20px',
    textAlign: 'center' as const,
  },
  authFooterText: {
    color: '#718096',
    marginBottom: '10px',
  },
  authLink: {
    color: '#e8a53d',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  backButton: {
    background: 'transparent',
    color: '#2e7d32',
    border: '1px solid #2e7d32',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
  },

  // Footer
  footer: {
    background: '#2e7d32',
    color: 'white',
    textAlign: 'center' as const,
    padding: '15px',
    fontSize: '14px',
    marginTop: 'auto',
  },
};

export default App;