import { useEffect, useMemo, useState } from "react";
import { Building2, Mail, Pencil, Phone, Save, Upload, User, X } from "lucide-react";
import { toast } from "sonner";
import { apiFetch, getApiErrorMessages } from "../api/apiFetch";
import { useAuth } from "../auth/AuthContext";
import { IMAGE_ACCEPT, appendFileIfSelected, validateImageFile } from "../components/imageUpload";
import type { ProfileDetails, ProfileDetailsFormValues } from "../types/profile-details-types";
import FormErrorSummary from "../components/shared/FormErrorSummary";

const emptyForm: ProfileDetailsFormValues = {
  firstName: "",
  surname: "",
  lastName: "",
  companyName: "",
  phoneNumber: "",
  imageFile: null,
};

const toFormValues = (details: ProfileDetails | null): ProfileDetailsFormValues => ({
  firstName: details?.firstName ?? "",
  surname: details?.surname ?? "",
  lastName: details?.lastName ?? "",
  companyName: details?.companyName ?? "",
  phoneNumber: details?.phoneNumber ?? "",
  imageFile: null,
});

const appendNullableText = (formData: FormData, key: string, value: string) => {
  formData.append(key, value.trim());
};

const buildProfileFormData = (userId: string, values: ProfileDetailsFormValues) => {
  const data = new FormData();
  data.append("userId", userId);
  appendNullableText(data, "firstName", values.firstName);
  appendNullableText(data, "surname", values.surname);
  appendNullableText(data, "lastName", values.lastName);
  appendNullableText(data, "companyName", values.companyName);
  appendNullableText(data, "phoneNumber", values.phoneNumber);
  appendFileIfSelected(data, values.imageFile);
  return data;
};

const validateProfileForm = (values: ProfileDetailsFormValues) => {
  const errors: Partial<Record<keyof ProfileDetailsFormValues, string>> = {};
  const validateOptionalText = (key: keyof Omit<ProfileDetailsFormValues, "imageFile">, label: string) => {
    const value = values[key].trim();
    if (value && (value.length < 3 || value.length > 100)) {
      errors[key] = `${label} must be between 3 and 100 characters.`;
    }
  };

  validateOptionalText("firstName", "First name");
  validateOptionalText("surname", "Surname");
  validateOptionalText("lastName", "Last name");
  validateOptionalText("companyName", "Company name");
  validateOptionalText("phoneNumber", "Phone number");

  const imageError = validateImageFile(values.imageFile);
  if (imageError) {
    errors.imageFile = imageError;
  }

  return errors;
};

const Field = ({
  label,
  value,
  editing,
  error,
  onChange,
  autoComplete,
}: {
  label: string;
  value: string;
  editing: boolean;
  error?: string;
  onChange: (value: string) => void;
  autoComplete?: string;
}) => (
  <div>
    <label className="text-xs font-medium text-slate-700">{label}</label>
    <input
      className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:border-slate-400 disabled:bg-slate-50 disabled:text-slate-600 ${
        error ? "border-rose-300" : "border-slate-200"
      }`}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      disabled={!editing}
      autoComplete={autoComplete}
    />
    {error && <div className="mt-1 text-xs text-rose-600">{error}</div>}
  </div>
);

const displayValue = (value: string | null | undefined) => value || "Not set";

const ProfilePage = () => {
  const { user, refresh } = useAuth();
  const [details, setDetails] = useState<ProfileDetails | null>(null);
  const [form, setForm] = useState<ProfileDetailsFormValues>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof ProfileDetailsFormValues, string>>>({});
  const [apiErrors, setApiErrors] = useState<string[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const selectedImagePreview = useMemo(() => {
    if (!form.imageFile) return null;
    return URL.createObjectURL(form.imageFile);
  }, [form.imageFile]);

  const imageSrc = selectedImagePreview ?? details?.profilePictureUrl ?? null;

  useEffect(() => {
    return () => {
      if (selectedImagePreview) {
        URL.revokeObjectURL(selectedImagePreview);
      }
    };
  }, [selectedImagePreview]);

  useEffect(() => {
    if (!user?.id) return;

    const fetchDetails = async () => {
      setIsLoading(true);
      try {
        setLoadError(null);
        const response: ProfileDetails = await apiFetch(`api/user-details/${user.id}`);
        setDetails(response);
        setForm(toFormValues(response));
      } catch (error) {
        setLoadError(getApiErrorMessages(error, "Profile details could not be loaded.")[0]);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchDetails();
  }, [user?.id]);

  const updateField = (key: keyof Omit<ProfileDetailsFormValues, "imageFile">, value: string) => {
    setForm((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => ({ ...previous, [key]: undefined }));
    setApiErrors([]);
  };

  const startEditing = () => {
    setForm(toFormValues(details));
    setErrors({});
    setApiErrors([]);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setForm(toFormValues(details));
    setErrors({});
    setApiErrors([]);
    setIsEditing(false);
  };

  const saveProfile = async () => {
    if (!user?.id) return;

    const nextErrors = validateProfileForm(form);
    setErrors(nextErrors);
    setApiErrors([]);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSaving(true);
    try {
      const response: ProfileDetails = await apiFetch("api/user-details", {
        method: "PUT",
        body: buildProfileFormData(user.id, form),
        showToast: false,
      });

      setDetails(response);
      setForm(toFormValues(response));
      await refresh();
      setIsEditing(false);
      toast.success("Profile details updated.");
    } catch (error) {
      setApiErrors(getApiErrorMessages(error, "Profile details could not be saved."));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Profile</h2>
          <p className="text-sm text-slate-600">Loading your profile details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Profile</h2>
          <p className="text-sm text-slate-600">Manage your personal and company details.</p>
        </div>

        <div className="flex gap-2">
          {isEditing && (
            <button
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              onClick={cancelEditing}
              disabled={isSaving}
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
          )}
          <button
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
            onClick={isEditing ? saveProfile : startEditing}
            disabled={isSaving}
          >
            {isEditing ? <Save className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
            {isEditing ? (isSaving ? "Saving..." : "Save") : "Edit"}
          </button>
        </div>
      </div>

      {loadError && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {loadError}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[320px_1fr]">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100">
              {imageSrc ? (
                <img className="h-full w-full object-cover" src={imageSrc} alt="Profile" />
              ) : (
                <User className="h-12 w-12 text-slate-400" />
              )}
            </div>

            <div className="mt-4">
              <div className="text-base font-semibold text-slate-900">
                {[form.firstName, form.lastName].filter(Boolean).join(" ") || user?.username}
              </div>
              <div className="mt-1 text-sm text-slate-500">{user?.email}</div>
            </div>

            {isEditing && (
              <div className="mt-5 w-full">
                <label className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  <Upload className="h-4 w-4" />
                  Upload photo
                  <input
                    className="hidden"
                    type="file"
                    accept={IMAGE_ACCEPT}
                    onChange={(event) => {
                      const file = event.target.files?.[0] ?? null;
                      const imageError = validateImageFile(file);
                      setErrors((previous) => ({ ...previous, imageFile: imageError ?? undefined }));
                      setForm((previous) => ({ ...previous, imageFile: file }));
                    }}
                  />
                </label>
                {errors.imageFile && <div className="mt-2 text-xs text-rose-600">{errors.imageFile}</div>}
              </div>
            )}
          </div>

          <div className="mt-6 space-y-3 border-t border-slate-100 pt-5 text-sm">
            <div className="flex items-center gap-3 text-slate-600">
              <Mail className="h-4 w-4 text-slate-400" />
              <span className="truncate">{user?.email}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <Phone className="h-4 w-4 text-slate-400" />
              <span>{displayValue(details?.phoneNumber)}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <Building2 className="h-4 w-4 text-slate-400" />
              <span>{displayValue(details?.companyName)}</span>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <FormErrorSummary messages={apiErrors} />
          {apiErrors.length > 0 && <div className="h-4" />}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field
              label="First name"
              value={form.firstName}
              editing={isEditing}
              error={errors.firstName}
              onChange={(value) => updateField("firstName", value)}
              autoComplete="given-name"
            />
            <Field
              label="Surname"
              value={form.surname}
              editing={isEditing}
              error={errors.surname}
              onChange={(value) => updateField("surname", value)}
            />
            <Field
              label="Last name"
              value={form.lastName}
              editing={isEditing}
              error={errors.lastName}
              onChange={(value) => updateField("lastName", value)}
              autoComplete="family-name"
            />
            <Field
              label="Company name"
              value={form.companyName}
              editing={isEditing}
              error={errors.companyName}
              onChange={(value) => updateField("companyName", value)}
              autoComplete="organization"
            />
            <Field
              label="Phone number"
              value={form.phoneNumber}
              editing={isEditing}
              error={errors.phoneNumber}
              onChange={(value) => updateField("phoneNumber", value)}
              autoComplete="tel"
            />
          </div>
        </section>
      </div>
    </div>
  );
}

export default ProfilePage;
