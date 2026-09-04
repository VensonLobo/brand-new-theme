'use client';

import React, { useState, useEffect } from 'react';
import { COMPANY_DETAILS } from '@/lib/data';
import { X, CheckCircle2, Phone, Calendar, Users, MapPin, Send, MessageCircle } from 'lucide-react';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDestination?: string;
  defaultPackageName?: string;
}

export function EnquiryModal({
  isOpen,
  onClose,
  defaultDestination = '',
  defaultPackageName = '',
}: EnquiryModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      id="enquiry-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <EnquiryModalForm
        key={`${defaultDestination}-${defaultPackageName}`}
        onClose={onClose}
        defaultDestination={defaultDestination}
        defaultPackageName={defaultPackageName}
      />
    </div>
  );
}

function EnquiryModalForm({
  onClose,
  defaultDestination,
  defaultPackageName,
}: {
  onClose: () => void;
  defaultDestination: string;
  defaultPackageName: string;
}) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    destination: defaultDestination,
    travelDates: '',
    travelers: '2 Adults',
    requirements: defaultPackageName ? `Enquiring regarding: ${defaultPackageName}` : '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      try {
        const storedLeads = JSON.parse(localStorage.getItem('lobo_enquiries') || '[]');
        storedLeads.push({
          ...formData,
          submittedAt: new Date().toISOString(),
          id: 'LT-' + Math.floor(100000 + Math.random() * 900000),
        });
        localStorage.setItem('lobo_enquiries', JSON.stringify(storedLeads));
      } catch (err) {
        console.error('Storage error', err);
      }
    }, 600);
  };

  const generateWhatsAppUrl = () => {
    const text = encodeURIComponent(
      `Hello Lobo Travels! I would like to plan a custom trip.\n` +
      `• Name: ${formData.name || 'Traveler'}\n` +
      `• Destination: ${formData.destination || 'India'}\n` +
      `• Travelers: ${formData.travelers}\n` +
      `• Preferred Dates: ${formData.travelDates || 'Flexible'}\n` +
      (formData.requirements ? `• Notes: ${formData.requirements}` : '')
    );
    return `https://wa.me/${COMPANY_DETAILS.whatsappNumber}?text=${text}`;
  };

  return (
    <div
      className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto bg-white border border-gray-200 p-6 sm:p-8 text-[#0A1128] shadow-2xl"
      id="enquiry-modal-content"
    >
      <button
        onClick={onClose}
        id="close-enquiry-modal-btn"
        className="absolute top-5 right-5 p-2 text-stone-400 hover:text-[#0A1128] transition-colors"
        aria-label="Close dialog"
      >
        <X className="w-5 h-5" />
      </button>

        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-[#C5A059]/20 text-[#C5A059] mb-2 font-bold text-xl">
              ✓
            </div>
            <h3 className="text-2xl font-serif italic text-[#0A1128]">
              Itinerary Request Received
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
              Thank you, <span className="font-bold text-[#0A1128]">{formData.name}</span>. A senior travel designer from our Mandir Marg, New Delhi desk is reviewing your requirements and will reach out to you within 24 hours.
            </p>
            <div className="p-4 bg-[#F7F5F2] border border-gray-200 text-left text-xs text-stone-700 space-y-1">
              <p className="font-serif italic font-bold text-[#0A1128]">Your Trip Highlights:</p>
              <p>• Destination: {formData.destination || 'Custom Selection'}</p>
              <p>• Preferred Dates: {formData.travelDates || 'Flexible'}</p>
              <p>• Contact: {formData.phone} | {formData.email}</p>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={generateWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#25D366] text-[#0A1128] font-bold text-xs uppercase tracking-wider hover:bg-emerald-400 transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                Chat Instantly on WhatsApp
              </a>
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="px-5 py-3 bg-stone-100 text-[#0A1128] font-bold text-xs uppercase tracking-wider hover:bg-stone-200 transition-colors"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6 pr-6">
              <span className="inline-block text-[10px] uppercase tracking-[0.25em] font-bold text-[#C5A059] mb-1">
                Bespoke Travel Consultation
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif italic text-[#0A1128] leading-tight">
                {defaultPackageName ? `Customise: ${defaultPackageName}` : 'Design Your Custom Itinerary'}
              </h3>
              <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
                Tell us where and how you’d like to travel. We build every itinerary from a blank canvas with handpicked hotels and private chauffeur assistance.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" id="consultation-enquiry-form">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    id="enquiry-name-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Vikram Malhotra"
                    className="w-full border-b border-gray-200 py-2 text-sm text-[#0A1128] focus:border-[#C5A059] outline-none transition-all bg-transparent"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-1">
                    Phone Number (WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    required
                    id="enquiry-phone-input"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 9811240072"
                    className="w-full border-b border-gray-200 py-2 text-sm text-[#0A1128] focus:border-[#C5A059] outline-none transition-all bg-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    id="enquiry-email-input"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full border-b border-gray-200 py-2 text-sm text-[#0A1128] focus:border-[#C5A059] outline-none transition-all bg-transparent"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-1">
                    Destination of Interest
                  </label>
                  <input
                    type="text"
                    id="enquiry-destination-input"
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    placeholder="e.g. Rajasthan, Kashmir, Golden Triangle..."
                    className="w-full border-b border-gray-200 py-2 text-sm text-[#0A1128] focus:border-[#C5A059] outline-none transition-all bg-transparent placeholder:text-stone-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-1">
                    Approx. Travel Dates
                  </label>
                  <input
                    type="text"
                    id="enquiry-dates-input"
                    value={formData.travelDates}
                    onChange={(e) => setFormData({ ...formData, travelDates: e.target.value })}
                    placeholder="e.g. Mid-October (5-7 Days)"
                    className="w-full border-b border-gray-200 py-2 text-sm text-[#0A1128] focus:border-[#C5A059] outline-none transition-all bg-transparent"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-1">
                    Travelers Count
                  </label>
                  <input
                    type="text"
                    id="enquiry-travelers-input"
                    value={formData.travelers}
                    onChange={(e) => setFormData({ ...formData, travelers: e.target.value })}
                    placeholder="e.g. 2 Adults, 1 Child"
                    className="w-full border-b border-gray-200 py-2 text-sm text-[#0A1128] focus:border-[#C5A059] outline-none transition-all bg-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-1">
                  Specific Requests or Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  id="enquiry-notes-input"
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  placeholder="Preferences like boutique heritage stays, wheelchair ease, tiger safari permits, or romantic honeymoon inclusions..."
                  className="w-full border-b border-gray-200 py-2 text-sm text-[#0A1128] focus:border-[#C5A059] outline-none transition-all bg-transparent"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  id="enquiry-submit-btn"
                  className="w-full py-4 bg-[#0A1128] text-white hover:bg-[#C5A059] hover:text-[#0A1128] font-bold text-xs uppercase tracking-[0.2em] transition-all shadow-md disabled:opacity-75"
                >
                  <span className="inline-flex items-center gap-2">
                    <Send className="w-3.5 h-3.5" />
                    {isSubmitting ? 'Submitting Enquiry...' : 'Get a Custom Itinerary'}
                  </span>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 text-[11px] text-stone-400 border-t border-gray-100">
                <span>🔒 Direct callback within 24 hours.</span>
                <a
                  href={generateWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#0A1128] hover:text-[#C5A059] font-bold uppercase tracking-wider text-[10px]"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                  Or WhatsApp directly
                </a>
              </div>
            </form>
          </div>
        )}
      </div>
  );
}
