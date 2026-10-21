import React from 'react';
import {
  ShieldCheck,
  Award,
  BookOpen,
  Globe,
  Database,
  Building,
  ExternalLink,
  MapPin,
  Clock,
  Mail,
  Phone,
  FileCheck,
  CheckCircle2,
  Lock,
  ArrowRight
} from 'lucide-react';
import { EDITORIAL_MEMBERS, PARTNER_FACULTIES } from '../data/mockData';

interface AboutViewProps {
  onOpenTicket: () => void;
  onOpenWaiver: () => void;
  onNavigatePublicationGuide: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({
  onOpenTicket,
  onNavigatePublicationGuide
}) => {
  return (
    <div className="bg-white min-h-screen text-slate-900">
      {/* Hero Manifesto Header */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-24 border-b border-slate-200/80 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="font-['Space_Grotesk'] text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.2] mb-6">
              Membangun Ekosistem Publikasi Ilmiah Nusantara yang Adil, Transparan, dan Bereputasi Global
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8">
              Cendraloka adalah konsorsium penerbitan akademis nirlaba yang mengintegrasikan tata kelola <strong className="text-slate-900">24 jurnal ilmiah nasional</strong> terakreditasi, infrastruktur Open Journal Systems (OJS 3.4), audit integritas berbasis standar COPE internasional, dan diseminasi riset berkualitas tinggi tanpa hambatan komersialisasi.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={onNavigatePublicationGuide}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all cursor-pointer group"
              >
                <span>Pelajari Standar Editorial</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={onOpenTicket}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs sm:text-sm transition-all shadow-xs cursor-pointer"
              >
                <span>Hubungi Sekretariat Redaksi</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Charter Card & Bambang's Statement */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-10 mb-16 relative z-10">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <div className="flex items-center gap-2 text-xs font-['JetBrains_Mono'] font-bold text-slate-500 mb-3 uppercase tracking-wider">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                <span>Piagam Pengesahan Konsorsium • SK No. 048/SK-KONSOR/JRNX/2023</span>
              </div>
              <blockquote className="text-base sm:text-xl font-medium text-slate-800 leading-relaxed italic mb-4 font-serif">
                &ldquo;Publikasi ilmiah bukan komoditas monopoli komersial, melainkan amanat peradaban publik. Di Cendraloka, kami mendedikasikan infrastruktur independen agar para peneliti Indonesia dan kawasan ASEAN dapat mendiseminasikan kebaruan sains dengan ketat, terpercaya, dan terjangkau secara universal.&rdquo;
              </blockquote>
              <div className="flex items-center gap-4 pt-2">
                <div>
                  <h4 className="font-['Space_Grotesk'] font-bold text-slate-900 text-sm">Prof. Dr. Bambang Sudarmono, M.Sc., Ph.D.</h4>
                  <p className="text-xs text-slate-500">Ketua Dewan Pembina Konsorsium Cendraloka • Guru Besar Rekayasa Komputasi</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-50/70 rounded-2xl p-6 border border-slate-200 text-xs text-slate-600 space-y-3">
              <h5 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span>Komitmen Transparansi Q1 2025</span>
              </h5>
              <div className="space-y-2.5 pt-1">
                <div className="flex justify-between items-center py-1.5 border-b border-slate-200/80">
                  <span>Jurnal Terakreditasi:</span>
                  <strong className="text-slate-900 font-mono">24 Jurnal (SINTA 1–4)</strong>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-200/80">
                  <span>Naskah Terbit Total:</span>
                  <strong className="text-slate-900 font-mono">1.480+ Naskah</strong>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-200/80">
                  <span>Rerata Siklus Review:</span>
                  <strong className="text-emerald-700 font-mono">32 Hari Kerja</strong>
                </div>
                <div className="flex justify-between items-center py-1.5">
                  <span>Bebas Biaya APC:</span>
                  <strong className="text-blue-600 font-mono">64% Penerbitan Bersubsidi</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Core Pillars Bento Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
            Empat Pilar Fundamental Tata Kelola Cendraloka
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Prinsip teguh yang menjadi pondasi setiap proses penerbitan naskah, penilaian sejawat, dan pengarsipan permanen.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pillar 1 */}
          <div className="card-ref p-6 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center mb-5">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="font-['Space_Grotesk'] font-bold text-slate-900 text-base mb-2">
                Demokratisasi Open Access
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Semua naskah terbitan konsorsium dapat diakses, diunduh, dan dikutip secara cuma-cuma oleh publik di bawah lisensi resmi Creative Commons CC BY 4.0 tanpa paywall komersial.
              </p>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="card-ref p-6 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-['Space_Grotesk'] font-bold text-slate-900 text-base mb-2">
                Integritas & Etika COPE
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Kepatuhan penuh pada protokol Committee on Publication Ethics (COPE). Setiap naskah melewati double-blind peer review independen dan skrining similaritas Turnitin ketat.
              </p>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="card-ref p-6 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mb-5">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="font-['Space_Grotesk'] font-bold text-slate-900 text-base mb-2">
                Preservasi Abadi (Perpetual)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Jaminan arsip digital permanen terdesentralisasi melalui LOCKSS, CLOCKSS, dan PKP Preservation Network sehingga karya ilmiah terjamin kelestariannya tanpa batas waktu.
              </p>
            </div>
          </div>

          {/* Pillar 4 */}
          <div className="card-ref p-6 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center mb-5">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="font-['Space_Grotesk'] font-bold text-slate-900 text-base mb-2">
                Interoperabilitas Metadata
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Registrasi DOI resmi via Crossref, integrasi ORCID auto-update, feed OAI-PMH terstandarisasi, dan sinkronisasi otomatis ke pangkalan data SINTA, DOAJ, dan Google Scholar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Leadership & Governance */}
      <section className="bg-slate-50/70 border-y border-slate-200/80 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-extrabold text-slate-900">
                Dewan Editor & Komite Integritas Konsorsium
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md">
              Dipimpin oleh para akademisi berkaliber tinggi dengan rekam jejak riset internasional teruji dan komitmen independensi saintifik.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {EDITORIAL_MEMBERS.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-slate-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all group"
              >
                <div>
                  {/* Portrait with Hotlinked URL */}
                  <div className="relative mb-5 overflow-hidden rounded-2xl bg-slate-100 aspect-square">
                    <img
                      src={member.imageUrl}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute top-2.5 right-2.5 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-mono px-2.5 py-1 rounded-full font-semibold">
                      {member.role}
                    </div>
                  </div>

                  <h3 className="font-['Space_Grotesk'] font-bold text-slate-900 text-sm mb-1 group-hover:text-blue-600 transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-xs font-semibold text-blue-600 mb-2">
                    {member.subRole}
                  </p>
                  <p className="text-xs text-slate-500 mb-3 flex items-start gap-1.5">
                    <Building className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-400" />
                    <span>{member.institution}</span>
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed mb-5 line-clamp-3">
                    {member.bio}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-1.5 text-[11px]">
                  {member.scopusHIndex && (
                    <div className="flex justify-between text-slate-600">
                      <span>Scopus h-index:</span>
                      <strong className="text-slate-900 font-mono">{member.scopusHIndex}</strong>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-slate-600">
                    <span className="font-mono text-[#a6ce39] font-bold">ORCID:</span>
                    <a
                      href={member.orcidUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline font-mono inline-flex items-center gap-1"
                    >
                      {member.orcid}
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Faculties & Research Centers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
            Fakultas & Pusat Riset Pendiri Konsorsium
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Jejaring 6 institusi perguruan tinggi dan lembaga riset nasional yang mengolaborasikan sumber daya penelaah sejawat dan teknologi penerbitan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PARTNER_FACULTIES.map((faculty) => (
            <div
              key={faculty.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:border-slate-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all"
            >
              <div className="flex items-center justify-between mb-3.5">
                <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-slate-100 text-slate-700">
                  {faculty.code}
                </span>
                <span className="text-xs text-blue-600 font-semibold">
                  {faculty.cluster}
                </span>
              </div>
              <h3 className="font-['Space_Grotesk'] font-bold text-slate-900 text-base mb-2">
                {faculty.name}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {faculty.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Indexation & Standards Badges - Modern Dark Accent Section matching Reference */}
      <section className="bg-slate-950 text-white py-16 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h3 className="text-base font-bold text-white mb-1">
              Kepatuhan Standar Etika & Pengindeksan Internasional
            </h3>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-slate-300">
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-900 border border-slate-800">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span className="font-bold text-white text-xs sm:text-sm tracking-wide">COPE Member</span>
            </div>
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-900 border border-slate-800">
              <BookOpen className="w-5 h-5 text-amber-400" />
              <span className="font-bold text-white text-xs sm:text-sm tracking-wide">DOAJ Indexed</span>
            </div>
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-900 border border-slate-800">
              <Award className="w-5 h-5 text-cyan-400" />
              <span className="font-bold text-white text-xs sm:text-sm tracking-wide">Crossref DOI</span>
            </div>
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-900 border border-slate-800">
              <Building className="w-5 h-5 text-rose-400" />
              <span className="font-bold text-white text-xs sm:text-sm tracking-wide">SINTA Kemendiktisaintek</span>
            </div>
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-900 border border-slate-800">
              <Lock className="w-5 h-5 text-indigo-400" />
              <span className="font-bold text-white text-xs sm:text-sm tracking-wide">PKP LOCKSS Archive</span>
            </div>
          </div>
        </div>
      </section>

      {/* Secretariat Office & Contact Location */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div>
                <h2 className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
                  Pusat Layanan Redaksi & Bantuan Peneliti
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Sekretariat eksekutif bertugas memberikan bimbingan teknis integrasi OJS, penerbitan DOI Crossref naskah darurat, serta verifikasi kelayakan beasiswa pembebasan biaya publikasi (APC Waiver).
                </p>
              </div>

              <div className="space-y-3.5 text-xs sm:text-sm text-slate-700">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900">Gedung Riset Terpadu Nusantara, Lantai 4</strong>
                    <p className="text-slate-500 text-xs mt-0.5">Kawasan Sains & Edukasi UI, Jl. Margonda Raya No. 100, Kota Depok, Jawa Barat 16424</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Senin – Jumat, Pukul 08.00 – 17.00 WIB (Kecuali Hari Libur Nasional)</span>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                  <a href="mailto:sekretariat@cendraloka.or.id" className="text-blue-600 hover:underline font-mono">
                    sekretariat@cendraloka.or.id
                  </a>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="font-mono text-slate-800">+62 (21) 7884-9120 / WhatsApp Helpdesk: +62 811-920-4141</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onOpenTicket}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
                >
                  <Mail className="w-4 h-4 text-blue-400" />
                  <span>Buat Tiket Pertanyaan Redaksi</span>
                </button>
              </div>
            </div>

            {/* Map Preview Graphic */}
            <div className="lg:col-span-6">
              <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-sm relative group bg-slate-100">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJ-L6uE02bJZlU59jtOupITD98go2BDTXg6GsNsNzaS0lpSqiz1GblWKk2zTQdqRmGn54l2VL4z7yK183mwv-aGgeCiAAxLDD24W9cZw3u2vP7E2ZKYTVxiQGT6m3hTvuWPkoACa7iU3LvgpHw25S3MqwiTDivSaWTuJXqN6vaytxYsFwVYQq9kmVtDYMokmJXetL8vMf-rRXHxf90AgkXavTnIbcG2V2BjXUWAhS69QTVOEKB35WNbA"
                  alt="Lokasi Sekretariat Cendraloka"
                  className="w-full h-80 sm:h-96 object-cover group-hover:scale-102 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex items-end p-6">
                  <div className="text-white text-xs">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full font-mono font-bold text-[10px] inline-block mb-2">
                      KAMPUS RISET TERPADU
                    </span>
                    <p className="font-['Space_Grotesk'] font-bold text-sm sm:text-base">Laboratorium & Pusat Data Konsorsium Cendraloka</p>
                    <p className="text-slate-300 text-[11px] mt-0.5">Terhubung dengan Jaringan Riset Indonesia (Inherent 10 Gbps)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
