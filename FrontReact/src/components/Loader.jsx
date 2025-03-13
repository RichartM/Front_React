import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="loader">
        <li className="ball" />
        <li className="ball" />
        <li className="ball" />
      </div>
      <p></p>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .loader {
    width: 60px;
    display: flex;
    justify-content: space-evenly;
  }

  .ball {
    list-style: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: #fff;
  }

  .ball:nth-child(1) {
    animation: bounce-1 1s ease-in-out infinite;
  }

  @keyframes bounce-1 {
    50% {
      transform: translateY(-12px);
      background-color: aqua;
    }
  }

  .ball:nth-child(2) {
    animation: bounce-2 1s ease-in-out 0.2s infinite;
  }

  @keyframes bounce-2 {
    50% {
      transform: translateY(-12px);
      background-color: aqua;
    }
  }

  .ball:nth-child(3) {
    animation: bounce-3 1s ease-in-out 0.4s infinite;
  }

  @keyframes bounce-3 {
    50% {
      transform: translateY(-12px);
      background-color: aqua;
    }
  }
`;

export default Loader;
