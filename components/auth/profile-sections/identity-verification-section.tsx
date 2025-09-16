'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Upload,
  FileText,
  Shield,
  HelpCircle,
  AlertCircle,
  CheckCircle,
  Loader2,
  Eye,
  EyeOff,
} from 'lucide-react';
import {
  validatePAN,
  validateGSTIN,
  validateAadhaar,
  validateFile,
  connectToDigiLocker,
  useValidation,
  formatValidationError,
  extractStateFromGSTIN,
} from '@/lib/validation-utils';

interface UserData {
  name: string;
  email: string;
  mobile: string;
  accountType: 'individual' | 'organization';
  companyName?: string;
}

interface IdentityVerificationSectionProps {
  userData: UserData;
  onComplete: () => void;
  onCancel: () => void;
}

export function IdentityVerificationSection({
  userData,
  onComplete,
  onCancel,
}: IdentityVerificationSectionProps) {
  const [formData, setFormData] = useState({
    pan: '',
    aadhaar: '',
    gstin: '',
    companyPan: '',
    verificationMethod: 'digilocker' as 'digilocker' | 'manual',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [warnings, setWarnings] = useState<Record<string, string>>({});
  const [validating, setValidating] = useState<Record<string, boolean>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showAadhaar, setShowAadhaar] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<
    Record<string, File | null>
  >({
    panCard: null,
    aadhaarCard: null,
    gstCertificate: null,
    incorporationCertificate: null,
  });

  const { debounce } = useValidation();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error and warning when user types
    if (errors[field] || warnings[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
      setWarnings(prev => {
        const newWarnings = { ...prev };
        delete newWarnings[field];
        return newWarnings;
      });
    }

    // Debounced validation for real-time feedback
    if (field === 'pan' || field === 'companyPan') {
      debouncedValidatePAN(field, value);
    } else if (field === 'gstin') {
      debouncedValidateGSTIN(value);
    }
  };

  const debouncedValidatePAN = useCallback(
    debounce(async (field: string, value: string) => {
      if (value.length >= 10) {
        setValidating(prev => ({ ...prev, [field]: true }));
        const result = await validatePAN(value, userData.accountType);

        if (result.error) {
          setErrors(prev => ({ ...prev, [field]: result.error! }));
        } else if (result.warning) {
          setWarnings(prev => ({ ...prev, [field]: result.warning! }));
        }

        setValidating(prev => ({ ...prev, [field]: false }));
      }
    }, 1000),
    [userData.accountType]
  );

  const debouncedValidateGSTIN = useCallback(
    debounce(async (value: string) => {
      if (value.length >= 15) {
        setValidating(prev => ({ ...prev, gstin: true }));
        const result = await validateGSTIN(value);

        if (result.error) {
          setErrors(prev => ({ ...prev, gstin: result.error! }));
        } else if (result.warning) {
          setWarnings(prev => ({ ...prev, gstin: result.warning! }));
        }

        setValidating(prev => ({ ...prev, gstin: false }));
      }
    }, 1000),
    []
  );

  const handleBlur = async (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    await validateField(field, formData[field as keyof typeof formData]);
  };

  const validateField = async (field: string, value: string) => {
    let result: { isValid: boolean; error?: string; warning?: string } = {
      isValid: true,
    };

    switch (field) {
      case 'pan':
      case 'companyPan':
        if (value) {
          result = await validatePAN(value, userData.accountType);
        } else if (
          userData.accountType === 'individual' ||
          field === 'companyPan'
        ) {
          result = { isValid: false, error: 'PAN is required' };
        }
        break;

      case 'aadhaar':
        if (
          userData.accountType === 'individual' &&
          formData.verificationMethod === 'manual'
        ) {
          if (value) {
            result = validateAadhaar(value);
          } else {
            result = { isValid: false, error: 'Aadhaar number is required' };
          }
        }
        break;

      case 'gstin':
        if (userData.accountType === 'organization') {
          if (value) {
            result = await validateGSTIN(value);
          } else {
            result = { isValid: false, error: 'GSTIN is required' };
          }
        }
        break;
    }

    if (result.error) {
      setErrors(prev => ({ ...prev, [field]: result.error! }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }

    if (result.warning) {
      setWarnings(prev => ({ ...prev, [field]: result.warning! }));
    } else {
      setWarnings(prev => {
        const newWarnings = { ...prev };
        delete newWarnings[field];
        return newWarnings;
      });
    }

    return result.isValid;
  };

  const handleFileUpload = (field: string, file: File | null) => {
    const result = validateFile(file, {
      required: true,
      maxSize: 5,
      allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
    });

    if (result.error) {
      setErrors(prev => ({ ...prev, [field]: result.error! }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
      setUploadedFiles(prev => ({ ...prev, [field]: file }));
    }
  };

  const validateForm = async () => {
    const allTouched: Record<string, boolean> = {};
    Object.keys(formData).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    let isValid = true;

    if (userData.accountType === 'individual') {
      if (!(await validateField('pan', formData.pan))) {
        isValid = false;
      }

      if (formData.verificationMethod === 'manual') {
        if (!(await validateField('aadhaar', formData.aadhaar))) {
          isValid = false;
        }

        // Check required file uploads
        const panFileResult = validateFile(uploadedFiles.panCard, {
          required: true,
        });
        if (!panFileResult.isValid) {
          setErrors(prev => ({ ...prev, panCard: panFileResult.error! }));
          isValid = false;
        }

        const aadhaarFileResult = validateFile(uploadedFiles.aadhaarCard, {
          required: true,
        });
        if (!aadhaarFileResult.isValid) {
          setErrors(prev => ({
            ...prev,
            aadhaarCard: aadhaarFileResult.error!,
          }));
          isValid = false;
        }
      }
    } else {
      // Organization validation
      if (!(await validateField('gstin', formData.gstin))) {
        isValid = false;
      }
      if (!(await validateField('companyPan', formData.companyPan))) {
        isValid = false;
      }

      // Check required file uploads for organization
      const gstFileResult = validateFile(uploadedFiles.gstCertificate, {
        required: true,
      });
      if (!gstFileResult.isValid) {
        setErrors(prev => ({ ...prev, gstCertificate: gstFileResult.error! }));
        isValid = false;
      }

      const incorporationFileResult = validateFile(
        uploadedFiles.incorporationCertificate,
        { required: true }
      );
      if (!incorporationFileResult.isValid) {
        setErrors(prev => ({
          ...prev,
          incorporationCertificate: incorporationFileResult.error!,
        }));
        isValid = false;
      }
    }

    return isValid;
  };

  const handleSubmit = async () => {
    if (!(await validateForm())) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      onComplete();
    } catch (error) {
      console.error('Error submitting identity verification:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDigiLockerVerification = async () => {
    setIsLoading(true);

    try {
      const response = await connectToDigiLocker();

      if (response.success && response.verified) {
        // Auto-populate form data
        setFormData(prev => ({
          ...prev,
          pan: response.userData.panNumber,
          // Aadhaar is already masked for security
        }));

        onComplete();
      }
    } catch (error) {
      console.error('Error with DigiLocker verification:', error);
      setErrors(prev => ({
        ...prev,
        digilocker:
          'DigiLocker verification failed. Please try manual verification.',
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const EnhancedFileUploadField = ({
    field,
    label,
    accept = 'image/*,.pdf',
    description,
  }: {
    field: string;
    label: string;
    accept?: string;
    description?: string;
  }) => {
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === 'dragenter' || e.type === 'dragover') {
        setDragActive(true);
      } else if (e.type === 'dragleave') {
        setDragActive(false);
      }
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileUpload(field, e.dataTransfer.files[0]);
      }
    };

    return (
      <div>
        <Label className='block text-sm font-medium text-gray-700 mb-2'>
          {label} <span className='text-red-500'>*</span>
        </Label>
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive
              ? 'border-blue-400 bg-blue-50'
              : uploadedFiles[field]
                ? 'border-green-300 bg-green-50'
                : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload
            className={`mx-auto h-8 w-8 mb-2 ${
              uploadedFiles[field] ? 'text-green-600' : 'text-gray-400'
            }`}
          />
          <div className='text-sm text-gray-600 mb-2'>
            {uploadedFiles[field]
              ? `✓ ${uploadedFiles[field]!.name}`
              : 'Click to upload or drag and drop'}
          </div>
          {description && (
            <div className='text-xs text-gray-500 mb-2'>{description}</div>
          )}
          <div className='text-xs text-gray-500 mb-3'>
            Supported: PDF, JPG, PNG • Max size: 5MB
          </div>
          <input
            type='file'
            accept={accept}
            onChange={e => handleFileUpload(field, e.target.files?.[0] || null)}
            className='hidden'
            id={field}
          />
          <Button
            variant='outline'
            onClick={() => document.getElementById(field)?.click()}
            className='text-sm'
          >
            {uploadedFiles[field] ? 'Change File' : 'Choose File'}
          </Button>
        </div>
        {errors[field] && (
          <div className='flex items-center gap-2 text-red-500 text-sm mt-1'>
            <AlertCircle className='h-4 w-4' />
            <span>{errors[field]}</span>
          </div>
        )}
      </div>
    );
  };

  const FormInput = ({
    field,
    label,
    type = 'text',
    placeholder,
    maxLength,
    showToggle = false,
  }: {
    field: string;
    label: string;
    type?: string;
    placeholder?: string;
    maxLength?: number;
    showToggle?: boolean;
  }) => (
    <div>
      <Label className='block text-sm font-medium text-gray-700 mb-2'>
        {label} <span className='text-red-500'>*</span>
      </Label>
      <div className='relative'>
        <Input
          type={showToggle && !showAadhaar ? 'password' : type}
          value={formData[field as keyof typeof formData]}
          onChange={e => handleInputChange(field, e.target.value.toUpperCase())}
          onBlur={() => handleBlur(field)}
          placeholder={placeholder}
          maxLength={maxLength}
          className={`${
            errors[field]
              ? 'border-red-300 bg-red-50'
              : warnings[field]
                ? 'border-amber-300 bg-amber-50'
                : touched[field] && !errors[field] && !warnings[field]
                  ? 'border-green-300 bg-green-50'
                  : ''
          }`}
        />
        {showToggle && (
          <Button
            type='button'
            variant='ghost'
            size='sm'
            className='absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0'
            onClick={() => setShowAadhaar(!showAadhaar)}
          >
            {showAadhaar ? (
              <EyeOff className='h-4 w-4' />
            ) : (
              <Eye className='h-4 w-4' />
            )}
          </Button>
        )}
        {validating[field] && (
          <div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
            <Loader2 className='h-4 w-4 animate-spin text-blue-600' />
          </div>
        )}
      </div>
      {errors[field] && (
        <div className='flex items-center gap-2 text-red-500 text-sm mt-1'>
          <AlertCircle className='h-4 w-4' />
          <span>{errors[field]}</span>
        </div>
      )}
      {warnings[field] && !errors[field] && (
        <div className='flex items-center gap-2 text-amber-600 text-sm mt-1'>
          <AlertCircle className='h-4 w-4' />
          <span>{warnings[field]}</span>
        </div>
      )}
      {touched[field] &&
        !errors[field] &&
        !warnings[field] &&
        formData[field as keyof typeof formData] && (
          <div className='flex items-center gap-2 text-green-600 text-sm mt-1'>
            <CheckCircle className='h-4 w-4' />
            <span>Verified</span>
          </div>
        )}

      {/* Special helper text for GSTIN */}
      {field === 'gstin' && formData.gstin && formData.gstin.length >= 2 && (
        <div className='text-xs text-gray-500 mt-1'>
          State: {extractStateFromGSTIN(formData.gstin) || 'Invalid state code'}
        </div>
      )}
    </div>
  );

  return (
    <div className='min-h-screen bg-gray-50 p-4'>
      <div className='max-w-2xl mx-auto'>
        <Card>
          <CardHeader>
            <CardTitle className='text-xl'>Identity Verification</CardTitle>
            <p className='text-gray-600'>
              Verify your identity to unlock full access to Krutrim Cloud
              services
            </p>
          </CardHeader>
          <CardContent className='space-y-6'>
            {userData.accountType === 'individual' ? (
              <>
                {/* Verification Method Selection */}
                <div>
                  <Label className='block text-sm font-medium text-gray-700 mb-3'>
                    Choose Verification Method
                  </Label>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <Card
                      className={`cursor-pointer transition-all ${
                        formData.verificationMethod === 'digilocker'
                          ? 'border-primary bg-primary/5'
                          : 'hover:border-gray-300'
                      }`}
                      onClick={() =>
                        handleInputChange('verificationMethod', 'digilocker')
                      }
                    >
                      <CardContent className='p-4'>
                        <div className='flex items-center space-x-3'>
                          <Shield className='h-6 w-6 text-blue-600' />
                          <div>
                            <h4 className='font-semibold'>DigiLocker</h4>
                            <p className='text-sm text-gray-600'>
                              Quick & secure
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card
                      className={`cursor-pointer transition-all ${
                        formData.verificationMethod === 'manual'
                          ? 'border-primary bg-primary/5'
                          : 'hover:border-gray-300'
                      }`}
                      onClick={() =>
                        handleInputChange('verificationMethod', 'manual')
                      }
                    >
                      <CardContent className='p-4'>
                        <div className='flex items-center space-x-3'>
                          <Upload className='h-6 w-6 text-gray-600' />
                          <div>
                            <h4 className='font-semibold'>Manual Upload</h4>
                            <p className='text-sm text-gray-600'>
                              Upload documents
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {formData.verificationMethod === 'digilocker' ? (
                  <div className='text-center py-8 space-y-4'>
                    <Shield className='mx-auto h-16 w-16 text-blue-600' />
                    <h3 className='text-xl font-semibold'>
                      Verify with DigiLocker
                    </h3>
                    <p className='text-gray-600 max-w-md mx-auto'>
                      Connect your DigiLocker account to instantly verify your
                      PAN and Aadhaar details
                    </p>

                    {errors.digilocker && (
                      <div className='flex items-center justify-center gap-2 text-red-500 text-sm'>
                        <AlertCircle className='h-4 w-4' />
                        <span>{errors.digilocker}</span>
                      </div>
                    )}

                    <Button
                      onClick={handleDigiLockerVerification}
                      disabled={isLoading}
                      className='bg-blue-600 hover:bg-blue-700 text-white px-8'
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                          Connecting...
                        </>
                      ) : (
                        'Connect DigiLocker'
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className='space-y-6'>
                    <FormInput
                      field='pan'
                      label='PAN Number'
                      placeholder='ABCDE1234F'
                      maxLength={10}
                    />

                    <FormInput
                      field='aadhaar'
                      label='Aadhaar Number'
                      placeholder='Enter 12-digit Aadhaar number'
                      maxLength={12}
                      showToggle={true}
                    />

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <EnhancedFileUploadField
                        field='panCard'
                        label='PAN Card'
                        description='Clear photo of your PAN card'
                      />

                      <EnhancedFileUploadField
                        field='aadhaarCard'
                        label='Aadhaar Card'
                        description='Clear photo of your Aadhaar card'
                      />
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className='space-y-6'>
                <FormInput
                  field='gstin'
                  label='GSTIN'
                  placeholder='22AAAAA0000A1Z5'
                  maxLength={15}
                />

                <FormInput
                  field='companyPan'
                  label='Company PAN'
                  placeholder='ABCDE1234F'
                  maxLength={10}
                />

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <EnhancedFileUploadField
                    field='gstCertificate'
                    label='GST Certificate'
                    description='Certificate of GST registration'
                  />

                  <EnhancedFileUploadField
                    field='incorporationCertificate'
                    label='Certificate of Incorporation'
                    description='Company incorporation document'
                  />
                </div>
              </div>
            )}

            <div className='flex justify-between pt-4'>
              <Button
                variant='outline'
                onClick={onCancel}
                className='flex items-center gap-2'
              >
                <ArrowLeft className='h-4 w-4' />
                Back to Profile
              </Button>

              {formData.verificationMethod !== 'digilocker' && (
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className='bg-primary hover:bg-primary/90 text-white px-8'
                >
                  {isLoading ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Verifying...
                    </>
                  ) : (
                    'Submit for Verification'
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
