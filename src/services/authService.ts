export const registerUser = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string
) => {
  const response = await fetch(`http://localhost:8082/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ firstName, lastName, email, password, role: 'user' }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Registration failed');
  }

  return await response.text(); // just success message string
};
