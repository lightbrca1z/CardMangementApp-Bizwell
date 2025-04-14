import React from 'react';

interface FormData {
  category: string;
  organization: string;
  representative: string;
  phone: string;
  mobile: string;
  fax: string;
  email: string;
  region: string;
  address: string;
  notes: string;
}

interface MasterData {
  id: string;
  name: string;
}

interface FormFieldsProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  categories: MasterData[];
  organizations: MasterData[];
  representatives: MasterData[];
  regions: MasterData[];
}

export default function FormFields({
  formData,
  setFormData,
  categories,
  organizations,
  representatives,
  regions,
}: FormFieldsProps) {
  const renderSelectField = (
    label: string,
    field: keyof FormData,
    options: MasterData[],
    optionLabelKey: keyof MasterData
  ) => (
    <div className="flex flex-col w-full">
      <label className="text-sm font-medium mb-1">{label}</label>
      <select
        value={formData[field]}
        onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
        className="w-full p-2 rounded bg-purple-800 text-white border border-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        <option value="">選択してください</option>
        {options.map((opt) => (
          <option key={`${field}-${opt.id}-${opt.name}`} value={opt.id}>
            {opt[optionLabelKey]}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <>
      {renderSelectField('区分入力', 'category', categories, 'name')}
      {renderSelectField('関係機関名', 'organization', organizations, 'name')}
      {renderSelectField('担当者名', 'representative', representatives, 'name')}
      {renderSelectField('エリア', 'region', regions, 'name')}

      {[
        { label: '電話番号', field: 'phone' },
        { label: '携帯番号', field: 'mobile' },
        { label: 'FAX', field: 'fax' },
        { label: 'メールアドレス', field: 'email' },
        { label: '住所', field: 'address' },
        { label: '備考', field: 'notes' },
      ].map(({ label, field }) => (
        <div key={field} className="flex flex-col w-full">
          <label className="text-sm font-medium mb-1">{label}</label>
          <input
            type="text"
            value={formData[field as keyof FormData]}
            onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
            className="w-full p-2 rounded bg-purple-800 text-white border border-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      ))}
    </>
  );
} 