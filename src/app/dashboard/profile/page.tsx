"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { getUserProfile, updateUserProfile, deleteUserAccount } from "@/lib/api/profile";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader as DialogH, DialogTitle as DialogT, DialogFooter as DialogF } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { toast } from 'sonner';
import { BODY_TYPES, COUNTRIES, STYLE_OPTIONS, SHOPPING_BEHAVIOUR, SHOPPING_FREQUENCY, type BodyType, type Country, type StyleOption, type ShoppingBehaviour, type ShoppingFrequency } from '@/lib/constants';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface ProfileForm {
  full_name: string;
  date_of_birth: string;
  city: string;
  country: Country;
  nationality: Country;
  body_type: BodyType;
  body_notes: string;
  style_preferences: StyleOption[];
  shopping_behaviour: ShoppingBehaviour;
  shopping_frequency: ShoppingFrequency;
}

interface User {
  id: string;
  email: string;
}

interface ValidationErrors {
  full_name?: string;
  date_of_birth?: string;
  city?: string;
}

interface Profile {
  id: string
  full_name: string
  date_of_birth: string | null
  city: string
  country: string
  nationality: string
  body_type: string
  body_notes: string
  style_preferences: string[]
  shopping_behaviour: string
  shopping_frequency: string
  created_at?: string
  last_login?: string
}

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [form, setForm] = useState<ProfileForm>({
    full_name: '',
    date_of_birth: '',
    city: '',
    country: 'India',
    nationality: 'India',
    body_type: 'Straight',
    body_notes: '',
    style_preferences: [],
    shopping_behaviour: 'Online',
    shopping_frequency: 'Monthly',
  });
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [updateError, setUpdateError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/profile')
        if (!response.ok) {
          if (response.status === 401) {
            router.push('/signin')
            return
          }
          throw new Error('Failed to fetch profile')
        }
        const data = await response.json()
        setProfile(data)
        setForm({
          full_name: data.full_name || '',
          date_of_birth: data.date_of_birth || '',
          city: data.city || '',
          country: data.country || 'India',
          nationality: data.nationality || 'India',
          body_type: data.body_type || 'Straight',
          body_notes: data.body_notes || '',
          style_preferences: data.style_preferences || [],
          shopping_behaviour: data.shopping_behaviour || 'Online',
          shopping_frequency: data.shopping_frequency || 'Monthly',
        });
      } catch (err) {
        setUpdateError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [router])

  const handleChange = (field: keyof ProfileForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    // Clear validation error when field is updated
    if (validationErrors[field as keyof ValidationErrors]) {
      setValidationErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleMultiSelect = (option: StyleOption) => {
    setForm(prev => ({
      ...prev,
      style_preferences: prev.style_preferences.includes(option)
        ? prev.style_preferences.filter(item => item !== option)
        : [...prev.style_preferences, option]
    }));
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    let isValid = true;

    if (!form.full_name.trim()) {
      errors.full_name = 'Full name is required.';
      isValid = false;
    }

    if (!form.date_of_birth) {
      errors.date_of_birth = 'Date of birth is required.';
      isValid = false;
    }

    if (!form.city.trim()) {
      errors.city = 'City is required.';
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleSave = async () => {
    setSaving(true);
    setUpdateError(null);
    const currentUser = user as User | null;
    if (!currentUser?.email) {
      toast.error('You must be logged in to update your profile');
      setSaving(false);
      return;
    }

    if (!validateForm()) {
      setSaving(false);
      setUpdateError('Please fill in all required fields.');
      return;
    }

    try {
      const updatedForm = {
        ...form,
        style_preferences: form.style_preferences || [],
      };
      await updateUserProfile(currentUser.id, updatedForm);
      setSaving(false);
      router.refresh();
      toast.success('Profile updated successfully');
    } catch (e: any) {
      setSaving(false);
      setUpdateError('Failed to save changes. Please try again.');
      toast.error('Failed to update profile');
    }
  };

  const handleDelete = async () => {
    const currentUser = user as User | null;
    if (!currentUser?.email) {
      toast.error('You must be logged in to delete your account');
      return;
    }
    try {
      await deleteUserAccount(currentUser.id);
      await signOut();
      router.push("/signin");
    } catch (e: any) {
      toast.error('Failed to delete account');
    }
  };

  const currentUser = user as User | null;
  if (!currentUser?.email) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Please sign in to view your profile</p>
      </div>
    );
  }

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
  if (!profile) return <div className="flex justify-center items-center h-64">Profile not found.</div>;

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-400">My Profile</h1>
      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-10">
        {/* Account Section */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-xl font-semibold mb-2">Account</h2>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
              <Input id="email" value={currentUser.email} readOnly disabled />
            </div>
            <div>
              <label htmlFor="created-at" className="block text-sm font-medium mb-1">Created At</label>
              <Input id="created-at" value={profile?.created_at ? String(new Date(profile.created_at).toLocaleString()) : ''} readOnly disabled />
            </div>
            <div>
              <label htmlFor="last-login" className="block text-sm font-medium mb-1">Last Login</label>
              <Input id="last-login" value={profile?.last_login ? String(new Date(profile.last_login).toLocaleString()) : ''} readOnly disabled />
            </div>
          </CardContent>
        </Card>

        {/* Personal Details */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-xl font-semibold mb-2">Personal Details</h2>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="full-name" className="block text-sm font-medium mb-1">Full Name <span className="text-red-500">*</span></label>
              <Input id="full-name" value={form.full_name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('full_name', e.target.value)} required={true} />
              {validationErrors.full_name && <p className="text-xs text-red-500 mt-1">{validationErrors.full_name}</p>}
            </div>
            <div>
              <label htmlFor="date-of-birth" className="block text-sm font-medium mb-1">Date of Birth <span className="text-red-500">*</span></label>
              <Input id="date-of-birth" type="date" value={form.date_of_birth} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('date_of_birth', e.target.value)} required={true} />
              {validationErrors.date_of_birth && <p className="text-xs text-red-500 mt-1">{validationErrors.date_of_birth}</p>}
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium mb-1">City <span className="text-red-500">*</span></label>
              <Input id="city" value={form.city} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('city', e.target.value)} required={true} />
              {validationErrors.city && <p className="text-xs text-red-500 mt-1">{validationErrors.city}</p>}
            </div>
            <div>
              <label htmlFor="country" className="block text-sm font-medium mb-1">Country</label>
              <Select value={form.country} onValueChange={(v: Country) => handleChange('country', v)}>
                <SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((country: Country) => <SelectItem key={country} value={country}>{country}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="nationality" className="block text-sm font-medium mb-1">Nationality</label>
              <Select value={form.nationality} onValueChange={(v: Country) => handleChange('nationality', v)}>
                <SelectTrigger><SelectValue placeholder="Select nationality" /></SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((country: Country) => <SelectItem key={country} value={country}>{country}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Body Profile */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-xl font-semibold mb-2">Body Profile</h2>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="body-type" className="block text-sm font-medium mb-1">Body Type</label>
              <Select value={form.body_type} onValueChange={(v: BodyType) => handleChange('body_type', v)}>
                <SelectTrigger><SelectValue placeholder="Select body type" /></SelectTrigger>
                <SelectContent>
                  {BODY_TYPES.map((type: BodyType) => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="body-notes" className="block text-sm font-medium mb-1">Body Notes</label>
              <textarea 
                id="body-notes" 
                className="p-2 rounded border bg-white text-gray-900 w-full min-h-[48px]" 
                value={form.body_notes} 
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange('body_notes', e.target.value)} 
                placeholder="e.g. short torso & long legs, broad shoulders..." 
              />
            </div>
          </CardContent>
        </Card>

        {/* Style Preferences */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-xl font-semibold mb-2">Style Preferences</h2>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {STYLE_OPTIONS.map((option: StyleOption) => (
                <button
                  type="button"
                  key={option}
                  aria-pressed={form.style_preferences.includes(option)}
                  className={`px-3 py-1 rounded-full border ${form.style_preferences.includes(option) ? 'bg-purple-500 text-white border-purple-600' : 'bg-gray-100 text-gray-700 border-gray-300'} transition`}
                  onClick={() => handleMultiSelect(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Shopping Behaviour */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-xl font-semibold mb-2">Shopping Behaviour</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="shopping-behaviour" className="block text-sm font-medium mb-1">Shopping Preference</label>
              <Select value={form.shopping_behaviour} onValueChange={(v: ShoppingBehaviour) => handleChange('shopping_behaviour', v)}>
                <SelectTrigger><SelectValue placeholder="Select shopping preference" /></SelectTrigger>
                <SelectContent>
                  {SHOPPING_BEHAVIOUR.map((behaviour: ShoppingBehaviour) => <SelectItem key={behaviour} value={behaviour}>{behaviour}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="shopping-frequency" className="block text-sm font-medium mb-1">Shopping Frequency</label>
              <div className="flex flex-wrap gap-4">
                {SHOPPING_FREQUENCY.map((frequency: ShoppingFrequency) => (
                  <label key={frequency} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="shopping-frequency"
                      value={frequency}
                      checked={form.shopping_frequency === frequency}
                      onChange={(e) => handleChange('shopping_frequency', e.target.value)}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{frequency}</span>
                  </label>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button type="button" variant="destructive" onClick={() => setShowDelete(true)}>
            Delete Account
          </Button>
        </div>
        {updateError && <div className="text-red-600 text-sm mt-2" role="alert">{updateError}</div>}
      </form>

      {/* Delete Account Dialog */}
      <Dialog open={showDelete} onOpenChange={setShowDelete}>
        <DialogContent>
          <DialogH>
            <DialogT>Delete Account</DialogT>
          </DialogH>
          <p className="text-sm text-gray-600 mb-4">
            Are you sure you want to delete your account? This action cannot be undone.
          </p>
          <DialogF>
            <Button variant="outline" onClick={() => setShowDelete(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Confirm</Button>
          </DialogF>
        </DialogContent>
      </Dialog>
    </div>
  );
} 