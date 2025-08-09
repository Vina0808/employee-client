import React from 'react';

const Header = () => {
  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
          <img 
            src="/logo.png" 
            alt="Logo" 
            className="h-10 w-10 rounded-full"
          />
          <h1 className="text-2xl font-bold">Employee Management</h1>
        </div>
        <nav>
          <ul className="flex gap-6">
            <li><a href="/" className="hover:text-gray-300">Home</a></li>
            <li><a href="/employees" className="hover:text-gray-300">Employees</a></li>
            <li><a href="/about" className="hover:text-gray-300">About</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
