import React, { useState } from 'react';
import styled from 'styled-components';

const FiltroServicios = ({ onSearch, placeholder }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value); // Pasa el término de búsqueda al componente padre
  };

  return (
    <StyledWrapper>
    <div className="ui-input-container">
        <input
          placeholder={placeholder}
          type="search"
          className="ui-input"
          value={searchTerm}
          onChange={handleSearch}
        />
     <div className="ui-input-underline" />
      <div className="ui-input-highlight" />
      <div className="ui-input-icon">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <path strokeLinejoin="round" strokeLinecap="round" strokeWidth={2} stroke="currentColor" d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" />
        </svg>
      </div>
    </div>
  </StyledWrapper>

  );
};


const StyledWrapper = styled.div`
.ui-input-container {
  position: relative;
  width: 300px;
}

.ui-input {
  width: 100%;
  padding: 10px 10px 10px 40px;
  font-size: 1em;
  border: none;
  border-bottom: 2px solid #ccc;
  outline: none;
  background-color: transparent;
  transition: border-color 0.3s;
  color: black;
}

.ui-input:focus {
  border-color: #018180;
}

.ui-input-underline {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  width: 100%;
  background-color: #018180;
  transform: scaleX(0);
  transition: transform 0.3s;
}

.ui-input:focus + .ui-input-underline {
  transform: scaleX(1);
}

.ui-input-highlight {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 100%;
  width: 0;
  background-color: rgba(55, 102, 116, 0.1);
  transition: width 0.3s;
}

.ui-input:focus ~ .ui-input-highlight {
  width: 100%;
}

.ui-input-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  transition: color 0.3s;
}

.ui-input:focus ~ .ui-input-icon {
  color: #018180;
}

.ui-input-icon svg {
  width: 20px;
  height: 20px;
}`;
export default FiltroServicios;
