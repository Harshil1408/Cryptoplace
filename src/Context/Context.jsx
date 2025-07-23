import { createContext, useEffect, useState } from "react";

export const CoinContext = createContext();

const CoinContextProvider = (props) => {
  const [allCoin, setAllCoin] = useState([]);
  const [currency, setCurrency] = useState({
    name: "usd",
    symbol: "$",
  });

  const fetchAllCoin = async () => {
    // For CoinGecko's Public API, an API key is NOT required for basic endpoints.
    // The 'options' object might not be strictly necessary if only a GET request
    // with no special headers is needed.
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        // Remove the API key header for the public CoinGecko API
        // "x-cg-pro-api-key": "YOUR_API_KEY", // Not needed for public endpoints
      },
    };

    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency.name}`, // Use api.coingecko.com for public access
        options
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAllCoin(data);
    } catch (err) {
      console.error("Error fetching coin data:", err);
      setAllCoin([]);
    }
  };

  useEffect(() => {
    fetchAllCoin();
  }, [currency]);

  const contextValue = {
    allCoin,
    currency,
    setCurrency,
  };

  return (
    <CoinContext.Provider value={contextValue}>
      {props.children}
    </CoinContext.Provider>
  );
};

export default CoinContextProvider;