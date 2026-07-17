import React, { useState, createContext, useContext } from 'react';

// User Context
type User = {
  name: string;
  email: string;
  initials: string;
} | null;

type UserContextType = {
  user: User;
  setUser: (user: User) => void;
  logout: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

// Custom hook to use user context
const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

function App() {
  const [page, setPage] = useState('home');
  const [user, setUser] = useState<User>(null);

  const logout = () => {
    setUser(null);
    setPage('home');
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
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
            <button 
              style={page === 'wallet' ? { ...styles.navButton, ...styles.navActive } : styles.navButton}
              onClick={() => setPage('wallet')}
            >
              Wallet
            </button>
          </nav>

          {/* Dynamic User Initials */}
          <div style={styles.userSection}>
            {user ? (
              <div style={styles.userInfo}>
                <div style={styles.userInitials}>
                  {user.initials}
                </div>
                <span style={styles.userName}>{user.name}</span>
                <button style={styles.logoutButton} onClick={logout}>
                  Logout
                </button>
              </div>
            ) : (
              <div style={styles.tmCircle}>?</div>
            )}
          </div>
        </header>

        {/* Pages */}
        {page === 'home' && <HomePage setPage={setPage} />}
        {page === 'login' && <LoginPage setPage={setPage} />}
        {page === 'register' && <RegisterPage setPage={setPage} />}
        {page === 'wallet' && <WalletPage setPage={setPage} />}

        {/* Footer */}
        <footer style={styles.footer}>
          © 2026 City of Tshwane — Digital Bus Ticketing System
        </footer>
      </div>
    </UserContext.Provider>
  );
}

// Home Page Component
function HomePage({ setPage }: { setPage: (page: string) => void }) {
  const [balance] = useState(125.00);
  const { user } = useUser();

  return (
    <div style={styles.homeContent}>
      {/* Welcome Message */}
      <div style={styles.welcomeBanner}>
        <h2 style={styles.welcomeText}>
          {user ? `Welcome back, ${user.name}! 👋` : 'Welcome to TshwaneRide!'}
        </h2>
        {user && (
          <p style={styles.welcomeSubtext}>
            Your city, one tap away.
          </p>
        )}
      </div>

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
        <div style={styles.serviceCard} onClick={() => setPage('wallet')}>
          <div style={styles.icon}></div>
          <h3 style={styles.serviceTitle}>Buy a Ticket</h3>
          <p style={styles.serviceDesc}>Choose a route and pay.</p>
        </div>
        <div style={styles.serviceCard} onClick={() => setPage('wallet')}>
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
            <h2 style={styles.walletAmount}>R{balance.toFixed(2)}</h2>
            <button style={styles.walletButton} onClick={() => setPage('wallet')}>
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
  const { setUser } = useUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Please fill in all fields');
      return;
    }

    // Simulate login - create user from email
    const name = email.split('@')[0] || 'User';
    const initials = name
      .split(/[._-]/)
      .map(word => word[0].toUpperCase())
      .join('')
      .slice(0, 2);

    setUser({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      email: email,
      initials: initials || 'U'
    });

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
  const { setUser } = useUser();

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

    // Get user initials from name
    const initials = name
      .split(' ')
      .map(word => word[0].toUpperCase())
      .join('')
      .slice(0, 2);

    // Auto-login after registration
    setUser({
      name: name,
      email: email,
      initials: initials || 'U'
    });

    alert('Registration Successful! Welcome to TshwaneRide!');
    setPage('home');
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

// Wallet Page Component
function WalletPage({ setPage }: { setPage: (page: string) => void }) {
  const [balance, setBalance] = useState(128.00);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [showSuccess, setShowSuccess] = useState(false);
  const { user } = useUser();

  const presetAmounts = [50, 100, 200, 500];

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomAmount(value);
    setSelectedAmount(null);
  };

  const getTotalAmount = (): number => {
    if (selectedAmount) return selectedAmount;
    if (customAmount) return parseFloat(customAmount) || 0;
    return 0;
  };

  const handleTopUp = () => {
    const amount = getTotalAmount();
    if (amount <= 0) {
      alert('Please select or enter an amount');
      return;
    }

    setShowSuccess(true);
    setBalance(balance + amount);
    
    setTimeout(() => {
      setShowSuccess(false);
      setSelectedAmount(null);
      setCustomAmount('');
    }, 3000);
  };

  return (
    <div style={styles.walletPage}>
      <div style={styles.walletContainer}>
        <h1 style={styles.walletPageTitle}>Top Up Wallet</h1>
        <p style={styles.walletPageSubtitle}>
          {user ? `Welcome, ${user.name}!` : 'Add funds so you\'re always ready to board.'}
        </p>

        <div style={styles.currentBalance}>
          <span style={styles.currentBalanceLabel}>Current balance</span>
          <h2 style={styles.currentBalanceAmount}>R{balance.toFixed(2)}</h2>
        </div>

        <div style={styles.amountSection}>
          <h3 style={styles.amountTitle}>Select amount</h3>
          <div style={styles.amountGrid}>
            {presetAmounts.map((amount) => (
              <button
                key={amount}
                style={{
                  ...styles.amountButton,
                  ...(selectedAmount === amount ? styles.amountButtonSelected : {})
                }}
                onClick={() => handleAmountSelect(amount)}
              >
                R{amount}
              </button>
            ))}
          </div>
          
          <div style={styles.customAmountContainer}>
            <span style={styles.customAmountLabel}>Or enter a custom amount</span>
            <div style={styles.customAmountInputWrapper}>
              <span style={styles.currencySymbol}>R</span>
              <input
                type="number"
                placeholder="0.00"
                style={styles.customAmountInput}
                value={customAmount}
                onChange={handleCustomAmountChange}
                min="0"
                step="1"
              />
            </div>
          </div>
        </div>

        <div style={styles.paymentSection}>
          <h3 style={styles.paymentTitle}>Payment method</h3>
          
          <div style={styles.paymentOptions}>
            <div 
              style={{
                ...styles.paymentOption,
                ...(paymentMethod === 'card' ? styles.paymentOptionSelected : {})
              }}
              onClick={() => setPaymentMethod('card')}
            >
              <div style={styles.paymentIcon}>💳</div>
              <div>
                <div style={styles.paymentName}>Debit / Credit Card</div>
                <div style={styles.paymentDesc}>Visa, Mastercard</div>
              </div>
              {paymentMethod === 'card' && <div style={styles.checkMark}>✓</div>}
            </div>

            <div 
              style={{
                ...styles.paymentOption,
                ...(paymentMethod === 'eft' ? styles.paymentOptionSelected : {})
              }}
              onClick={() => setPaymentMethod('eft')}
            >
              <div style={styles.paymentIcon}>🏦</div>
              <div>
                <div style={styles.paymentName}>Instant EFT</div>
                <div style={styles.paymentDesc}>Pay via your bank app</div>
              </div>
              {paymentMethod === 'eft' && <div style={styles.checkMark}>✓</div>}
            </div>

            <div 
              style={{
                ...styles.paymentOption,
                ...(paymentMethod === 'cash' ? styles.paymentOptionSelected : {})
              }}
              onClick={() => setPaymentMethod('cash')}
            >
              <div style={styles.paymentIcon}>🏪</div>
              <div>
                <div style={styles.paymentName}>Cash at Kiosk</div>
                <div style={styles.paymentDesc}>Top up at a bus depot</div>
              </div>
              {paymentMethod === 'cash' && <div style={styles.checkMark}>✓</div>}
            </div>
          </div>
        </div>

        <div style={styles.summarySection}>
          <div style={styles.summaryRow}>
            <span style={styles.summaryLabel}>Amount to add</span>
            <span style={styles.summaryValue}>
              R{getTotalAmount().toFixed(2)}
            </span>
          </div>
          <div style={styles.summaryRow}>
            <span style={styles.summaryLabel}>Payment method</span>
            <span style={styles.summaryValue}>
              {paymentMethod === 'card' ? 'Card' : paymentMethod === 'eft' ? 'EFT' : 'Cash'}
            </span>
          </div>
          <div style={styles.summaryRow}>
            <span style={styles.summaryLabel}>New balance</span>
            <span style={styles.summaryValueHighlight}>
              R{(balance + getTotalAmount()).toFixed(2)}
            </span>
          </div>
        </div>

        {showSuccess && (
          <div style={styles.successMessage}>
            <span style={styles.successIcon}>✅</span>
            <div>
              <div style={styles.successTitle}>Top up successful!</div>
              <div style={styles.successDesc}>
                R{getTotalAmount().toFixed(2)} added to your wallet
              </div>
            </div>
          </div>
        )}

        <button 
          style={styles.topUpButton} 
          onClick={handleTopUp}
          disabled={getTotalAmount() === 0}
        >
          Top Up Now
        </button>

        <button style={styles.backToHomeButton} onClick={() => setPage('home')}>
          ← Back to Home
        </button>
      </div>
    </div>
  );
}

// All styles
const styles: { [key: string]: React.CSSProperties } = {
  app: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#eceef2',
    fontFamily: 'Arial, Helvetica, sans-serif',
  },
  
  navbar: {
    background: 'white',
    padding: '20px 40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #ddd',
  },
  logoSection: {
    display: 'flex',
    alignItems: 'center',
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
  userSection: {
    display: 'flex',
    alignItems: 'center',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  userInitials: {
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    background: '#7dcf56',
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
    fontSize: '16px',
  },
  userName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1a1a1a',
  },
  logoutButton: {
    background: 'none',
    border: '1px solid #e2e8f0',
    padding: '6px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
    color: '#5d6677',
  },
  tmCircle: {
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    background: '#7dcf56',
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
    fontSize: '18px',
  },
  welcomeBanner: {
    padding: '20px 50px 10px 50px',
    background: 'transparent',
  },
  welcomeText: {
    fontSize: '24px',
    color: '#1a1a1a',
    marginBottom: '5px',
  },
  welcomeSubtext: {
    fontSize: '14px',
    color: '#718096',
  },
  hero: {
    background: '#5bb53b',
    minHeight: '250px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    justifyContent: 'space-between',
    alignItems: 'center',
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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  qrBox: {
    width: '70px',
    height: '70px',
    border: '2px solid #333',
    borderRadius: '10px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
  },
  fare: {
    textAlign: 'right',
  },
  fareLabel: {
    color: '#738195',
    fontSize: '14px',
  },
  fareAmount: {
    marginTop: '5px',
  },
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
    justifyContent: 'space-between',
    padding: '15px 0',
    borderBottom: '1px solid #e2e8f0',
  },
  routeTime: {
    color: '#2e7d32',
  },
  rightColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
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
  authPage: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
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
    flexDirection: 'column',
  },
  authInput: {
    width: '100%',
    padding: '12px 15px',
    marginBottom: '15px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    boxSizing: 'border-box',
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
    textAlign: 'center',
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
  walletPage: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px 20px',
    background: '#f4f5f8',
  },
  walletContainer: {
    background: 'white',
    maxWidth: '600px',
    width: '100%',
    padding: '40px',
    borderRadius: '15px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  walletPageTitle: {
    marginBottom: '5px',
    color: '#1a1a1a',
    fontSize: '28px',
  },
  walletPageSubtitle: {
    color: '#718096',
    marginBottom: '25px',
  },
  currentBalance: {
    background: '#5bb53b',
    color: 'white',
    borderRadius: '10px',
    padding: '20px',
    marginBottom: '25px',
    textAlign: 'center',
  },
  currentBalanceLabel: {
    fontSize: '14px',
    display: 'block',
  },
  currentBalanceAmount: {
    margin: '10px 0 0',
    fontSize: '36px',
  },
  amountSection: {
    marginBottom: '25px',
  },
  amountTitle: {
    marginBottom: '15px',
    fontSize: '18px',
    color: '#1a1a1a',
  },
  amountGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '10px',
    marginBottom: '15px',
  },
  amountButton: {
    padding: '12px',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    background: 'white',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'all 0.3s',
  },
  amountButtonSelected: {
    borderColor: '#58b338',
    background: '#e8f5e9',
    color: '#2e7d32',
  },
  customAmountContainer: {
    marginTop: '10px',
  },
  customAmountLabel: {
    display: 'block',
    fontSize: '14px',
    color: '#718096',
    marginBottom: '8px',
  },
  customAmountInputWrapper: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '0 15px',
    background: 'white',
  },
  currencySymbol: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginRight: '10px',
  },
  customAmountInput: {
    flex: 1,
    padding: '12px 0',
    border: 'none',
    fontSize: '16px',
    outline: 'none',
    background: 'transparent',
  },
  paymentSection: {
    marginBottom: '25px',
  },
  paymentTitle: {
    marginBottom: '15px',
    fontSize: '18px',
    color: '#1a1a1a',
  },
  paymentOptions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  paymentOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '15px',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    position: 'relative',
  },
  paymentOptionSelected: {
    borderColor: '#58b338',
    background: '#f0f7f0',
  },
  paymentIcon: {
    fontSize: '24px',
  },
  paymentName: {
    fontWeight: 'bold',
    fontSize: '14px',
  },
  paymentDesc: {
    fontSize: '12px',
    color: '#718096',
  },
  checkMark: {
    position: 'absolute',
    right: '15px',
    color: '#58b338',
    fontWeight: 'bold',
    fontSize: '18px',
  },
  summarySection: {
    background: '#f8f9fa',
    borderRadius: '10px',
    padding: '20px',
    marginBottom: '20px',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid #e2e8f0',
  },
  summaryLabel: {
    color: '#718096',
  },
  summaryValue: {
    fontWeight: 'bold',
  },
  summaryValueHighlight: {
    fontWeight: 'bold',
    color: '#2e7d32',
    fontSize: '18px',
  },
  topUpButton: {
    width: '100%',
    padding: '14px',
    background: '#58b338',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background 0.3s',
  },
  backToHomeButton: {
    width: '100%',
    padding: '12px',
    background: 'transparent',
    color: '#2e7d32',
    border: '1px solid #2e7d32',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  successMessage: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    background: '#e8f5e9',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '15px',
    border: '1px solid #c8e6c9',
  },
  successIcon: {
    fontSize: '24px',
  },
  successTitle: {
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  successDesc: {
    color: '#388e3c',
    fontSize: '14px',
  },
  footer: {
    background: '#2e7d32',
    color: 'white',
    textAlign: 'center',
    padding: '15px',
    fontSize: '14px',
    marginTop: 'auto',
  },
};

export default App; 