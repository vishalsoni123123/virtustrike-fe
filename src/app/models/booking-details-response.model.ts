// Booking details response model
export interface BookingDetailResponseModel {
  id: number;
  fullName: string;
  gameName: string;
  slotTime: string[];
  slotDate?: Date | string;
  bookingDate?: Date | string;
  player: number;
  pricePerHour?: number; 
  totalPrice: number;
  centerName: string;
  bookingStatus: 'COMPLETED' | 'CONFIRMED' | 'PENDING';
  paymentStatus?: 'PENDING' | 'COMPLETED' | 'FAILED';
  paymentMethod: string;
  transactionId: string;
  paidAt?: Date | string | null;
}