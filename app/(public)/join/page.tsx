'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Phone, BookOpen } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Card from '@/components/ui/Card';
import { memberService } from '@/lib/database';
import { isValidEmail, isValidPhone } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function JoinPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    semester: '',
    course: '',
    reason: '',
    subscribe: true,
  });

  const [errors, setErrors] = useState<any>({});

  const validate = () => {
    const newErrors: any = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!isValidPhone(formData.phone)) {
      newErrors.phone = 'Invalid phone number (10 digits)';
    }
    if (!formData.semester) newErrors.semester = 'Semester is required';
    if (!formData.course.trim()) newErrors.course = 'Course is required';
    if (!formData.reason.trim()) newErrors.reason = 'Please tell us why you want to join';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);

    try {
      await memberService.create({
        ...formData,
        status: 'Pending',
      });

      toast.success('Application submitted successfully! We\'ll contact you soon.');

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        semester: '',
        course: '',
        reason: '',
        subscribe: true,
      });
      setErrors({});
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-20 bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-dark-bg dark:via-dark-card dark:to-dark-bg min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 mb-6">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Join <span className="gradient-text">AIML Club</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Be part of an innovative community passionate about AI and Machine Learning
          </p>
        </motion.div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <BenefitCard
            icon={<BookOpen className="w-6 h-6" />}
            title="Learn & Grow"
            description="Access exclusive workshops and learning resources"
          />
          <BenefitCard
            icon={<UserPlus className="w-6 h-6" />}
            title="Network"
            description="Connect with like-minded tech enthusiasts"
          />
          <BenefitCard
            icon={<Mail className="w-6 h-6" />}
            title="Opportunities"
            description="Get notified about hackathons and events"
          />
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <Input
                label="Full Name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                error={errors.name}
                required
              />

              {/* Email & Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  error={errors.email}
                  required
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  error={errors.phone}
                  required
                />
              </div>

              {/* Semester & Course */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Semester <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.semester}
                    onChange={(e) =>
                      setFormData({ ...formData, semester: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg border bg-white dark:bg-dark-card border-gray-300 dark:border-dark-border focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  >
                    <option value="">Select Semester</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                      <option key={sem} value={sem}>
                        Semester {sem}
                      </option>
                    ))}
                  </select>
                  {errors.semester && (
                    <p className="mt-1 text-sm text-red-600">{errors.semester}</p>
                  )}
                </div>

                <Input
                  label="Course/Branch"
                  placeholder="e.g., CSE, ECE, AI/ML"
                  value={formData.course}
                  onChange={(e) =>
                    setFormData({ ...formData, course: e.target.value })
                  }
                  error={errors.course}
                  required
                />
              </div>

              {/* Reason */}
              <Textarea
                label="Why do you want to join AIML Club?"
                placeholder="Tell us about your interest in AI/ML and what you hope to gain..."
                value={formData.reason}
                onChange={(e) =>
                  setFormData({ ...formData, reason: e.target.value })
                }
                error={errors.reason}
                required
                rows={5}
              />

              {/* Subscribe */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="subscribe"
                  checked={formData.subscribe}
                  onChange={(e) =>
                    setFormData({ ...formData, subscribe: e.target.checked })
                  }
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <label htmlFor="subscribe" className="text-sm text-gray-700 dark:text-gray-300">
                  Subscribe to receive updates about events and workshops
                </label>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={loading}
                className="w-full"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Submit Application
              </Button>
            </form>
          </Card>
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400"
        >
          <p>
            Your application will be reviewed by our team. You'll receive a confirmation
            email once your membership is approved.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function BenefitCard({ icon, title, description }: any) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="p-6 text-center h-full hover:shadow-xl transition-shadow">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900 dark:to-secondary-900 text-primary-600 dark:text-primary-400 mb-4">
          {icon}
        </div>
        <h3 className="font-semibold mb-2 text-lg">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{description}</p>
      </Card>
    </motion.div>
  );
}
