import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { submitToGoogleSheet } from '../../utils/formSubmit';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface ContactFormErrors {
  [key: string]: string;
}

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = (): boolean => {
    const newErrors: ContactFormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your name';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.subject.trim()) {
      newErrors.subject = 'Please provide a subject';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Please enter your message';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await submitToGoogleSheet({
        formType: 'contact',
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
      });
      setIsSubmitted(true);
    } catch {
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    });
    setErrors({});
    setIsSubmitted(false);
  };

  return (
    <section id="contact" className="py-20 md:py-28 bg-[#F8FAFC] dark:bg-[#071A10] border-t border-slate-200/80 dark:border-darkbg-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest font-bold text-brand-600 dark:text-emerald-400 mb-2 block">
            Communication
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Get In Touch
          </h2>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
            Have questions about the platform, technical integration, or community blood initiatives? Send our team a note.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-5xl mx-auto items-start">
          {/* Left: Contact Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-darkbg-card border border-slate-200/80 dark:border-darkbg-border space-y-5">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Contact Information
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Our operations and developer teams are based across Pakistan, actively coordinating with regional health partners.
              </p>

              <div className="space-y-4 pt-2 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-darkbg-800 text-brand-700 dark:text-brand-300 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-slate-500 dark:text-slate-400 text-xs">Email Inquiries</div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">contact@sehatsahara.pk</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-darkbg-800 text-brand-700 dark:text-brand-300 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-slate-500 dark:text-slate-400 text-xs">Helpdesk & Support</div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">+92 (0) 21 3456 7890</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-darkbg-800 text-brand-700 dark:text-brand-300 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-slate-500 dark:text-slate-400 text-xs">Headquarters</div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Karachi & Islamabad, Pakistan</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-brand-50/80 dark:bg-darkbg-card border border-brand-200/60 dark:border-darkbg-border text-xs text-brand-900 dark:text-brand-200">
              <strong className="block mb-1">Looking for Hospital Onboarding?</strong>
              Hospitals and clinics should use our dedicated <a href="#partner-form" className="underline font-bold hover:text-brand-700">Institutional Partner Form</a> above.
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-7 sm:p-8 rounded-3xl bg-white dark:bg-darkbg-card border border-slate-200/90 dark:border-darkbg-border shadow-xs">
              {isSubmitted ? (
                <div className="py-10 text-center space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Message Sent!
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                    Thank you for reaching out to Sehat Sahara. Our team has received your message and will get back to you shortly.
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-5 py-2.5 text-xs font-semibold rounded-full bg-slate-100 dark:bg-darkbg-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-1.5">
                      Your Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Dr. Ahmed Khan / Sara Ali"
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-white dark:bg-darkbg-900 text-slate-900 dark:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                        errors.name
                          ? 'border-rose-400 focus:ring-rose-400'
                          : 'border-slate-200 dark:border-darkbg-border'
                      }`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-rose-500 font-medium">{errors.name}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-1.5">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@domain.com"
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-white dark:bg-darkbg-900 text-slate-900 dark:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                          errors.email
                            ? 'border-rose-400 focus:ring-rose-400'
                            : 'border-slate-200 dark:border-darkbg-border'
                        }`}
                      />
                      {errors.email && (
                        <p className="mt-1 text-xs text-rose-500 font-medium">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-1.5">
                        Phone Number <span className="text-slate-400 font-normal">(Optional)</span>
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="0300 0000000"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-darkbg-border text-sm bg-white dark:bg-darkbg-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-1.5">
                      Subject <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="General inquiry, developer feedback, partnership..."
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-white dark:bg-darkbg-900 text-slate-900 dark:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                        errors.subject
                          ? 'border-rose-400 focus:ring-rose-400'
                          : 'border-slate-200 dark:border-darkbg-border'
                      }`}
                    />
                    {errors.subject && (
                      <p className="mt-1 text-xs text-rose-500 font-medium">{errors.subject}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-1.5">
                      Message <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="How can our team help you?"
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-white dark:bg-darkbg-900 text-slate-900 dark:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                        errors.message
                          ? 'border-rose-400 focus:ring-rose-400'
                          : 'border-slate-200 dark:border-darkbg-border'
                      }`}
                    />
                    {errors.message && (
                      <p className="mt-1 text-xs text-rose-500 font-medium">{errors.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full font-semibold text-white bg-brand-600 hover:bg-brand-700 active:bg-brand-800 disabled:opacity-50 transition-all shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]"
                  >
                    {isSubmitting ? (
                      <span>Sending...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
