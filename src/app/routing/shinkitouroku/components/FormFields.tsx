interface FormFieldsProps {
  formData: any;
  setFormData: (data: any) => void;
  categories: any[];
  organizations: any[];
  representatives: any[];
  regions: any[];
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
    field: string,
    options: any[],
    optionLabelKey: string
  ) => (
    <div className="flex flex-col space-y-1 w-full">
      <label className="text-sm">{label} <span className="text-red-500">※は必須項目です</span></label>
      <select
        className="bg-white text-black p-2 rounded border-2 border-purple-500 w-full"
        value={formData[field]}
        onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
        required
      >
        <option value="">選択してください</option>
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>{opt[optionLabelKey]}</option>
        ))}
      </select>
    </div>
  );

  return (
    <>
      {renderSelectField('区分入力', 'category', categories, 'categoryname')}
      {renderSelectField('関係機関名', 'organization', organizations, 'organizationname')}
      {renderSelectField('担当者名', 'representative', representatives, 'representativename')}
      {renderSelectField('エリア', 'region', regions, 'regionname')}

      {[
        { label: 'TEL', field: 'phone', required: true },
        { label: '携帯', field: 'mobile', required: false },
        { label: 'FAX', field: 'fax', required: false },
        { label: 'メール', field: 'email', required: true },
        { label: '住所', field: 'address', required: false },
        { label: '備考', field: 'notes', required: false },
      ].map(({ label, field, required }) => (
        <div key={field} className="flex flex-col space-y-1 w-full">
          <label>{label}{required && <span className="text-red-500">※は必須項目です</span>}</label>
          <input
            type={field === 'email' ? 'email' : 'text'}
            className="bg-white text-black p-2 rounded border-2 border-purple-500 w-full"
            placeholder={label}
            required={required}
            value={formData[field]}
            onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
          />
        </div>
      ))}
    </>
  );
} 