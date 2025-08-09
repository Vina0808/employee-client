import React from 'react';

function HeroImage() {
  return (
    <div className="container mt-4">
      <img 
        src="https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1350&q=80" 
        alt="Office workspace" 
        className="img-fluid rounded shadow"
      />
      <h2 className="mt-3 text-center">Welcome to Employee Management System</h2>
    </div>
  );
}

export default HeroImage;
