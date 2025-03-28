import { apiRequest } from './queryClient';

// API utility functions for common operations

// Users
export async function fetchUsers() {
  const response = await apiRequest('GET', '/api/users', undefined);
  return response.json();
}

export async function fetchPendingUsers() {
  const response = await apiRequest('GET', '/api/users/pending', undefined);
  return response.json();
}

export async function approveUser(userId: number) {
  const response = await apiRequest('POST', `/api/users/${userId}/approve`, {});
  return response.json();
}

export async function updateUser(userId: number, userData: any) {
  const response = await apiRequest('PATCH', `/api/users/${userId}`, userData);
  return response.json();
}

// Tickets
export async function fetchTickets() {
  const response = await apiRequest('GET', '/api/tickets', undefined);
  return response.json();
}

export async function fetchUserTickets() {
  const response = await apiRequest('GET', '/api/tickets/my', undefined);
  return response.json();
}

export async function fetchTicketDetails(ticketId: number) {
  const response = await apiRequest('GET', `/api/tickets/${ticketId}`, undefined);
  return response.json();
}

export async function createTicket(ticketData: any) {
  const response = await apiRequest('POST', '/api/tickets', ticketData);
  return response.json();
}

export async function updateTicket(ticketId: number, ticketData: any) {
  const response = await apiRequest('PATCH', `/api/tickets/${ticketId}`, ticketData);
  return response.json();
}

export async function addTicketComment(ticketId: number, comment: string) {
  const response = await apiRequest('POST', `/api/tickets/${ticketId}/comments`, { comment });
  return response.json();
}

export async function fetchTicketStats() {
  const response = await apiRequest('GET', '/api/tickets/stats', undefined);
  return response.json();
}

// App Links
export async function fetchAppLinks() {
  const response = await apiRequest('GET', '/api/app-links', undefined);
  return response.json();
}

// Auth
export async function fetchCurrentUser() {
  const response = await apiRequest('GET', '/api/auth/me', undefined);
  return response.json();
}

export async function loginEmployee(username: string, password: string) {
  const response = await apiRequest('POST', '/api/auth/employee/login', { username, password });
  return response.json();
}

export async function loginCustomer(email: string, password: string) {
  const response = await apiRequest('POST', '/api/auth/customer/login', { email, password });
  return response.json();
}

export async function registerCustomer(userData: any) {
  const response = await apiRequest('POST', '/api/auth/customer/register', userData);
  return response.json();
}

export async function logout() {
  const response = await apiRequest('POST', '/api/auth/logout', {});
  return response.json();
}
