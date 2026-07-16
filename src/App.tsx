import "./App.css";
import { useState } from "react";

function App(){
  const [selectedRoute, setSelectedRoute] = useState({
  id: "A12",
  from: "Hatfield",
  to: "CBD",
  price: 15.00,
});
  return(
    <>
    <div className="screen">
    
    <header>
      <div className="logo">
        <img 
      src="https://tse1.mm.bing.net/th/id/OIP.vD44cEQql4FEUz-84jstTgHaEK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3" 
      alt="Tshwane" 
    />
        <h2>TshwaneRide</h2>
      </div>
      <nav>
        <a href="#">Home</a>
        <a href="#" className="active">Buy Ticket</a>
        <a href="#">Bus Schedule</a>
        <a href="#">Top Up Wallet</a>
        <a href="#">Track Ride</a>
        <a href="#">Support</a>
      </nav>

      <div className="profileIcon">
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="18" cy="18" r="18" fill="#00843D"/>
      <circle cx="18" cy="14" r="6" fill="white"/>
      <path d="M8 30C8 24 12 20 18 20C24 20 28 24 28 30" fill="white"/>
    </svg>
  </div>
    </header>
    
    <div className="buyTicketHeading">
      <h1>Buy a ticket</h1>
      <p>Pick a route, choose your fare, and pay securely.</p>
    </div>
    
    <div className="searchBoxArea">
      <input type="text" placeholder="Search for a route e.g Hatfield to CBD"/>
    </div>
    
    <div className="routesSummary">
    
      <div className="routesSection">
      
        <div className={`route ${selectedRoute.id === "A12" ? "selected" : ""}`} onClick={() => setSelectedRoute({
      id: "A12",
      from: "Hatfield",
      to: "CBD",
      price: 15.00,
    })
  }
>
          <div className="routeRadio"></div>
          <div className="routeInfo">
            <h3>Route A12 — Hatfield ↔ CBD</h3>
            <p><span className="routeDot"></span>12 stops • Every 15 min</p>
          </div>
          <p className="routePrice">R15.00</p>
        </div>
        
        <div
  className={`route ${selectedRoute.id === "B04" ? "selected" : ""}`}
  onClick={() =>
    setSelectedRoute({
      id: "B04",
      from: "Sunnyside",
      to: "Menlyn",
      price: 18.50,
    })
  }
>
          <div className="routeRadio"></div>
          <div className="routeInfo">
            <h3>Route B04 — Sunnyside ↔ Menlyn</h3>
            <p><span className="routeDot"></span>9 stops • Every 20 min</p>
          </div>
          <p className="routePrice">R18.50</p>
        </div>
        
        <div
            className={`route ${selectedRoute.id === "C21" ? "selected" : ""}`}
            onClick={() =>
              setSelectedRoute({
                id: "C21",
                from: "Centurion",
                to: "Pretoria North",
                price: 22.00,
              })
            }
          >
          <div className="routeRadio"></div>
          <div className="routeInfo">
            <h3>Route C21 — Centurion ↔ Pretoria North</h3>
            <p><span className="routeDot"></span>16 stops • Every 25 min</p>
          </div>
          <p className="routePrice">R22.00</p>
        </div>
        
        <div
            className={`route ${selectedRoute.id === "D07" ? "selected" : ""}`}
            onClick={() =>
              setSelectedRoute({
                id: "D07",
                from: "Mamelodi",
                to: "CBD",
                price: 19.00,
              })
            }
          >
          <div className="routeRadio"></div>
          <div className="routeInfo">
            <h3>Route D07 — Mamelodi ↔ CBD</h3>
            <p><span className="routeDot"></span>14 stops • Every 18 min</p>
          </div>
          <p className="routePrice">R19.00</p>
        </div>
        
      </div>
      
      
      <div className="summaryColumn">
        <div className="fareSummary">
          <h2>Fare Summary</h2>
          
          <div className="fareRow">
            <span>Route</span>
            <span>
                 {selectedRoute.id} · {selectedRoute.from} → {selectedRoute.to}
            </span>
          </div>
          
          <div className="fareRow">
            <span>Fare type</span>
            <span>Single trip</span>
          </div>
          
          <div className="fareRow">
            <span>Pay with</span>
            <span className="wallet">Wallet (R128.00)</span>
          </div>
          
          <div className="fareDivider"></div>
          
          <div className="fareTotal">
            <span>Total</span>
            <span>R{selectedRoute.price.toFixed(2)}</span>
          </div>
          
          <button>Confirm &amp; Pay</button>
        </div>
      </div>
      
    </div>
    
    <footer>&copy; 2026 City of Tshwane — Digital Bus Ticketing System</footer>
    </div>
  </>
  );
}

export default App;