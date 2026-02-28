export type InstrumentType = 'QR-POS' | 'QR-CODE' | 'PAY-LINK' | 'API' | 'RENT';

export type InstrumentStatus = 'active' | 'pending' | 'archive';

export interface IInstrument {
  id: string;
  externalId: string;
  type: InstrumentType;
  title: string;
  date: string;
  status: InstrumentStatus;
}