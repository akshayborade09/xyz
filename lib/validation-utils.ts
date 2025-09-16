// Enhanced KYC Validation Utilities for CERT-In Compliance

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  warning?: string;
}

// DigiLocker Response Interface
export interface DigiLockerResponse {
  success: boolean;
  userData: {
    name: string;
    address: string;
    dateOfBirth: string;
    aadhaarMasked: string;
    panNumber: string;
  };
  verified: boolean;
  documents: {
    aadhaar: boolean;
    pan: boolean;
  };
}

// Enhanced PAN validation with type checking
export const validatePAN = async (
  pan: string,
  accountType: 'individual' | 'organization'
): Promise<ValidationResult> => {
  // Basic format validation
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

  if (!pan) {
    return { isValid: false, error: 'PAN is required' };
  }

  if (!panRegex.test(pan)) {
    return {
      isValid: false,
      error: 'Please enter a valid PAN format (e.g., ABCDE1234F)',
    };
  }

  // Check if PAN type matches account type
  const fourthChar = pan.charAt(3);
  const isBusinessPAN = [
    'C',
    'P',
    'H',
    'F',
    'A',
    'T',
    'B',
    'L',
    'J',
    'G',
  ].includes(fourthChar);
  const isIndividualPAN = ['P'].includes(fourthChar);

  if (accountType === 'individual' && isBusinessPAN) {
    return {
      isValid: false,
      error:
        'The PAN you entered is not of a Person. Kindly sign up as an Organization.',
    };
  }

  if (accountType === 'organization' && !isBusinessPAN) {
    return {
      isValid: false,
      error:
        'The PAN you entered is not of a Business. Kindly sign up as an Individual.',
    };
  }

  // Simulate API validation
  try {
    await new Promise(resolve => setTimeout(resolve, 500));

    // Simulate occasional API validation warnings
    if (pan.endsWith('Z')) {
      return {
        isValid: true,
        warning:
          'PAN verified, but please ensure this is your current PAN number.',
      };
    }

    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      error:
        'Unable to verify PAN. Please check your internet connection and try again.',
    };
  }
};

// Enhanced GSTIN validation with real-time checks
export const validateGSTIN = async (
  gstin: string
): Promise<ValidationResult> => {
  const gstinRegex =
    /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

  if (!gstin) {
    return { isValid: false, error: 'GSTIN is required' };
  }

  if (!gstinRegex.test(gstin)) {
    return { isValid: false, error: 'Please enter a valid GSTIN format' };
  }

  // Check if state code is valid (first 2 digits)
  const stateCode = gstin.substring(0, 2);
  const validStateCodes = [
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '20',
    '21',
    '22',
    '23',
    '24',
    '25',
    '26',
    '27',
    '28',
    '29',
    '30',
    '31',
    '32',
    '33',
    '34',
    '35',
    '36',
    '37',
    '38',
  ];

  if (!validStateCodes.includes(stateCode)) {
    return { isValid: false, error: 'Invalid state code in GSTIN' };
  }

  // Simulate API validation
  try {
    await new Promise(resolve => setTimeout(resolve, 800));

    // Simulate different validation scenarios
    if (gstin.startsWith('29')) {
      return {
        isValid: true,
        warning:
          'GSTIN verified for Karnataka state. Please ensure this matches your business location.',
      };
    }

    if (gstin.includes('00000')) {
      return {
        isValid: false,
        error:
          'This GSTIN appears to be inactive. Please provide your current active GSTIN.',
      };
    }

    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      error:
        'Unable to verify GSTIN. Please check your internet connection and try again.',
    };
  }
};

// Aadhaar validation
export const validateAadhaar = (aadhaar: string): ValidationResult => {
  if (!aadhaar) {
    return { isValid: false, error: 'Aadhaar number is required' };
  }

  if (!/^\d{12}$/.test(aadhaar)) {
    return {
      isValid: false,
      error: 'Please enter a valid 12-digit Aadhaar number',
    };
  }

  // Basic checksum validation (simplified)
  if (aadhaar === '000000000000' || aadhaar === '111111111111') {
    return { isValid: false, error: 'Please enter a valid Aadhaar number' };
  }

  return { isValid: true };
};

// File validation for document uploads
export const validateFile = (
  file: File | null,
  options: {
    required?: boolean;
    maxSize?: number; // in MB
    allowedTypes?: string[];
  } = {}
): ValidationResult => {
  const {
    required = false,
    maxSize = 5,
    allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
  } = options;

  if (!file) {
    return required
      ? { isValid: false, error: 'File is required' }
      : { isValid: true };
  }

  // Check file size
  const fileSizeInMB = file.size / (1024 * 1024);
  if (fileSizeInMB > maxSize) {
    return {
      isValid: false,
      error: `File size must be less than ${maxSize}MB`,
    };
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    const allowedExtensions = allowedTypes
      .map(type => {
        switch (type) {
          case 'image/jpeg':
            return 'JPG';
          case 'image/jpg':
            return 'JPG';
          case 'image/png':
            return 'PNG';
          case 'application/pdf':
            return 'PDF';
          default:
            return type;
        }
      })
      .join(', ');

    return {
      isValid: false,
      error: `Please upload a valid file. Allowed formats: ${allowedExtensions}`,
    };
  }

  return { isValid: true };
};

// DigiLocker simulation
export const connectToDigiLocker = async (): Promise<DigiLockerResponse> => {
  // Simulate OAuth popup and government authentication
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Simulate successful DigiLocker response
  return {
    success: true,
    userData: {
      name: 'Rakesh Mondal',
      address: '123 Main Street, Koramangala, Bangalore, Karnataka 560034',
      dateOfBirth: '1990-01-15',
      aadhaarMasked: 'XXXX-XXXX-1234',
      panNumber: 'ABCDE1234F',
    },
    verified: true,
    documents: {
      aadhaar: true,
      pan: true,
    },
  };
};

// Real-time validation hook helper
export const useValidation = () => {
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  };

  return { debounce };
};

// Error formatting utilities
export const formatValidationError = (error: string, field: string): string => {
  const fieldLabels: Record<string, string> = {
    pan: 'PAN',
    gstin: 'GSTIN',
    aadhaar: 'Aadhaar',
    companyPan: 'Company PAN',
  };

  const label = fieldLabels[field] || field;
  return error.replace(new RegExp(field, 'gi'), label);
};

// Business logic helpers
export const isBusinessPAN = (pan: string): boolean => {
  const fourthChar = pan.charAt(3);
  return ['C', 'P', 'H', 'F', 'A', 'T', 'B', 'L', 'J', 'G'].includes(
    fourthChar
  );
};

export const extractStateFromGSTIN = (gstin: string): string | null => {
  const stateCodes: Record<string, string> = {
    '01': 'Jammu and Kashmir',
    '02': 'Himachal Pradesh',
    '03': 'Punjab',
    '04': 'Chandigarh',
    '05': 'Uttarakhand',
    '06': 'Haryana',
    '07': 'Delhi',
    '08': 'Rajasthan',
    '09': 'Uttar Pradesh',
    '10': 'Bihar',
    '11': 'Sikkim',
    '12': 'Arunachal Pradesh',
    '13': 'Nagaland',
    '14': 'Manipur',
    '15': 'Mizoram',
    '16': 'Tripura',
    '17': 'Meghalaya',
    '18': 'Assam',
    '19': 'West Bengal',
    '20': 'Jharkhand',
    '21': 'Odisha',
    '22': 'Chhattisgarh',
    '23': 'Madhya Pradesh',
    '24': 'Gujarat',
    '25': 'Daman and Diu',
    '26': 'Dadra and Nagar Haveli',
    '27': 'Maharashtra',
    '28': 'Andhra Pradesh',
    '29': 'Karnataka',
    '30': 'Goa',
    '31': 'Lakshadweep',
    '32': 'Kerala',
    '33': 'Tamil Nadu',
    '34': 'Puducherry',
    '35': 'Andaman and Nicobar Islands',
    '36': 'Telangana',
    '37': 'Andhra Pradesh',
    '38': 'Ladakh',
  };

  if (gstin.length >= 2) {
    const stateCode = gstin.substring(0, 2);
    return stateCodes[stateCode] || null;
  }

  return null;
};
