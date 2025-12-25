import { Connection, Contact } from '../types';

export const mapConnectionToContact = (connection: Connection): Contact => ({
  id: connection.userId.toString(),
  name: connection.fullName || connection.username,
  email: connection.email,
  avatar: connection.avatarUrl,
  isFavorite: connection.accepted, // example logic
});
