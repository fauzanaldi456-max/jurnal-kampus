import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import {
  FileText,
  Upload,
  User,
  Plus,
  Trash2,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Building,
  ShieldCheck,
  Send,
} from 'lucide-react';

export const AuthorNewSubmissionView: React.FC = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [step, setStep] = useState<number>(1);
  const [journals, setJournals] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [journalId, setJournalId] = useState('');
  const [category, setCategory] = useState('Original Research');
  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [keywords, setKeywords] = useState('');

  // Co-authors
  const [coAuthors, setCoAuthors] = useState<
    { full_name: string; email: string; institution: string; orcid: string }[]
  >([]);

  // File
  const [fileName, setFileName] = useState('');
  const [agreeOriginality, setAgreeOriginality] = useState(false);
  const [agreeCope, setAgreeCope] = useState(false);

  useEffect(() => {
    // Load journals list from public API
    fetch('/api/v1/public/journals')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.journals.length > 0) {
          setJournals(data.journals);
          setJournalId(data.journals[0].id);
        }
      })
      .catch(console.error);
  }, []);

  const handleAddCoAuthor = () => {
    setCoAuthors([...coAuthors, { full_name: '', email: '', institution: '', orcid: '' }]);
  };

  const handleRemoveCoAuthor = (idx: number) => {
    setCoAuthors(coAuthors.filter((_, i) => i !== idx));
  };

  const handleCoAuthorChange = (idx: number, field: string, value: string) => {
    const updated = [...coAuthors];
    (updated[idx] as any)[field] = value;
    setCoAuthors(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalId || !title || !abstract) {
      alert('Mohon lengkapi jurnal tujuan, judul naskah, dan abstrak.');
      return;
    }

    if (!agreeOriginality || !agreeCope) {
      alert('Anda wajib menyetujui pernyataan orisinalitas dan standar etika COPE.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch('/api/v1/author/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          journal_id: journalId,
          title,
          abstract,
          keywords,
          category,
          co_authors: coAuthors,
          file_name: fileName || 'Naskah_Publikasi_Cendraloka.pdf',
          file_path: '/uploads/manuscript_' + Date.now() + '.pdf',
          file_size: 1540000,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert(`Naskah berhasil diajukan dengan nomor ${data.submissionNumber}!`);
        navigate(`/author/submissions/${data.submissionId}`);
      } else {
        alert(data.message || 'Gagal mengajukan naskah.');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan koneksi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout
      title="Pengajuan Naskah Baru"
      subtitle="Prosedur 4 langkah pengajuan naskah ilmiah ke dewan redaksi jurnal konsorsium Cendraloka."
      actionButton={
        <Link
          to="/author/submissions"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </Link>
      }
    >
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Step Indicator Header */}
        <div className="border-b border-slate-200 px-6 py-4 bg-slate-50/70">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {[
              { num: 1, title: 'Pilih Jurnal' },
              { num: 2, title: 'Detail Naskah' },
              { num: 3, title: 'Penulis' },
              { num: 4, title: 'Berkas & Etika' },
            ].map((s) => (
              <div key={s.num} className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step === s.num
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                      : step > s.num
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {step > s.num ? '✓' : s.num}
                </div>
                <span
                  className={`hidden sm:inline text-xs font-semibold ${
                    step === s.num ? 'text-blue-700 font-bold' : 'text-slate-500'
                  }`}
                >
                  {s.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Form Container */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8">
          {/* STEP 1: Journal Selection */}
          {step === 1 && (
            <div className="space-y-5 max-w-2xl mx-auto animate-fadeIn">
              <h3 className="font-['Space_Grotesk'] text-base font-bold text-slate-900 mb-1">
                Langkah 1: Pilih Jurnal Tujuan & Kategori Naskah
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Pilih jurnal ilmiah terakreditasi yang sesuai dengan ruang lingkup dan fokus penelitian Anda.
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">Jurnal Sasaran *</label>
                <div className="space-y-2">
                  {journals.map((j) => (
                    <label
                      key={j.id}
                      className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                        journalId === j.id
                          ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="journal"
                        value={j.id}
                        checked={journalId === j.id}
                        onChange={(e) => setJournalId(e.target.value)}
                        className="mt-1 text-blue-600"
                      />
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-bold text-slate-900 text-xs sm:text-sm">{j.title}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                            {j.sinta_accreditation || 'Terakreditasi'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed mb-1">{j.description}</p>
                        <span className="text-[10px] text-slate-400 font-mono">
                          e-ISSN: {j.issn_online} • Penerbit: {j.publisher}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">Kategori / Tipe Artikel *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-blue-600"
                >
                  <option value="Original Research">Original Research (Artikel Hasil Riset Empiris)</option>
                  <option value="Review Article">Review Article / Systematic Literature Review</option>
                  <option value="Short Communication">Short Communication / Hasil Awal</option>
                  <option value="Case Study">Case Study (Studi Kasus Kebijakan/Sistem)</option>
                </select>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <span>Lanjutkan ke Detail Naskah</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Title, Abstract, Keywords */}
          {step === 2 && (
            <div className="space-y-5 max-w-2xl mx-auto animate-fadeIn">
              <h3 className="font-['Space_Grotesk'] text-base font-bold text-slate-900 mb-1">
                Langkah 2: Judul, Abstrak & Kata Kunci
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Tuliskan judul informatif dan abstrak terstruktur yang memuat latar belakang, metode, hasil utama, dan implikasi.
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">Judul Lengkap Naskah *</label>
                <textarea
                  required
                  rows={2}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Analisis Kinerja Model Klasifikasi Sentimen Menggunakan Pendekatan Deep Learning..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Abstrak Naskah (Maks. 250 Kata) *
                </label>
                <textarea
                  required
                  rows={6}
                  value={abstract}
                  onChange={(e) => setAbstract(e.target.value)}
                  placeholder="Uraikan intisari penelitian secara ringkas dan padat..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-blue-600 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Kata Kunci (Dipisahkan Koma) *
                </label>
                <input
                  type="text"
                  required
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="Contoh: Artificial Intelligence, Deep Learning, Natural Language Processing"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 rounded-full border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Kembali</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!title.trim() || !abstract.trim()) {
                      alert('Mohon isi judul dan abstrak naskah.');
                      return;
                    }
                    setStep(3);
                  }}
                  className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <span>Lanjutkan ke Data Penulis</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Co-authors */}
          {step === 3 && (
            <div className="space-y-5 max-w-2xl mx-auto animate-fadeIn">
              <h3 className="font-['Space_Grotesk'] text-base font-bold text-slate-900 mb-1">
                Langkah 3: Penulis Utama & Penulis Pendamping
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Penulis utama secara otomatis menggunakan akun yang sedang masuk. Tambahkan rekan penulis jika naskah merupakan karya kolaboratif.
              </p>

              {/* Primary Author Card */}
              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200 flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {user?.full_name?.charAt(0) || 'P'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{user?.full_name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white">
                      Penulis Korespondensi
                    </span>
                  </div>
                  <span className="block text-xs text-slate-600">{user?.institution || 'Afiliasi Kampus'}</span>
                  <span className="block text-[11px] text-slate-400 font-mono">{user?.email}</span>
                </div>
              </div>

              {/* Co-Authors dynamic list */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Penulis Pendamping (Co-Authors)
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddCoAuthor}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 text-xs font-bold transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Penulis</span>
                  </button>
                </div>

                {coAuthors.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">
                    Belum ada penulis pendamping. Klik tombol di atas jika ada penulis kedua, ketiga, dst.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {coAuthors.map((ca, idx) => (
                      <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-700">Penulis Ke-{idx + 2}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveCoAuthor(idx)}
                            className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <input
                            type="text"
                            placeholder="Nama Lengkap dengan Gelar"
                            value={ca.full_name}
                            onChange={(e) => handleCoAuthorChange(idx, 'full_name', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                          />
                          <input
                            type="email"
                            placeholder="Alamat Email Institusi"
                            value={ca.email}
                            onChange={(e) => handleCoAuthorChange(idx, 'email', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                          />
                          <input
                            type="text"
                            placeholder="Afiliasi / Universitas"
                            value={ca.institution}
                            onChange={(e) => handleCoAuthorChange(idx, 'institution', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                          />
                          <input
                            type="text"
                            placeholder="ORCID iD (Opsional)"
                            value={ca.orcid}
                            onChange={(e) => handleCoAuthorChange(idx, 'orcid', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 rounded-full border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Kembali</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <span>Lanjutkan ke Unggah Berkas</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: File & Ethics Agreements */}
          {step === 4 && (
            <div className="space-y-5 max-w-2xl mx-auto animate-fadeIn">
              <h3 className="font-['Space_Grotesk'] text-base font-bold text-slate-900 mb-1">
                Langkah 4: Unggah Naskah & Pernyataan Etika
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Unggah dokumen lengkap naskah Anda dan konfirmasi kepatuhan etika publikasi ilmiah nasional.
              </p>

              {/* File upload box */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">Berkas Naskah Lengkap (PDF/DOCX) *</label>
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-blue-500 bg-slate-50/50 transition">
                  <Upload className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-800">
                    {fileName ? `Berkas Terpilih: ${fileName}` : 'Klik untuk memilih berkas naskah'}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">Format PDF atau DOCX. Maksimal ukuran 20 MB.</p>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setFileName(e.target.files[0].name);
                      }
                    }}
                    className="mt-3 text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              </div>

              {/* Ethics Checkboxes */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Pernyataan Integritas Ilmiah
                </h4>

                <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={agreeOriginality}
                    onChange={(e) => setAgreeOriginality(e.target.checked)}
                    className="mt-0.5 text-blue-600"
                  />
                  <span className="text-xs text-slate-700 leading-relaxed">
                    Saya menyatakan bahwa naskah ini adalah <strong>karya orisinal</strong>, belum pernah diterbitkan di jurnal lain, dan tidak sedang dalam proses evaluasi pada media publikasi manapun.
                  </span>
                </label>

                <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={agreeCope}
                    onChange={(e) => setAgreeCope(e.target.checked)}
                    className="mt-0.5 text-blue-600"
                  />
                  <span className="text-xs text-slate-700 leading-relaxed">
                    Seluruh penulis menyetujui kebijakan publikasi, kepatuhan etika Committee on Publication Ethics (COPE), dan bersedia mengikuti proses peer-review hingga tuntas.
                  </span>
                </label>
              </div>

              <div className="flex justify-between pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-5 py-2.5 rounded-full border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Kembali</span>
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-7 py-3 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md shadow-blue-500/20 transition cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Mengirim Naskah...' : 'Kirim Naskah ke Dewan Editor'}</span>
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </DashboardLayout>
  );
};
