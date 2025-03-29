import { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const Container = styled.div`
  display: flex;
  height: 100vh;
  align-items: center;
  justify-content: center;
`;

const FormWrapper = styled.form`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

const Title = styled.h2`
  margin-bottom: 1.5rem;
  text-align: center;
`;

const InputGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.25rem;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid ${props => (props.error ? 'red' : '#ccc')};
  border-radius: 8px;
  &:focus {
    border-color: #555;
    outline: none;
  }
`;

const ErrorText = styled.div`
  color: red;
  font-size: 0.85rem;
  margin-top: 0.25rem;
`;

const Button = styled.button`
  width: 100%;
  background: #2d72d9;
  color: white;
  font-size: 1rem;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 1rem;
  &:hover {
    background: #1c5bbf;
  }
`;

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [submitError, setSubmitError] = useState('');
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const errs = {};
        if (!username.trim()) errs.username = 'Username is required';
        else if (username.length < 4) errs.username = 'Username must be at least 4 characters';

        if (!password) errs.password = 'Password is required';
        else if (password.length < 6) errs.password = 'Password must be at least 6 characters';

        return errs;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setSubmitError('');
        const validationErrors = validateForm();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) return;

        try {
            const res = await axios.post(
                '/api/v1/auth/login',
                { username, password },
                { withCredentials: true }
            );

            const { redirectTo } = res.data;
            window.location.href = `/app${redirectTo}`;
        } catch (err) {
            console.error(err);
            setSubmitError(err.response?.data?.error || 'Login failed');
        }
    };

    return (
        <Container>
            <FormWrapper onSubmit={handleLogin}>
                <Title>Login</Title>

                <InputGroup>
                    <Label htmlFor="username">Username</Label>
                    <Input
                        id="username"
                        type="text"
                        value={username}
                        error={errors.username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    {errors.username && <ErrorText>{errors.username}</ErrorText>}
                </InputGroup>

                <InputGroup>
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        error={errors.password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {errors.password && <ErrorText>{errors.password}</ErrorText>}
                </InputGroup>

                <InputGroup>
                    <Button type="submit">Login</Button>
                </InputGroup>
                {submitError && <ErrorText>{submitError}</ErrorText>}
            </FormWrapper>
        </Container>
    );
};

export default Login;
