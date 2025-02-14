import React, { useState, ChangeEvent } from 'react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import DatePicker from '@/Components/DatePicker';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogCancel,
} from '@/Components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import axios from 'axios';
import { Districts } from '@/Constants/District';
import { log } from 'console';
interface PatientFormData {
  hospital_id: string;
  name: string;
  gender: string;
  dob: string;
  address: string;
  city: string;
  district: string;
  state: string;
  pin_code: string;
  phone: string;
}

interface ValidationErrors {
  [key: string]: string;
}

interface CreateNewPatientProps {
  onPatientCreated?: (patient: {
    patientId:number;
    hospital_id: string;
    name: string;
    phone: string;
    address: string;
    district: string;
  }) => void;
}

const initialFormData: PatientFormData = {
  hospital_id: '',
  name: '',
  gender: '',
  dob: '',
  address: '',
  city: '',
  district: '',
  state: '',
  pin_code: '',
  phone: '',
};
const HOSPITAL_ID_REGEX = /^(WS|PN|PS|MG)\d+$/i;

const CreateNewPatient: React.FC<CreateNewPatientProps> = ({ onPatientCreated }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formData, setFormData] = useState<PatientFormData>(initialFormData);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showCustomDistrict, setShowCustomDistrict] = useState<boolean>(false);
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Hospital ID validation
    if (!formData.hospital_id.trim()) {
        newErrors.hospital_id = 'Hospital ID is required';
      } else if (!HOSPITAL_ID_REGEX.test(formData.hospital_id.toUpperCase())) {
        newErrors.hospital_id = 'Hospital ID must start with WS, PN, PS, or MG followed by numbers';
      }


    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Gender validation
    if (!formData.gender) {
      newErrors.gender = 'Please select a gender';
    }

    // Date of Birth validation
    // if (!formData.dob) {
    //   newErrors.dob = 'Date of Birth is required';
    // } else {
    //   const dobDate = new Date(formData.dob);
    //   const today = new Date();
    //   if (dobDate > today) {
    //     newErrors.dob = 'Date of Birth cannot be in the future';
    //   }
    // }

    // Address validation
    // if (!formData.address.trim()) {
    //   newErrors.address = 'Address is required';
    // }

    // City validation
    // if (!formData.city.trim()) {
    //   newErrors.city = 'City is required';
    // }

    // District validation
    if (!formData.district.trim()) {
      newErrors.district = 'District is required';
    }

    // State validation
    // if (!formData.state.trim()) {
    //   newErrors.state = 'State is required';
    // }

    // PIN Code validation
    // if (!formData.pin_code.trim()) {
    //   newErrors.pin_code = 'PIN Code is required';
    // } else if (!/^\d{6}$/.test(formData.pin_code)) {
    //   newErrors.pin_code = 'PIN Code must be 6 digits';
    // }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    // Clear error when user starts typing
    if (errors[id]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const handleGenderChange = (value: string): void => {
    setFormData(prev => ({
      ...prev,
      gender: value
    }));
    if (errors.gender) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.gender;
        return newErrors;
      });
    }
  };

  const handleDistrictChange = (value: string): void => {
    if (value === 'other') {
      setShowCustomDistrict(true);
      setFormData(prev => ({
        ...prev,
        district: ''
      }));
    } else {
      setShowCustomDistrict(false);
      setFormData(prev => ({
        ...prev,
        district: value
      }));
    }

    if (errors.district) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.district;
        return newErrors;
      });
    }
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await axios.post(route('patient.store'), formData);
        console.log(response);

      if (response.data.status === true) {
        onPatientCreated?.({
            patientId:response.data.patient.id,
            hospital_id: formData.hospital_id,
            name: formData.name,
            phone: formData.phone,
            address: formData.address,
            district: formData.district
        });

        setIsOpen(false);
        setFormData(initialFormData);
        setErrors({});
      } else {
        // Handle API validation errors
        if (response.data.errors) {
          setErrors(response.data.errors);
        }
      }
    } catch (error: any) {
      // Handle axios error responses
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({
          general: 'An error occurred while creating the patient'
        });
      }
      console.error('Error creating patient:', error);
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleCustomDistrictChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setFormData(prev => ({
      ...prev,
      district: e.target.value
    }));
    if (errors.district) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.district;
        return newErrors;
      });
    }
  };
  const formatDate = (date: Date): string => {
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${year}/${month}/${day}`;
  };
  const handleDateChange = (date: Date | undefined) => {
    // Convert the Date object to a string format your backend expects
    // Assuming your backend expects "YYYY-MM-DD" format
    const formattedDate = date ? formatDate(date) : '';

    setFormData(prev => ({
        ...prev,
        dob: formattedDate
      }));

};
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          className="bg-primary text-white hover:bg-primary/90"
        >
          Create New Patient
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Create New Patient</AlertDialogTitle>
          <AlertDialogDescription>
            Fill in the patient details below.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {errors.general && (
          <div className="mb-4 p-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
            {errors.general}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 py-4">
          <div>
            <Label htmlFor="hospital_id">Hospital ID</Label>
            <Input
              id="hospital_id"
              value={formData.hospital_id}
              onChange={(e)=>{
                setFormData(prev => ({
                    ...prev,
                    hospital_id: e.target.value.toUpperCase()
                  }));
              }}
              className={`mt-1 ${errors.hospital_id ? 'border-red-500' : ''}`}
            />
            {errors.hospital_id && (
              <p className="mt-1 text-xs text-red-500">{errors.hospital_id}</p>
            )}
          </div>

          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={handleChange}
              className={`mt-1 ${errors.name ? 'border-red-500' : ''}`}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name}</p>
            )}
          </div>

          <div>
            <Label htmlFor="gender">Gender</Label>
            <Select
              onValueChange={handleGenderChange}
              value={formData.gender}
            >
              <SelectTrigger className={`mt-1 ${errors.gender ? 'border-red-500' : ''}`}>
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && (
              <p className="mt-1 text-xs text-red-500">{errors.gender}</p>
            )}
          </div>

          <div>
            <Label htmlFor="dob">Date of Birth</Label>
            <DatePicker
                value={formData.dob ? new Date(formData.dob) : undefined}
                onChange={handleDateChange}
                allowPastDates = {true}
                disableNavigation={false}
                minDate={new Date(1940, 0, 1)}
                maxDate={new Date()}
            />
            {errors.dob && (
              <p className="mt-1 text-xs text-red-500">{errors.dob}</p>
            )}
          </div>

          <div className="col-span-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={handleChange}
              className={`mt-1 ${errors.address ? 'border-red-500' : ''}`}
            />
            {errors.address && (
              <p className="mt-1 text-xs text-red-500">{errors.address}</p>
            )}
          </div>

          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={handleChange}
              className={`mt-1 ${errors.city ? 'border-red-500' : ''}`}
            />
            {errors.city && (
              <p className="mt-1 text-xs text-red-500">{errors.city}</p>
            )}
          </div>

          <div>
            <Label htmlFor="district">District</Label>
            <Select
              onValueChange={handleDistrictChange}
              value={showCustomDistrict ? 'other' : formData.district}
            >
              <SelectTrigger className={`mt-1 ${errors.district ? 'border-red-500' : ''}`}>
                <SelectValue placeholder="Select District" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(Districts).map(([key, value]) => (
                  <SelectItem key={key} value={value}>
                    {value}
                  </SelectItem>
                ))}
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {showCustomDistrict && (
              <Input
                id="custom-district"
                value={formData.district}
                onChange={handleCustomDistrictChange}
                placeholder="Enter district name"
                className="mt-2"
              />
            )}
            {errors.district && (
              <p className="mt-1 text-xs text-red-500">{errors.district}</p>
            )}
          </div>

          <div>
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              value={formData.state}
              onChange={handleChange}
              className={`mt-1 ${errors.state ? 'border-red-500' : ''}`}
            />
            {errors.state && (
              <p className="mt-1 text-xs text-red-500">{errors.state}</p>
            )}
          </div>

          <div>
            <Label htmlFor="pin_code">PIN Code</Label>
            <Input
              id="pin_code"
              value={formData.pin_code}
              onChange={handleChange}
              pattern="[0-9]*"
              maxLength={6}
              className={`mt-1 ${errors.pin_code ? 'border-red-500' : ''}`}
            />
            {errors.pin_code && (
              <p className="mt-1 text-xs text-red-500">{errors.pin_code}</p>
            )}
          </div>

          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              pattern="[0-9]*"
              maxLength={10}
              className={`mt-1 ${errors.phone ? 'border-red-500' : ''}`}
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
            )}
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-primary text-white hover:bg-primary/90"
          >
            {isSubmitting ? 'Creating...' : 'Create Patient'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CreateNewPatient;
