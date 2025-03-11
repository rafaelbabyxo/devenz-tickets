import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full text-center py-4 mt-auto">
      <p>
        By{" "}
        <a href="https://devenz.pt/" target="_blank" rel="noopener noreferrer" className="underline">
          Devenz Studio
        </a>
        {" "}&copy; {currentYear}
      </p>
    </footer>
  );
};

export default Footer;