
const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const API_URL = 'http://localhost:8080/usuarios';


export const setTokens = (accessToken, refreshToken) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};


export const getAccessToken = () => {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
};


export const logout = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    console.log("Tokens removidos. Usuário deslogado.");
};


export const loginUser = async (email, senha) => {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha }),
        });

        if (!response.ok) {

            const errorData = await response.json();
            throw new Error(errorData.message || 'Falha na autenticação. Verifique suas credenciais.');
        }

        const data = await response.json();


        setTokens(data.accessToken, data.refreshToken);

        return data;
    } catch (error) {
        throw error;
    }
};

