export interface BillItem {
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes: string | null;
}

export interface BillData {
  merchantName: string | null;
  merchantAddress: string | null;
  billDate: string; 
  billDateTime: string;
  billNumber: string;
  taxId: string | null;
  items: BillItem[];
  subtotal: number;
  tax: number | null;
  discount: number | null;
  serviceCharge: number | null;
  total: number;
  currency: string;
  paymentMethod: string | null;
  rawText: string;
  confidence: number;
}