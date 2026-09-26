/**
 * Phone number formatters for international readability and WhatsApp links
 */

export function formatDisplayPhone(phone: string): string {
  if (!phone) return '';
  const digits = phone.replace(/[^0-9]/g, '');
  if (digits === '6288973641682') {
    return '+62 889-7364-1682';
  }
  if (digits === '628818210415') {
    return '+62 881-8210-415';
  }
  return phone;
}

export function getRawWhatsAppNumber(phone: string): string {
  if (!phone) return '';
  return phone.replace(/[^0-9]/g, '');
}
