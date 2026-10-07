import React from 'react'

const Home = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F7FAF9",
      }}
    >
     <div style={{ textAlign: "center" }}>
     <h1
        style={{
            color: "2F7D6D",
            fontSize: "3rem",
            marginBottom: "8px",
        }}
     >
        PawBuddy
     </h1>

     <p style={{ color: "#667570" }}>
        Helping pets find their forever homes.
     </p>
    </div>
   </div>
    
  );
};

export default Home;
