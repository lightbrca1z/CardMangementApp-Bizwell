import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import FormFields from './FormFields';
import ImageUpload from './ImageUpload';
import FormButtons from './FormButtons';

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

export default function FormContainer() {
  const [formData, setFormData] = useState<FormData>({
    category: '',
    organization: '',
    representative: '',
    phone: '',
    mobile: '',
    fax: '',
    email: '',
    region: '',
    address: '',
    notes: '',
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ▼ マスター取得
  const [categories, setCategories] = useState<any[]>([]);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [representatives, setRepresentatives] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]);

  useEffect(() => {
    const fetchMasters = async () => {
      const [cat, org, rep, reg] = await Promise.all([
        supabase.from('category').select('*'),
        supabase.from('organization').select('*'),
        supabase.from('representative').select('*'),
        supabase.from('region').select('*'),
      ]);
      if (cat.data) setCategories(cat.data);
      if (org.data) setOrganizations(org.data);
      if (rep.data) setRepresentatives(rep.data);
      if (reg.data) setRegions(reg.data);
    };
    fetchMasters();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      // ① 必須チェック
      const requiredFields = ['category', 'organization', 'representative', 'region'];
      const missingFields = requiredFields.filter(key => !formData[key as keyof FormData]);
      if (missingFields.length > 0) {
        alert('必須項目が未選択です');
        setIsSubmitting(false);
        return;
      }

      // ② マスターの登録処理
      const upsertMaster = async (table: string, nameField: string, value: string) => {
        const { data: existingData, error: searchError } = await supabase
          .from(table)
          .select('*')
          .eq(nameField, value)
          .single();

        if (searchError && searchError.code !== 'PGRST116') {
          throw searchError;
        }

        if (existingData) {
          return existingData[`${table}id`];
        }

        const { data: newData, error: insertError } = await supabase
          .from(table)
          .insert([{ [nameField]: value }])
          .select()
          .single();

        if (insertError) throw insertError;
        return newData[`${table}id`];
      };

      // ③ 各マスターのIDを取得
      const categoryId = await upsertMaster('category', 'categoryname', formData.category);
      const organizationId = await upsertMaster('organization', 'organizationname', formData.organization);
      const representativeId = await upsertMaster('representative', 'representativename', formData.representative);
      const regionId = await upsertMaster('region', 'regionname', formData.region);

      // ④ 画像アップロード処理
      let public_url: string | null = null;
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop() || 'png';
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `uploads/${fileName}`;
        const { error: uploadError } = await supabase.storage.from('images').upload(filePath, selectedFile);
        if (uploadError) throw new Error(uploadError.message);

        const { data: publicUrlData } = supabase.storage.from('images').getPublicUrl(filePath);
        if (!publicUrlData?.publicUrl) throw new Error('画像URL取得失敗');
        public_url = publicUrlData.publicUrl;
      }

      // ⑤ businesscard 登録
      const { data: existingCard, error: checkError } = await supabase
        .from('businesscard')
        .select('*')
        .eq('email', formData.email.trim())
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingCard) {
        const { error: updateError } = await supabase
          .from('businesscard')
          .update({
            categoryid: categoryId,
            organizationid: organizationId,
            representativeid: representativeId,
            regionid: regionId,
            phone: formData.phone.trim(),
            mobile: formData.mobile.trim(),
            fax: formData.fax.trim(),
            address: formData.address.trim(),
            notes: formData.notes.trim(),
            imageurl: public_url,
          })
          .eq('email', formData.email.trim());

        if (updateError) throw new Error(updateError.message);
      } else {
        const { error: insertError } = await supabase
          .from('businesscard')
          .insert([{
            categoryid: categoryId,
            organizationid: organizationId,
            representativeid: representativeId,
            regionid: regionId,
            phone: formData.phone.trim(),
            mobile: formData.mobile.trim(),
            fax: formData.fax.trim(),
            email: formData.email.trim(),
            address: formData.address.trim(),
            notes: formData.notes.trim(),
            imageurl: public_url,
          }]);

        if (insertError) throw new Error(insertError.message);
      }

      alert('登録が完了しました');
      setFormData({
        category: '',
        organization: '',
        representative: '',
        phone: '',
        mobile: '',
        fax: '',
        email: '',
        region: '',
        address: '',
        notes: '',
      });
      setSelectedFile(null);
      setPreviewUrl(null);

    } catch (err: any) {
      console.error('登録エラー', err);
      alert(err.message || 'エラーが発生しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
      <div className="bg-purple-900 text-white p-6 rounded-2xl w-full lg:w-2/3 shadow-lg">
        <h2 className="bg-purple-400 text-center text-xl font-bold py-2 rounded-t-2xl mb-4">入力フォーム</h2>
        <form onSubmit={handleSubmit} className="space-y-4 text-sm flex flex-col items-start w-full">
          <FormFields
            formData={formData}
            setFormData={setFormData}
            categories={categories}
            organizations={organizations}
            representatives={representatives}
            regions={regions}
          />
          <FormButtons handleSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </form>
      </div>

      <ImageUpload
        selectedFile={selectedFile}
        previewUrl={previewUrl}
        handleFileChange={handleFileChange}
      />
    </main>
  );
} 