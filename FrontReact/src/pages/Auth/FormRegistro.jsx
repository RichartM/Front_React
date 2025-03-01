import React, { useState } from "react";
import styled from "styled-components";
import Swal from "sweetalert2";
import AuthServiceRegister from '../../services/AuthServiceRegister';

const FormRegistro = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    secondName: "",
    firstSurname: "",
    secondSurname: "",
    phone: "",
    email: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const clienteData = {
            name: formData.firstName,
            surname: formData.secondName,
            lastname: formData.firstSurname,
            username: formData.email, // ✅ Usamos el email como username
            email: formData.email,
            password: formData.firstName, // ✅ La contraseña será el nombre
        };

        await AuthServiceRegister.registerCliente(clienteData);

        Swal.fire({
            title: "Registro Exitoso",
            text: "Se ha registrado correctamente el cliente. Su contraseña es su nombre.",
            icon: "success",
            confirmButtonColor: "#018180",
        }).then(() => {
            setFormData({
                firstName: "",
                secondName: "",
                firstSurname: "",
                secondSurname: "",
                phone: "",
                email: "",
            });
        });
    } catch (error) {
        console.error("Error en el registro:", error);
        Swal.fire({
            title: "Error",
            text: "No se pudo completar el registro. Inténtalo de nuevo.",
            icon: "error",
            confirmButtonColor: "#d33",
        });
    }
  };

  return (
    <StyledWrapper>
      <form className="form" onSubmit={handleSubmit}>
        <p className="title">Registrate</p>
        <p className="message">¡Tú auto está a un click!</p>
        <div className="flex">
          <label>
            <input
              required
              type="text"
              className="input"
              placeholder=" "
              id="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
            <span>Primer nombre</span>
          </label>
          <label>
            <input
              required
              type="text"
              className="input"
              placeholder=" "
              id="secondName"
              value={formData.secondName}
              onChange={handleChange}
            />
            <span>Segundo nombre</span>
          </label>
        </div>
        <div className="flex">
          <label>
            <input
              required
              type="text"
              className="input"
              placeholder=" "
              id="firstSurname"
              value={formData.firstSurname}
              onChange={handleChange}
            />
            <span>Primer apellido</span>
          </label>
          <label>
            <input
              required
              type="text"
              className="input"
              placeholder=" "
              id="secondSurname"
              value={formData.secondSurname}
              onChange={handleChange}
            />
            <span>Segundo apellido</span>
          </label>
        </div>
        <label>
          <input
            required
            type="phone"
            className="input"
            placeholder=" "
            id="phone"
            value={formData.phone}
            onChange={handleChange}
          />
          <span>Teléfono</span>
        </label>
        <label>
          <input
            required
            type="email"
            className="input"
            placeholder=" "
            id="email"
            value={formData.email}
            onChange={handleChange}
          />
          <span>Email</span>
        </label>
        <button className="submit" type="submit">
          Registrar
        </button>
        <p className="signin">
          Ya tienes cuenta? <a href="/login">Iniciar sesión</a>
        </p>
      </form>
    </StyledWrapper>
  );
};



const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;

  .form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-width: 350px;
    background-color: #fff;
    padding: 20px;
    border-radius: 20px;
    position: relative;
    box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px;
  }

  .title {
    font-size: 28px;
    color: #018180;
    font-weight: 600;
    letter-spacing: -1px;
    padding-left: 30px;
    position: relative;
    display: flex;
    align-items: center;
  }

  .title::before,
  .title::after {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    border-radius: 50%;
    left: 0;
    background-color: #018180;
  }

  .title::before {
    width: 18px;
    height: 18px;
    background-color: #018180;
  }

  .title::after {
    width: 18px;
    height: 18px;
    animation: pulse 1s linear infinite;
  }

  .message,
  .signin {
    color: black;
    font-size: 14px;
  }

  .signin {
    text-align: center;
  }

  .signin a {
    color: #018180;
    cursor: pointer;
    text-decoration: underline;
  }

  .flex {
    display: flex;
    gap: 6px;
    width: 100%;
  }

  .form label {
    position: relative;
  }

  .form label .input {
    width: 100%;
    padding: 10px 10px 20px 10px;
    outline: none;
    border: 1px solid rgba(105, 105, 105, 0.397);
    border-radius: 10px;
    background-color: #fff; /* Fondo blanco */
    color: black;           /* Texto negro */
  }

  .form label .input::placeholder {
    color: rgba(0, 0, 0, 0.5);
  }

  .form label .input + span {
    position: absolute;
    left: 10px;
    top: 15px;
    color: #018180;  /* Span en #018180 */
    font-size: 0.9em;
    cursor: text;
    transition: 0.3s ease;
  }

  .form label .input:placeholder-shown + span {
    top: 15px;
    font-size: 0.9em;
  }

  .form label .input:focus + span,
  .form label .input:valid + span {
    top: 30px;
    font-size: 0.7em;
    font-weight: 600;
  }

  .form label .input:valid + span {
    color: green;
  }

  .submit {
    border: none;
    outline: none;
    background-color: #018180;
    padding: 10px;
    border-radius: 10px;
    color: white;
    font-size: 16px;
    transition: 0.3s ease;
    cursor: pointer;
  }

  .submit:hover {
    background-color: #026c6c;
  }

  @keyframes pulse {
    from {
      transform: scale(0.9);
      opacity: 1;
    }
    to {
      transform: scale(1.8);
      opacity: 0;
    }
  }
`;

export default FormRegistro;
